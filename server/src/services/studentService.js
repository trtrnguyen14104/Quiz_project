import { pool } from "../config/database.js";

export const studentService = {
  async getDashboard(userId) {
    try {
      const statsQuery = await pool.query(
        `
        SELECT
          (SELECT COUNT(DISTINCT cm.class_id)
           FROM class_members cm
           WHERE cm.user_id = $1 AND cm.status = 'active') as total_classes,

          (SELECT COUNT(DISTINCT qa.quiz_id)
           FROM quiz_attempts qa
           WHERE qa.user_id = $1 AND qa.status = 'submitted') as completed_quizzes,

          (SELECT COALESCE(AVG(qa.total_score), 0)
           FROM quiz_attempts qa
           WHERE qa.user_id = $1 AND qa.status = 'submitted') as average_score,

          (SELECT COUNT(*)
           FROM quiz_attempts qa
           WHERE qa.user_id = $1 AND qa.status = 'in_progress') as pending_quizzes
      `,
        [userId]
      );

      const recentAttemptsQuery = await pool.query(
        `
        SELECT
          qa.attempt_id,
          qa.quiz_id,
          qa.total_score,
          q.total_score as max_score,
          qa.start_time,
          qa.end_time,
          q.title as quiz_title,
          q.cover_image_url,
          s.subject_name,
          COALESCE(c.class_name, 'N/A') as class_name
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.quiz_id
        JOIN subjects s ON q.subject_id = s.subject_id
        LEFT JOIN class_quizzes cq ON q.quiz_id = cq.quiz_id
        LEFT JOIN classes c ON cq.class_id = c.class_id
        WHERE qa.user_id = $1 AND qa.status = 'submitted'
        ORDER BY qa.end_time DESC
        LIMIT 5
      `,
        [userId]
      );

      const classesQuery = await pool.query(
        `
        SELECT
          c.class_id,
          c.class_name,
          c.class_code,
          c.description,
          s.subject_name,
          u.user_name as teacher_name,
          (SELECT COUNT(*) FROM class_members WHERE class_id = c.class_id AND status = 'active') as student_count,
          cm.joined_at
        FROM class_members cm
        JOIN classes c ON cm.class_id = c.class_id
        JOIN subjects s ON c.subject_id = s.subject_id
        JOIN users u ON c.teacher_id = u.user_id
        WHERE cm.user_id = $1 AND cm.status = 'active' AND c.status = 'active'
        ORDER BY cm.joined_at DESC
        LIMIT 6
      `,
        [userId]
      );

      // Quiz được giao (assigned quizzes) - sắp xếp theo due_date
      const assignedQuizzesQuery = await pool.query(
        `
        SELECT DISTINCT ON (q.quiz_id)
          q.quiz_id,
          q.title,
          q.description,
          q.cover_image_url,
          q.quiz_code,
          q.difficulty_level,
          s.subject_name,
          cq.due_date,
          cq.assigned_at,
          cq.max_attempts,
          COALESCE(cq.result_mode, q.result_mode) as result_mode,
          c.class_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
          EXISTS(
            SELECT 1 FROM quiz_attempts
            WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
          ) as completed,
          (SELECT COUNT(*) FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted') as user_attempts_count,
          (SELECT attempt_id FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
           ORDER BY end_time DESC LIMIT 1) as latest_attempt_id
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.subject_id
        JOIN class_quizzes cq ON q.quiz_id = cq.quiz_id
        JOIN classes c ON cq.class_id = c.class_id
        JOIN class_members cm ON c.class_id = cm.class_id
        WHERE cm.user_id = $1
          AND cm.status = 'active'
          AND q.status = 'published'
        ORDER BY q.quiz_id,
                 CASE WHEN cq.due_date IS NULL THEN 1 ELSE 0 END,
                 cq.due_date ASC NULLS LAST,
                 cq.assigned_at DESC
        LIMIT 10
      `,
        [userId]
      );

      // Quiz đã tham gia gần đây (recently joined) - quiz đã làm, sắp theo thời gian làm
      const recentlyJoinedQuizzesQuery = await pool.query(
        `
        SELECT DISTINCT ON (q.quiz_id)
          q.quiz_id,
          q.title,
          q.description,
          q.cover_image_url,
          q.quiz_code,
          q.difficulty_level,
          s.subject_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
          qa.end_time as last_attempt_time,
          qa.total_score as last_score,
          q.total_score as max_score
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.quiz_id
        JOIN subjects s ON q.subject_id = s.subject_id
        WHERE qa.user_id = $1 AND qa.status = 'submitted'
        ORDER BY q.quiz_id, qa.end_time DESC
        LIMIT 8
      `,
        [userId]
      );

      return {
        wasSuccessful: true,
        message: "Lấy thông tin dashboard thành công",
        result: {
          statistics: statsQuery.rows[0],
          recent_attempts: recentAttemptsQuery.rows,
          classes: classesQuery.rows,
          assigned_quizzes: assignedQuizzesQuery.rows,
          recently_joined_quizzes: recentlyJoinedQuizzesQuery.rows,
        },
      };
    } catch (error) {
      console.error("Error in studentService.getDashboard:", error);
      throw error;
    }
  },

  async getQuizzes(userId, filters) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      let statusCondition = "";
      const params = [userId, limit, offset];

      if (status === "submitted") {
        statusCondition = `
          AND EXISTS(
            SELECT 1 FROM quiz_attempts
            WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
          )
        `;
      } else if (status === "pending") {
        statusCondition = `
          AND NOT EXISTS(
            SELECT 1 FROM quiz_attempts
            WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
          )
        `;
      }

      const query = `
        SELECT DISTINCT ON (q.quiz_id)
          q.quiz_id,
          q.title,
          q.description,
          q.cover_image_url,
          q.quiz_code,
          q.difficulty_level,
          q.total_score,
          s.subject_name,
          cq.due_date,
          cq.assigned_at,
          cq.max_attempts,
          COALESCE(cq.result_mode, q.result_mode) as result_mode,
          c.class_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
          EXISTS(
            SELECT 1 FROM quiz_attempts
            WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
          ) as completed,
          (SELECT total_score FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
           ORDER BY end_time DESC LIMIT 1) as score,
          (SELECT COUNT(*) FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted') as user_attempts_count,
          (SELECT attempt_id FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
           ORDER BY end_time DESC LIMIT 1) as latest_attempt_id
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.subject_id
        JOIN class_quizzes cq ON q.quiz_id = cq.quiz_id
        JOIN classes c ON cq.class_id = c.class_id
        JOIN class_members cm ON c.class_id = cm.class_id
        WHERE cm.user_id = $1
          AND cm.status = 'active'
          AND q.status = 'published'
          ${statusCondition}
        ORDER BY q.quiz_id, cq.assigned_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(query, params);

      const countQuery = `
        SELECT COUNT(DISTINCT q.quiz_id) as total
        FROM quizzes q
        JOIN class_quizzes cq ON q.quiz_id = cq.quiz_id
        JOIN classes c ON cq.class_id = c.class_id
        JOIN class_members cm ON c.class_id = cm.class_id
        WHERE cm.user_id = $1
          AND cm.status = 'active'
          AND q.status = 'published'
          ${statusCondition}
      `;

      const countResult = await pool.query(countQuery, [userId]);

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
      console.error("Error in studentService.getQuizzes:", error);
      throw error;
    }
  },

  async getResults(userId, filters) {
    try {
      const { page = 1, limit = 20 } = filters;
      const offset = (page - 1) * limit;

      const query = `
        SELECT
          qa.attempt_id,
          qa.quiz_id,
          qa.total_score,
          qa.start_time,
          qa.end_time,
          qa.attempt_number,
          q.title as quiz_title,
          q.total_score as max_score,
          q.cover_image_url,
          s.subject_name,
          c.class_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as total_questions,
          (SELECT COUNT(*) FROM user_answers ua
           JOIN questions ques ON ua.question_id = ques.question_id
           WHERE ua.attempt_id = qa.attempt_id AND ua.is_correct = true) as correct_answers
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.quiz_id
        JOIN subjects s ON q.subject_id = s.subject_id
        LEFT JOIN class_quizzes cq ON q.quiz_id = cq.quiz_id
        LEFT JOIN classes c ON cq.class_id = c.class_id
        WHERE qa.user_id = $1 AND qa.status = 'submitted'
        ORDER BY qa.end_time DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(query, [userId, limit, offset]);

      const countQuery = `
        SELECT COUNT(*) as total
        FROM quiz_attempts
        WHERE user_id = $1 AND status = 'submitted'
      `;

      const countResult = await pool.query(countQuery, [userId]);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách kết quả thành công",
        result: {
          attempts: result.rows,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total: parseInt(countResult.rows[0].total),
            total_pages: Math.ceil(countResult.rows[0].total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error in studentService.getResults:", error);
      throw error;
    }
  },

  async getMyCreatedQuizzes(userId) {
    try {
      const query = `
        SELECT
          q.quiz_id,
          q.title,
          q.description,
          q.cover_image_url,
          q.quiz_code,
          q.difficulty_level,
          q.total_score,
          q.status,
          q.access_level,
          q.result_mode,
          q.created_at,
          s.subject_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
          (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.quiz_id AND status = 'submitted') as total_attempts
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.subject_id
        WHERE q.creator_id = $1
        ORDER BY q.created_at DESC
      `;

      const result = await pool.query(query, [userId]);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách quiz đã tạo thành công",
        result: result.rows,
      };
    } catch (error) {
      console.error("Error in studentService.getMyCreatedQuizzes:", error);
      throw error;
    }
  },

  async getClasses(userId) {
    try {
      const query = `
        SELECT
          c.class_id,
          c.class_name,
          c.class_code,
          c.description,
          s.subject_name,
          u.user_name as teacher_name,
          u.email as teacher_email,
          (SELECT COUNT(*) FROM class_members WHERE class_id = c.class_id AND status = 'active') as student_count,
          (SELECT COUNT(*) FROM class_quizzes WHERE class_id = c.class_id) as quiz_count,
          cm.joined_at
        FROM class_members cm
        JOIN classes c ON cm.class_id = c.class_id
        JOIN subjects s ON c.subject_id = s.subject_id
        JOIN users u ON c.teacher_id = u.user_id
        WHERE cm.user_id = $1 AND cm.status = 'active' AND c.status = 'active'
        ORDER BY cm.joined_at DESC
      `;

      const result = await pool.query(query, [userId]);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách lớp học thành công",
        result: result.rows,
      };
    } catch (error) {
      console.error("Error in studentService.getClasses:", error);
      throw error;
    }
  },

  async getClassQuizzes(userId, classId) {
    try {
      // Verify student is member of this class
      const memberCheck = await pool.query(
        `SELECT 1 FROM class_members
         WHERE user_id = $1 AND class_id = $2 AND status = 'active'`,
        [userId, classId]
      );

      if (memberCheck.rows.length === 0) {
        return {
          wasSuccessful: false,
          message: "Bạn không phải là thành viên của lớp này",
          result: null,
        };
      }

      const query = `
        SELECT
          q.quiz_id,
          q.title,
          q.description,
          q.cover_image_url,
          q.quiz_code,
          q.difficulty_level,
          q.total_score,
          s.subject_name,
          cq.due_date,
          cq.assigned_at,
          cq.max_attempts,
          COALESCE(cq.result_mode, q.result_mode) as result_mode,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) as question_count,
          EXISTS(
            SELECT 1 FROM quiz_attempts
            WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
          ) as completed,
          (SELECT total_score FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
           ORDER BY end_time DESC LIMIT 1) as score,
          (SELECT end_time FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
           ORDER BY end_time DESC LIMIT 1) as completed_at,
          (SELECT COUNT(*) FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted') as user_attempts_count,
          (SELECT attempt_id FROM quiz_attempts
           WHERE quiz_id = q.quiz_id AND user_id = $1 AND status = 'submitted'
           ORDER BY end_time DESC LIMIT 1) as latest_attempt_id
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.subject_id
        JOIN class_quizzes cq ON q.quiz_id = cq.quiz_id
        WHERE cq.class_id = $2 AND q.status = 'published'
        ORDER BY cq.assigned_at DESC
      `;

      const result = await pool.query(query, [userId, classId]);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách quiz của lớp thành công",
        result: result.rows,
      };
    } catch (error) {
      console.error("Error in studentService.getClassQuizzes:", error);
      throw error;
    }
  },

  async getClassStudents(userId, classId) {
    try {
      const memberCheck = await pool.query(
        `SELECT 1 FROM class_members
         WHERE user_id = $1 AND class_id = $2 AND status = 'active'`,
        [userId, classId]
      );

      if (memberCheck.rows.length === 0) {
        return {
          wasSuccessful: false,
          message: "Bạn không phải là thành viên của lớp này",
          result: null,
        };
      }

      const query = `
        SELECT
          u.user_id,
          u.user_name,
          u.email,
          u.avatar_url,
          cm.joined_at,
          (SELECT COUNT(*) FROM quiz_attempts qa
           JOIN class_quizzes cq ON qa.quiz_id = cq.quiz_id
           WHERE qa.user_id = u.user_id AND cq.class_id = $1 AND qa.status = 'submitted') as completed_quizzes,
          (SELECT AVG(qa.total_score) FROM quiz_attempts qa
           JOIN class_quizzes cq ON qa.quiz_id = cq.quiz_id
           WHERE qa.user_id = u.user_id AND cq.class_id = $1 AND qa.status = 'submitted') as average_score
        FROM class_members cm
        JOIN users u ON cm.user_id = u.user_id
        WHERE cm.class_id = $1 AND cm.status = 'active'
        ORDER BY u.user_name ASC
      `;

      const result = await pool.query(query, [classId]);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách học sinh của lớp thành công",
        result: result.rows,
      };
    } catch (error) {
      console.error("Error in studentService.getClassStudents:", error);
      throw error;
    }
  },
};
