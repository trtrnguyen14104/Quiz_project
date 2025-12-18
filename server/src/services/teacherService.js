import { pool } from "../config/database.js";

export const teacherService = {
  async getDashboard(userId) {
    try {
      // Get teacher statistics
      const statsQuery = await pool.query(
        `
        SELECT
          (SELECT COUNT(*)
           FROM classes
           WHERE teacher_id = $1 AND status = 'active' AND deleted_at IS NULL) as total_classes,

          (SELECT COUNT(DISTINCT cm.user_id)
           FROM classes c
           JOIN class_members cm ON c.class_id = cm.class_id
           WHERE c.teacher_id = $1 AND c.status = 'active' AND cm.status = 'active') as total_students,

          (SELECT COUNT(*)
           FROM quizzes
           WHERE creator_id = $1 AND status != 'draft') as active_quizzes,

          (SELECT COALESCE(ROUND(AVG(qa.total_score / q.total_score * 100), 2), 0)
           FROM quiz_attempts qa
           JOIN quizzes q ON qa.quiz_id = q.quiz_id
           WHERE q.creator_id = $1 AND qa.status = 'submitted' AND q.total_score > 0) as average_score
      `,
        [userId]
      );

      // Get classes with statistics
      const classesQuery = await pool.query(
        `
        SELECT
          c.class_id,
          c.class_name,
          c.class_code,
          c.description,
          s.subject_name,
          (SELECT COUNT(*) FROM class_members WHERE class_id = c.class_id AND status = 'active') as student_count,
          (SELECT COUNT(*) FROM class_quizzes WHERE class_id = c.class_id) as quiz_count,
          (SELECT COALESCE(ROUND(AVG(qa.total_score / q.total_score * 100), 2), 0)
           FROM class_quizzes cq
           JOIN quiz_attempts qa ON cq.quiz_id = qa.quiz_id
           JOIN quizzes q ON qa.quiz_id = q.quiz_id
           WHERE cq.class_id = c.class_id AND qa.status = 'submitted' AND q.total_score > 0) as score,
          c.created_at
        FROM classes c
        JOIN subjects s ON c.subject_id = s.subject_id
        WHERE c.teacher_id = $1 AND c.status = 'active' AND c.deleted_at IS NULL
        ORDER BY c.created_at DESC
        LIMIT 10
      `,
        [userId]
      );

      // Get quizzes with statistics
      const quizzesQuery = await pool.query(
        `
        SELECT
          q.quiz_id,
          q.title,
          q.quiz_code,
          q.difficulty_level,
          q.status,
          s.subject_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
          (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as attempt_count,
          (SELECT COALESCE(ROUND(AVG(total_score), 2), 0)
           FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as average_score,
          (SELECT class_name FROM classes c
           JOIN class_quizzes cq ON c.class_id = cq.class_id
           WHERE cq.quiz_id = q.quiz_id LIMIT 1) as class_name,
          (SELECT due_date FROM class_quizzes WHERE quiz_id = q.quiz_id LIMIT 1) as due_date
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.subject_id
        WHERE q.creator_id = $1
        ORDER BY q.created_at DESC
        LIMIT 10
      `,
        [userId]
      );

      // Get recent quiz attempts from students
      const recentAttemptsQuery = await pool.query(
        `
        SELECT
          qa.attempt_id,
          qa.quiz_id,
          qa.user_id,
          qa.total_score,
          q.total_score as max_score,
          qa.start_time,
          qa.end_time,
          u.user_name as student_name,
          q.title as quiz_title,
          c.class_name
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.quiz_id
        JOIN users u ON qa.user_id = u.user_id
        LEFT JOIN class_quizzes cq ON q.quiz_id = cq.quiz_id
        LEFT JOIN classes c ON cq.class_id = c.class_id
        WHERE q.creator_id = $1 AND qa.status = 'submitted'
        ORDER BY qa.end_time DESC
        LIMIT 10
      `,
        [userId]
      );

      return {
        wasSuccessful: true,
        message: "Lấy thông tin dashboard thành công",
        result: {
          stats: statsQuery.rows[0],
          classes: classesQuery.rows,
          quizzes: quizzesQuery.rows,
          recent_attempts: recentAttemptsQuery.rows,
        },
      };
    } catch (error) {
      console.error("Error in teacherService.getDashboard:", error);
      throw error;
    }
  },

  async getClasses(userId, filters) {
    try {
      const { page = 1, limit = 20 } = filters;
      const offset = (page - 1) * limit;

      const query = `
        SELECT
          c.class_id,
          c.class_name,
          c.class_code,
          c.description,
          s.subject_name,
          c.status,
          (SELECT COUNT(*) FROM class_members WHERE class_id = c.class_id AND status = 'active') as student_count,
          (SELECT COUNT(*) FROM class_quizzes WHERE class_id = c.class_id) as quiz_count,
          (SELECT COALESCE(ROUND(AVG(qa.total_score / q.total_score * 100), 2), 0)
           FROM class_quizzes cq
           JOIN quiz_attempts qa ON cq.quiz_id = qa.quiz_id
           JOIN quizzes q ON qa.quiz_id = q.quiz_id
           WHERE cq.class_id = c.class_id AND qa.status = 'submitted' AND q.total_score > 0) as score,
          c.created_at,
          c.updated_at
        FROM classes c
        JOIN subjects s ON c.subject_id = s.subject_id
        WHERE c.teacher_id = $1 AND c.deleted_at IS NULL
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(query, [userId, limit, offset]);

      const countQuery = `
        SELECT COUNT(*) as total
        FROM classes
        WHERE teacher_id = $1 AND deleted_at IS NULL
      `;

      const countResult = await pool.query(countQuery, [userId]);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách lớp học thành công",
        result: {
          classes: result.rows,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total: parseInt(countResult.rows[0].total),
            total_pages: Math.ceil(countResult.rows[0].total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error in teacherService.getClasses:", error);
      throw error;
    }
  },

  async getQuizzes(userId, filters) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      let statusCondition = "";
      const params = [userId, limit, offset];

      if (status) {
        statusCondition = `AND q.status = $4`;
        params.push(status);
      }

      const query = `
        SELECT
          q.quiz_id,
          q.title,
          q.description,
          q.quiz_code,
          q.cover_image_url,
          q.difficulty_level,
          q.status,
          q.access_level,
          q.total_score,
          s.subject_name,
          t.topic_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
          (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as attempt_count,
          (SELECT COALESCE(ROUND(AVG(total_score), 2), 0)
           FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as average_score,
          (SELECT class_name FROM classes c
           JOIN class_quizzes cq ON c.class_id = cq.class_id
           WHERE cq.quiz_id = q.quiz_id LIMIT 1) as class_name,
          q.created_at,
          q.updated_at
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.subject_id
        LEFT JOIN topics t ON q.topic_id = t.topic_id
        WHERE q.creator_id = $1 ${statusCondition}
        ORDER BY q.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(query, params);

      const countQuery = `
        SELECT COUNT(*) as total
        FROM quizzes
        WHERE creator_id = $1 ${statusCondition}
      `;

      const countParams = [userId];
      if (status) {
        countParams.push(status);
      }

      const countResult = await pool.query(countQuery, countParams);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách quiz thành công",
        result: {
          quizzes: result.rows,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total: parseInt(countResult.rows[0].total),
            total_pages: Math.ceil(countResult.rows[0].total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error in teacherService.getQuizzes:", error);
      throw error;
    }
  },

  async getStatistics(userId) {
    try {
      // Overall statistics
      const overallStats = await pool.query(
        `
        SELECT
          (SELECT COUNT(*) FROM classes WHERE teacher_id = $1 AND deleted_at IS NULL) as total_classes,
          (SELECT COUNT(*) FROM quizzes WHERE creator_id = $1) as total_quizzes,
          (SELECT COUNT(DISTINCT cm.user_id)
           FROM classes c
           JOIN class_members cm ON c.class_id = cm.class_id
           WHERE c.teacher_id = $1) as total_students,
          (SELECT COUNT(*)
           FROM quiz_attempts qa
           JOIN quizzes q ON qa.quiz_id = q.quiz_id
           WHERE q.creator_id = $1 AND qa.status = 'submitted') as total_attempts,
          (SELECT COALESCE(ROUND(AVG(qa.total_score), 2), 0)
           FROM quiz_attempts qa
           JOIN quizzes q ON qa.quiz_id = q.quiz_id
           WHERE q.creator_id = $1 AND qa.status = 'submitted') as overall_average_score
      `,
        [userId]
      );

      // Class performance statistics
      const classStats = await pool.query(
        `
        SELECT
          c.class_id,
          c.class_name,
          (SELECT COUNT(*) FROM class_members WHERE class_id = c.class_id AND status = 'active') as student_count,
          (SELECT COALESCE(ROUND(AVG(qa.total_score), 2), 0)
           FROM class_quizzes cq
           JOIN quiz_attempts qa ON cq.quiz_id = qa.quiz_id
           WHERE cq.class_id = c.class_id AND qa.status = 'submitted') as average_score
        FROM classes c
        WHERE c.teacher_id = $1 AND c.deleted_at IS NULL
        ORDER BY average_score DESC
      `,
        [userId]
      );

      // Quiz performance statistics
      const quizStats = await pool.query(
        `
        SELECT
          q.quiz_id,
          q.title,
          q.difficulty_level,
          (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as attempt_count,
          (SELECT COALESCE(ROUND(AVG(total_score), 2), 0)
           FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as average_score,
          (SELECT COALESCE(ROUND(MAX(total_score), 2), 0)
           FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as highest_score,
          (SELECT COALESCE(ROUND(MIN(total_score), 2), 0)
           FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as lowest_score
        FROM quizzes q
        WHERE q.creator_id = $1 AND q.status != 'draft'
        ORDER BY attempt_count DESC
        LIMIT 10
      `,
        [userId]
      );

      return {
        wasSuccessful: true,
        message: "Lấy thống kê thành công",
        result: {
          overall: overallStats.rows[0],
          class_performance: classStats.rows,
          quiz_performance: quizStats.rows,
        },
      };
    } catch (error) {
      console.error("Error in teacherService.getStatistics:", error);
      throw error;
    }
  },
};
