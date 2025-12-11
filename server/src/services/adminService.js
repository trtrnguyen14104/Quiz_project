import {UserModel} from "../models/User.js";
import {QuizModel} from "../models/Quiz.js";
import {ClassModel} from "../models/Class.js";
import {SystemLogModel} from "../models/SystemLog.js";
import {} from "../config/database.js";

export const adminService = {
  async getDashboard() {
    try {
      const stats = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
          (SELECT COUNT(*) FROM quizzes WHERE status != 'draft') as total_quizzes,
          (SELECT COUNT(*) FROM classes WHERE deleted_at IS NULL) as total_classes,
          (SELECT COUNT(*) FROM quiz_attempts) as total_attempts,
          (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_this_month,
          (SELECT COUNT(*) FROM quiz_attempts WHERE start_time >= NOW() - INTERVAL '30 days') as attempts_this_month
      `);

      const recentActivities = await SystemLogModel.findAll(10, 0);

      const popularQuizzes = await pool.query(`
        SELECT q.quiz_id, q.title, q.cover_image_url, 
               COUNT(qa.attempt_id) as attempt_count
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        GROUP BY q.quiz_id
        ORDER BY attempt_count DESC
        LIMIT 5
      `);

      return {
        wasSuccessful: true,
        message: "Lấy thông tin dashboard thành công",
        result: {
          statistics: stats.rows[0],
          recent_activities: recentActivities,
          popular_quizzes: popularQuizzes.rows,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getAllUsers(filters) {
    try {
      const { page = 1, limit = 20, role, status } = filters;
      const offset = (page - 1) * limit;

      let query = `
        SELECT u.user_id, u.user_name, u.email, u.avatar_url, u.role, 
               u.is_verified, u.status, u.created_at,
               COUNT(DISTINCT q.quiz_id) as quiz_count,
               COUNT(DISTINCT qa.attempt_id) as attempt_count
        FROM users u
        LEFT JOIN quizzes q ON u.user_id = q.creator_id
        LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (role) {
        query += ` AND u.role = $${paramCount++}`;
        params.push(role);
      }

      if (status) {
        query += ` AND u.status = $${paramCount++}`;
        params.push(status);
      }

      query += ` GROUP BY u.user_id ORDER BY u.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      const countQuery = `SELECT COUNT(*) FROM users WHERE 1=1 ${role ? 'AND role = $1' : ''} ${status ? `AND status = $${role ? 2 : 1}` : ''}`;
      const countParams = [role, status].filter(Boolean);
      const countResult = await pool.query(countQuery, countParams);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách người dùng thành công",
        result: {
          users: result.rows,
          total: parseInt(countResult.rows[0].count),
          page: parseInt(page),
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy người dùng",
        };
      }

      const stats = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM quizzes WHERE creator_id = $1) as created_quizzes,
          (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1) as total_attempts,
          (SELECT COUNT(*) FROM class_members WHERE user_id = $1) as joined_classes,
          (SELECT COUNT(*) FROM classes WHERE teacher_id = $1) as teaching_classes
      `, [userId]);

      return {
        wasSuccessful: true,
        message: "Lấy thông tin người dùng thành công",
        result: {
          ...user,
          statistics: stats.rows[0],
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateUser(userId, data) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy người dùng",
        };
      }

      const updatedUser = await UserModel.update(userId, data);

      return {
        wasSuccessful: true,
        message: "Cập nhật người dùng thành công",
        result: updatedUser,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy người dùng",
        };
      }

      await UserModel.delete(userId);

      return {
        wasSuccessful: true,
        message: "Xóa người dùng thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getAllQuizzes(filters) {
    try {
      const { page = 1, limit = 20, status, subject_id } = filters;
      const offset = (page - 1) * limit;

      const quizzes = await QuizModel.findAll({ status, subject_id });

      const paginatedQuizzes = quizzes.slice(offset, offset + parseInt(limit));

      return {
        wasSuccessful: true,
        message: "Lấy danh sách quiz thành công",
        result: {
          quizzes: paginatedQuizzes,
          total: quizzes.length,
          page: parseInt(page),
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateQuizStatus(quizId, status) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      const updatedQuiz = await QuizModel.update(quizId, { status });

      return {
        wasSuccessful: true,
        message: "Cập nhật trạng thái quiz thành công",
        result: updatedQuiz,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteQuiz(quizId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      await QuizModel.delete(quizId);

      return {
        wasSuccessful: true,
        message: "Xóa quiz thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getAllClasses(filters) {
    try {
      const { page = 1, limit = 20 } = filters;
      const offset = (page - 1) * limit;

      const result = await pool.query(`
        SELECT c.*, s.subject_name, u.user_name as teacher_name,
               COUNT(DISTINCT cm.member_id) as member_count
        FROM classes c
        LEFT JOIN subjects s ON c.subject_id = s.subject_id
        LEFT JOIN users u ON c.teacher_id = u.user_id
        LEFT JOIN class_members cm ON c.class_id = cm.class_id
        WHERE c.deleted_at IS NULL
        GROUP BY c.class_id, s.subject_name, u.user_name
        ORDER BY c.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      const countResult = await pool.query(
        "SELECT COUNT(*) FROM classes WHERE deleted_at IS NULL"
      );

      return {
        wasSuccessful: true,
        message: "Lấy danh sách lớp học thành công",
        result: {
          classes: result.rows,
          total: parseInt(countResult.rows[0].count),
          page: parseInt(page),
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getSystemLogs(filters) {
    try {
      const { page = 1, limit = 50, action, user_id } = filters;
      const offset = (page - 1) * limit;

      let logs;
      if (action) {
        logs = await SystemLogModel.findByAction(action, limit);
      } else if (user_id) {
        logs = await SystemLogModel.findByUser(user_id, limit);
      } else {
        logs = await SystemLogModel.findAll(limit, offset);
      }

      return {
        wasSuccessful: true,
        message: "Lấy system logs thành công",
        result: {
          logs,
          page: parseInt(page),
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getStatistics(filters) {
    try {
      const { start_date, end_date } = filters;

      const dateFilter = start_date && end_date
        ? `WHERE created_at BETWEEN '${start_date}' AND '${end_date}'`
        : "";

      const userStats = await pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users
        ${dateFilter}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `);

      const quizStats = await pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM quizzes
        ${dateFilter}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `);

      const attemptStats = await pool.query(`
        SELECT 
          DATE(start_time) as date,
          COUNT(*) as count,
          AVG(total_score) as avg_score
        FROM quiz_attempts
        ${dateFilter.replace('created_at', 'start_time')}
        GROUP BY DATE(start_time)
        ORDER BY date DESC
        LIMIT 30
      `);

      return {
        wasSuccessful: true,
        message: "Lấy thống kê thành công",
        result: {
          user_growth: userStats.rows,
          quiz_creation: quizStats.rows,
          attempt_stats: attemptStats.rows,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};