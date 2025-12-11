import {pool} from "../config/database.js";

import {QuizModel} from "../models/Quiz.js";
import {ClassModel} from "../models/Class.js";

export const reportService = {
  async getQuizReport(quizId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      const overallStats = await pool.query(`
        SELECT 
          COUNT(DISTINCT user_id) as total_participants,
          COUNT(*) as total_attempts,
          AVG(total_score) as average_score,
          MAX(total_score) as highest_score,
          MIN(total_score) as lowest_score,
          AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60) as avg_time_minutes
        FROM quiz_attempts
        WHERE quiz_id = $1 AND status = 'completed'
      `, [quizId]);

      const scoreDistribution = await pool.query(`
        SELECT 
          CASE 
            WHEN total_score >= 8 THEN '8-10'
            WHEN total_score >= 6 THEN '6-8'
            WHEN total_score >= 4 THEN '4-6'
            WHEN total_score >= 2 THEN '2-4'
            ELSE '0-2'
          END as score_range,
          COUNT(*) as count
        FROM quiz_attempts
        WHERE quiz_id = $1 AND status = 'completed'
        GROUP BY score_range
        ORDER BY score_range DESC
      `, [quizId]);

      const questionStats = await pool.query(`
        SELECT 
          q.question_id,
          q.content,
          q.points,
          COUNT(ua.user_answer_id) as total_answers,
          SUM(CASE WHEN ua.is_correct = true THEN 1 ELSE 0 END) as correct_count,
          ROUND(
            (SUM(CASE WHEN ua.is_correct = true THEN 1 ELSE 0 END)::numeric / 
             COUNT(ua.user_answer_id)::numeric * 100), 2
          ) as correct_percentage
        FROM questions q
        LEFT JOIN user_answers ua ON q.question_id = ua.question_id
        WHERE q.quiz_id = $1 AND q.deleted_at IS NULL
        GROUP BY q.question_id
        ORDER BY q.question_order
      `, [quizId]);

      const topPerformers = await pool.query(`
        SELECT 
          u.user_name,
          u.email,
          qa.total_score,
          qa.end_time,
          EXTRACT(EPOCH FROM (qa.end_time - qa.start_time))/60 as time_taken_minutes
        FROM quiz_attempts qa
        JOIN users u ON qa.user_id = u.user_id
        WHERE qa.quiz_id = $1 AND qa.status = 'completed'
        ORDER BY qa.total_score DESC, time_taken_minutes ASC
        LIMIT 10
      `, [quizId]);

      return {
        wasSuccessful: true,
        message: "Lấy báo cáo quiz thành công",
        result: {
          quiz_info: quiz,
          overall_statistics: overallStats.rows[0],
          score_distribution: scoreDistribution.rows,
          question_statistics: questionStats.rows,
          top_performers: topPerformers.rows,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getClassReport(classId) {
    try {
      const classData = await ClassModel.findById(classId);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      const memberStats = await pool.query(`
        SELECT 
          COUNT(*) as total_members,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_members
        FROM class_members
        WHERE class_id = $1
      `, [classId]);

      const quizStats = await pool.query(`
        SELECT 
          COUNT(DISTINCT cq.quiz_id) as total_assigned_quizzes,
          COUNT(DISTINCT qa.attempt_id) as total_attempts
        FROM class_quizzes cq
        LEFT JOIN quiz_attempts qa ON cq.quiz_id = qa.quiz_id
        WHERE cq.class_id = $1
      `, [classId]);

      const assignedQuizzes = await pool.query(`
        SELECT 
          q.quiz_id,
          q.title,
          cq.assigned_at,
          cq.due_date,
          COUNT(DISTINCT qa.user_id) as completed_students,
          AVG(qa.total_score) as average_score
        FROM class_quizzes cq
        JOIN quizzes q ON cq.quiz_id = q.quiz_id
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id AND qa.status = 'completed'
        WHERE cq.class_id = $1
        GROUP BY q.quiz_id, q.title, cq.assigned_at, cq.due_date
        ORDER BY cq.assigned_at DESC
      `, [classId]);

      const studentProgress = await pool.query(`
        SELECT 
          u.user_id,
          u.user_name,
          u.email,
          COUNT(DISTINCT qa.quiz_id) as completed_quizzes,
          AVG(qa.total_score) as average_score
        FROM class_members cm
        JOIN users u ON cm.user_id = u.user_id
        LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
        LEFT JOIN class_quizzes cq ON qa.quiz_id = cq.quiz_id AND cq.class_id = $1
        WHERE cm.class_id = $1 AND cm.status = 'active'
        GROUP BY u.user_id, u.user_name, u.email
        ORDER BY average_score DESC NULLS LAST
      `, [classId]);

      return {
        wasSuccessful: true,
        message: "Lấy báo cáo lớp học thành công",
        result: {
          class_info: classData,
          member_statistics: memberStats.rows[0],
          quiz_statistics: quizStats.rows[0],
          assigned_quizzes: assignedQuizzes.rows,
          student_progress: studentProgress.rows,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserReport(userId) {
    try {
      const overallStats = await pool.query(`
        SELECT 
          COUNT(DISTINCT quiz_id) as total_quizzes_taken,
          COUNT(*) as total_attempts,
          AVG(total_score) as average_score,
          MAX(total_score) as highest_score,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_attempts
        FROM quiz_attempts
        WHERE user_id = $1
      `, [userId]);

      const recentAttempts = await pool.query(`
        SELECT 
          q.title,
          qa.total_score,
          qa.start_time,
          qa.end_time,
          qa.status
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.quiz_id
        WHERE qa.user_id = $1
        ORDER BY qa.start_time DESC
        LIMIT 10
      `, [userId]);

      const subjectPerformance = await pool.query(`
        SELECT 
          s.subject_name,
          COUNT(DISTINCT qa.quiz_id) as quizzes_taken,
          AVG(qa.total_score) as average_score
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.quiz_id
        JOIN subjects s ON q.subject_id = s.subject_id
        WHERE qa.user_id = $1 AND qa.status = 'completed'
        GROUP BY s.subject_id, s.subject_name
        ORDER BY average_score DESC
      `, [userId]);

      const progressOverTime = await pool.query(`
        SELECT 
          DATE(start_time) as date,
          COUNT(*) as attempts,
          AVG(total_score) as avg_score
        FROM quiz_attempts
        WHERE user_id = $1 AND status = 'completed'
        GROUP BY DATE(start_time)
        ORDER BY date DESC
        LIMIT 30
      `, [userId]);

      return {
        wasSuccessful: true,
        message: "Lấy báo cáo người dùng thành công",
        result: {
          overall_statistics: overallStats.rows[0],
          recent_attempts: recentAttempts.rows,
          subject_performance: subjectPerformance.rows,
          progress_over_time: progressOverTime.rows,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async compareStudents(classId, studentIds) {
    try {
      const comparison = await pool.query(`
        SELECT 
          u.user_id,
          u.user_name,
          COUNT(DISTINCT qa.quiz_id) as completed_quizzes,
          AVG(qa.total_score) as average_score,
          MAX(qa.total_score) as highest_score,
          MIN(qa.total_score) as lowest_score
        FROM users u
        LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
        LEFT JOIN class_quizzes cq ON qa.quiz_id = cq.quiz_id
        WHERE u.user_id = ANY($1) AND cq.class_id = $2 AND qa.status = 'completed'
        GROUP BY u.user_id, u.user_name
        ORDER BY average_score DESC
      `, [studentIds, classId]);

      return {
        wasSuccessful: true,
        message: "So sánh học sinh thành công",
        result: comparison.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};