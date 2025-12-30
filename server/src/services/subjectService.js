import {SubjectModel} from "../models/Subject.js";
import {TopicModel} from "../models/Topic.js";
import {pool} from "../config/database.js";

export const subjectService = {
  async getAll() {
    try {
      const subjects = await SubjectModel.findAll();

      // Đếm số topics và quizzes cho mỗi subject
      const subjectsWithCounts = await Promise.all(
        subjects.map(async (subject) => {
          const stats = await pool.query(`
            SELECT 
              (SELECT COUNT(*) FROM topics WHERE subject_id = $1 AND deleted_at IS NULL) as topic_count,
              (SELECT COUNT(*) FROM quizzes WHERE subject_id = $1) as quiz_count,
              (SELECT COUNT(*) FROM classes WHERE subject_id = $1 AND deleted_at IS NULL) as class_count
          `, [subject.subject_id]);

          return {
            ...subject,
            ...stats.rows[0],
          };
        })
      );

      return {
        wasSuccessful: true,
        message: "Lấy danh sách môn học thành công",
        result: subjectsWithCounts,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getById(subjectId) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      // Lấy thống kê
      const stats = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM topics WHERE subject_id = $1 AND deleted_at IS NULL) as topic_count,
          (SELECT COUNT(*) FROM quizzes WHERE subject_id = $1) as quiz_count,
          (SELECT COUNT(*) FROM classes WHERE subject_id = $1 AND deleted_at IS NULL) as class_count,
          (SELECT COUNT(DISTINCT qa.user_id) FROM quizzes q 
           JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id 
           WHERE q.subject_id = $1) as student_count
      `, [subjectId]);

      return {
        wasSuccessful: true,
        message: "Lấy thông tin môn học thành công",
        result: {
          ...subject,
          statistics: stats.rows[0],
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getTopics(subjectId) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      const topics = await TopicModel.findBySubject(subjectId);

      // Đếm số quiz cho mỗi topic
      const topicsWithQuizCount = await Promise.all(
        topics.map(async (topic) => {
          const result = await pool.query(
            'SELECT COUNT(*) as quiz_count FROM quizzes WHERE topic_id = $1',
            [topic.topic_id]
          );
          return {
            ...topic,
            quiz_count: parseInt(result.rows[0].quiz_count),
          };
        })
      );

      return {
        wasSuccessful: true,
        message: "Lấy danh sách chủ đề thành công",
        result: topicsWithQuizCount,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getQuizzes(subjectId, filters) {
    try {
      const { page = 1, limit = 12 } = filters;
      const offset = (page - 1) * limit;

      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      const result = await pool.query(`
        SELECT q.*, t.topic_name, c.category_name, u.user_name as creator_name,
               COUNT(DISTINCT qa.attempt_id) as attempt_count
        FROM quizzes q
        LEFT JOIN topics t ON q.topic_id = t.topic_id
        LEFT JOIN quiz_categories c ON q.category_id = c.category_id
        LEFT JOIN users u ON q.creator_id = u.user_id
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE q.subject_id = $1 AND q.status = 'published'
        GROUP BY q.quiz_id, t.topic_name, c.category_name, u.user_name
        ORDER BY q.created_at DESC
        LIMIT $2 OFFSET $3
      `, [subjectId, limit, offset]);

      const countResult = await pool.query(
        "SELECT COUNT(*) FROM quizzes WHERE subject_id = $1 AND status = 'published'",
        [subjectId]
      );

      return {
        wasSuccessful: true,
        message: "Lấy danh sách quiz thành công",
        result: {
          quizzes: result.rows,
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

  async getClasses(subjectId) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      const result = await pool.query(`
        SELECT c.*, u.user_name as teacher_name,
               COUNT(DISTINCT cm.member_id) as member_count
        FROM classes c
        LEFT JOIN users u ON c.teacher_id = u.user_id
        LEFT JOIN class_members cm ON c.class_id = cm.class_id AND cm.status = 'active'
        WHERE c.subject_id = $1 AND c.deleted_at IS NULL
        GROUP BY c.class_id, u.user_name
        ORDER BY c.created_at DESC
      `, [subjectId]);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách lớp học thành công",
        result: result.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const { subject_name, description } = data;

      // Kiểm tra tên môn học đã tồn tại
      const existingSubject = await pool.query(
        'SELECT * FROM subjects WHERE subject_name = $1 AND deleted_at IS NULL',
        [subject_name]
      );

      if (existingSubject.rows.length > 0) {
        return {
          wasSuccessful: false,
          message: "Tên môn học đã tồn tại",
        };
      }

      const newSubject = await SubjectModel.create({
        subject_name,
        description,
      });

      return {
        wasSuccessful: true,
        message: "Tạo môn học thành công",
        result: newSubject,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async update(subjectId, data) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      // Kiểm tra tên môn học trùng
      if (data.subject_name) {
        const existingSubject = await pool.query(
          'SELECT * FROM subjects WHERE subject_name = $1 AND subject_id != $2 AND deleted_at IS NULL',
          [data.subject_name, subjectId]
        );

        if (existingSubject.rows.length > 0) {
          return {
            wasSuccessful: false,
            message: "Tên môn học đã tồn tại",
          };
        }
      }

      const updatedSubject = await SubjectModel.update(subjectId, data);

      return {
        wasSuccessful: true,
        message: "Cập nhật môn học thành công",
        result: updatedSubject,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async delete(subjectId) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      // Kiểm tra xem có quiz hoặc class nào đang dùng subject này không
      const usage = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM quizzes WHERE subject_id = $1) as quiz_count,
          (SELECT COUNT(*) FROM classes WHERE subject_id = $1 AND deleted_at IS NULL) as class_count
      `, [subjectId]);

      const { quiz_count, class_count } = usage.rows[0];

      if (parseInt(quiz_count) > 0 || parseInt(class_count) > 0) {
        return {
          wasSuccessful: false,
          message: `Không thể xóa môn học. Có ${quiz_count} quiz và ${class_count} lớp học đang sử dụng môn học này.`,
        };
      }

      await SubjectModel.softDelete(subjectId);

      return {
        wasSuccessful: true,
        message: "Xóa môn học thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getStatistics(subjectId) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      const stats = await pool.query(`
        SELECT 
          COUNT(DISTINCT q.quiz_id) as total_quizzes,
          COUNT(DISTINCT t.topic_id) as total_topics,
          COUNT(DISTINCT c.class_id) as total_classes,
          COUNT(DISTINCT qa.user_id) as total_students,
          COUNT(DISTINCT qa.attempt_id) as total_attempts,
          AVG(qa.total_score) as average_score
        FROM subjects s
        LEFT JOIN quizzes q ON s.subject_id = q.subject_id
        LEFT JOIN topics t ON s.subject_id = t.subject_id AND t.deleted_at IS NULL
        LEFT JOIN classes c ON s.subject_id = c.subject_id AND c.deleted_at IS NULL
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id AND qa.status = 'submitted'
        WHERE s.subject_id = $1
        GROUP BY s.subject_id
      `, [subjectId]);

      // Top 5 quiz phổ biến nhất
      const popularQuizzes = await pool.query(`
        SELECT q.quiz_id, q.title, q.cover_image_url,
               COUNT(DISTINCT qa.attempt_id) as attempt_count
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE q.subject_id = $1
        GROUP BY q.quiz_id
        ORDER BY attempt_count DESC
        LIMIT 5
      `, [subjectId]);

      // Thống kê theo tháng (6 tháng gần nhất)
      const monthlyStats = await pool.query(`
        SELECT 
          TO_CHAR(qa.start_time, 'YYYY-MM') as month,
          COUNT(DISTINCT qa.attempt_id) as attempts,
          AVG(qa.total_score) as avg_score
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.quiz_id
        WHERE q.subject_id = $1 
          AND qa.start_time >= NOW() - INTERVAL '6 months'
          AND qa.status = 'submitted'
        GROUP BY month
        ORDER BY month DESC
      `, [subjectId]);

      return {
        wasSuccessful: true,
        message: "Lấy thống kê môn học thành công",
        result: {
          overall: stats.rows[0],
          popular_quizzes: popularQuizzes.rows,
          monthly_stats: monthlyStats.rows,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};