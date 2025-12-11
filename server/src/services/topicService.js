import {TopicModel} from "../models/Topic.js";
import {SubjectModel} from "../models/Subject.js";
import {pool} from "../config/database.js";

export const topicService = {
  async getAll() {
    try {
      const topics = await TopicModel.findAll();

      // Lấy thông tin subject và đếm quiz
      const topicsWithDetails = await Promise.all(
        topics.map(async (topic) => {
          const subject = await SubjectModel.findById(topic.subject_id);
          const quizCount = await pool.query(
            'SELECT COUNT(*) as count FROM quizzes WHERE topic_id = $1',
            [topic.topic_id]
          );

          return {
            ...topic,
            subject_name: subject?.subject_name || null,
            quiz_count: parseInt(quizCount.rows[0].count),
          };
        })
      );

      return {
        wasSuccessful: true,
        message: "Lấy danh sách chủ đề thành công",
        result: topicsWithDetails,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getById(topicId) {
    try {
      const topic = await TopicModel.findById(topicId);
      if (!topic) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy chủ đề",
        };
      }

      // Lấy thông tin subject
      const subject = await SubjectModel.findById(topic.subject_id);

      // Đếm số quiz
      const quizCount = await pool.query(
        'SELECT COUNT(*) as count FROM quizzes WHERE topic_id = $1',
        [topicId]
      );

      return {
        wasSuccessful: true,
        message: "Lấy thông tin chủ đề thành công",
        result: {
          ...topic,
          subject_name: subject?.subject_name || null,
          quiz_count: parseInt(quizCount.rows[0].count),
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getBySubject(subjectId) {
    try {
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      const topics = await TopicModel.findBySubject(subjectId);

      // Đếm quiz cho mỗi topic
      const topicsWithQuizCount = await Promise.all(
        topics.map(async (topic) => {
          const result = await pool.query(
            'SELECT COUNT(*) as count FROM quizzes WHERE topic_id = $1',
            [topic.topic_id]
          );
          return {
            ...topic,
            quiz_count: parseInt(result.rows[0].count),
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

  async getQuizzes(topicId, filters) {
    try {
      const { page = 1, limit = 12 } = filters;
      const offset = (page - 1) * limit;

      const topic = await TopicModel.findById(topicId);
      if (!topic) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy chủ đề",
        };
      }

      const result = await pool.query(`
        SELECT q.*, s.subject_name, c.category_name, u.user_name as creator_name,
               COUNT(DISTINCT qa.attempt_id) as attempt_count
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.subject_id
        LEFT JOIN quiz_categories c ON q.category_id = c.category_id
        LEFT JOIN users u ON q.creator_id = u.user_id
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE q.topic_id = $1 AND q.status = 'published'
        GROUP BY q.quiz_id, s.subject_name, c.category_name, u.user_name
        ORDER BY q.created_at DESC
        LIMIT $2 OFFSET $3
      `, [topicId, limit, offset]);

      const countResult = await pool.query(
        "SELECT COUNT(*) FROM quizzes WHERE topic_id = $1 AND status = 'published'",
        [topicId]
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

  async create(data) {
    try {
      const { topic_name, subject_id, description } = data;

      // Kiểm tra subject tồn tại
      const subject = await SubjectModel.findById(subject_id);
      if (!subject) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy môn học",
        };
      }

      // Kiểm tra tên topic đã tồn tại trong subject này chưa
      const existingTopic = await pool.query(
        'SELECT * FROM topics WHERE topic_name = $1 AND subject_id = $2 AND deleted_at IS NULL',
        [topic_name, subject_id]
      );

      if (existingTopic.rows.length > 0) {
        return {
          wasSuccessful: false,
          message: "Tên chủ đề đã tồn tại trong môn học này",
        };
      }

      const newTopic = await TopicModel.create({
        topic_name,
        subject_id,
        description,
      });

      return {
        wasSuccessful: true,
        message: "Tạo chủ đề thành công",
        result: newTopic,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async update(topicId, data) {
    try {
      const topic = await TopicModel.findById(topicId);
      if (!topic) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy chủ đề",
        };
      }

      // Kiểm tra tên topic trùng
      if (data.topic_name) {
        const existingTopic = await pool.query(
          'SELECT * FROM topics WHERE topic_name = $1 AND subject_id = $2 AND topic_id != $3 AND deleted_at IS NULL',
          [data.topic_name, topic.subject_id, topicId]
        );

        if (existingTopic.rows.length > 0) {
          return {
            wasSuccessful: false,
            message: "Tên chủ đề đã tồn tại trong môn học này",
          };
        }
      }

      const updatedTopic = await TopicModel.update(topicId, data);

      return {
        wasSuccessful: true,
        message: "Cập nhật chủ đề thành công",
        result: updatedTopic,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async delete(topicId) {
    try {
      const topic = await TopicModel.findById(topicId);
      if (!topic) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy chủ đề",
        };
      }

      // Kiểm tra có quiz nào đang dùng topic này không
      const quizCount = await pool.query(
        'SELECT COUNT(*) as count FROM quizzes WHERE topic_id = $1',
        [topicId]
      );

      if (parseInt(quizCount.rows[0].count) > 0) {
        return {
          wasSuccessful: false,
          message: `Không thể xóa chủ đề. Có ${quizCount.rows[0].count} quiz đang sử dụng chủ đề này.`,
        };
      }

      await TopicModel.softDelete(topicId);

      return {
        wasSuccessful: true,
        message: "Xóa chủ đề thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};