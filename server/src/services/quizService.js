import { QuizModel } from "../models/Quiz.js";
import {QuestionModel} from "../models/Question.js"; 
import {AnswerModel} from "../models/Answer.js";
import {QuizConfigModel} from "../models/QuizConfig.js";
import { pool } from "../config/database.js";
import crypto from "crypto";

export const quizService = {
  async getAll(filters) {
    try {
      const { page = 1, limit = 12, subject_id, difficulty_level, status, search } = filters;
      const offset = (page - 1) * limit;

      let query = `
        SELECT q.*, s.subject_name, u.user_name as creator_name,
               COUNT(DISTINCT qa.attempt_id) as attempt_count
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.subject_id
        LEFT JOIN users u ON q.creator_id = u.user_id
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (subject_id) {
        query += ` AND q.subject_id = $${paramCount++}`;
        params.push(subject_id);
      }

      if (difficulty_level) {
        query += ` AND q.difficulty_level = $${paramCount++}`;
        params.push(difficulty_level);
      }

      if (status) {
        query += ` AND q.status = $${paramCount++}`;
        params.push(status);
      }

      if (search) {
        query += ` AND (q.title ILIKE $${paramCount++} OR q.description ILIKE $${paramCount})`;
        params.push(`%${search}%`, `%${search}%`);
        paramCount++;
      }

      query += ` GROUP BY q.quiz_id, s.subject_name, u.user_name ORDER BY q.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      // Count total
      let countQuery = `SELECT COUNT(DISTINCT q.quiz_id) FROM quizzes q WHERE 1=1`;
      const countParams = [];
      let countParamCount = 1;

      if (subject_id) {
        countQuery += ` AND q.subject_id = $${countParamCount++}`;
        countParams.push(subject_id);
      }

      if (difficulty_level) {
        countQuery += ` AND q.difficulty_level = $${countParamCount++}`;
        countParams.push(difficulty_level);
      }

      if (status) {
        countQuery += ` AND q.status = $${countParamCount++}`;
        countParams.push(status);
      }

      if (search) {
        countQuery += ` AND (q.title ILIKE $${countParamCount++} OR q.description ILIKE $${countParamCount})`;
        countParams.push(`%${search}%`, `%${search}%`);
      }

      const countResult = await pool.query(countQuery, countParams);

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

  async getById(quizId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      // Đếm số câu hỏi và số lần làm
      const stats = await pool.query(`
        SELECT 
          COUNT(DISTINCT q.question_id) as question_count,
          COUNT(DISTINCT qa.attempt_id) as attempt_count,
          AVG(qa.total_score) as average_score
        FROM quizzes qz
        LEFT JOIN questions q ON qz.quiz_id = q.quiz_id AND q.deleted_at IS NULL
        LEFT JOIN quiz_attempts qa ON qz.quiz_id = qa.quiz_id AND qa.status = 'completed'
        WHERE qz.quiz_id = $1
        GROUP BY qz.quiz_id
      `, [quizId]);

      return {
        wasSuccessful: true,
        message: "Lấy thông tin quiz thành công",
        result: {
          ...quiz,
          statistics: stats.rows[0] || { question_count: 0, attempt_count: 0, average_score: null },
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getByCode(quizCode) {
    try {
      const quiz = await QuizModel.findByCode(quizCode);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz với mã này",
        };
      }

      return {
        wasSuccessful: true,
        message: "Lấy thông tin quiz thành công",
        result: quiz,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getQuizWithQuestions(quizId, userId = null) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      const questions = await QuestionModel.findByQuiz(quizId);

      // Lấy answers cho mỗi question
      const questionsWithAnswers = await Promise.all(
        questions.map(async (question) => {
          const answers = await AnswerModel.findByQuestion(question.question_id);
          return { ...question, answers };
        })
      );

      // Get user attempt info if userId provided
      let userAttemptInfo = {};
      if (userId) {
        const attemptQuery = await pool.query(
          `SELECT
            COUNT(*) as user_attempts_count,
            (SELECT attempt_id FROM quiz_attempts
             WHERE quiz_id = $1 AND user_id = $2 AND status = 'submitted'
             ORDER BY end_time DESC LIMIT 1) as latest_attempt_id
           FROM quiz_attempts
           WHERE quiz_id = $1 AND user_id = $2 AND status = 'submitted'`,
          [quizId, userId]
        );
        userAttemptInfo = attemptQuery.rows[0];
      }

      // Check if quiz is in a class and get class-specific settings
      const classQuizQuery = await pool.query(
        `SELECT max_attempts, result_mode, due_date
         FROM class_quizzes cq
         JOIN class_members cm ON cq.class_id = cm.class_id
         WHERE cq.quiz_id = $1 AND cm.user_id = $2 AND cm.status = 'active'
         LIMIT 1`,
        [quizId, userId || 0]
      );

      const classQuizData = classQuizQuery.rows[0];

      return {
        wasSuccessful: true,
        message: "Lấy quiz với câu hỏi thành công",
        result: {
          ...quiz,
          questions: questionsWithAnswers,
          max_attempts: classQuizData?.max_attempts || null,
          result_mode: classQuizData?.result_mode || quiz.result_mode,
          due_date: classQuizData?.due_date || null,
          ...userAttemptInfo,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const {
        title, description, cover_image_url, subject_id, topic_id,
        category_id, difficulty_level, creator_id, access_level
      } = data;

      // Tạo quiz code ngẫu nhiên 6 ký tự
      const quiz_code = crypto.randomBytes(3).toString("hex").toUpperCase();

      const newQuiz = await QuizModel.create({
        title,
        description,
        cover_image_url,
        quiz_code,
        subject_id,
        topic_id,
        category_id,
        difficulty_level: difficulty_level || "medium",
        creator_id,
        access_level: access_level || "draft",
      });

      return {
        wasSuccessful: true,
        message: "Tạo quiz thành công",
        result: newQuiz,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async createWithQuestions(data) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const {
        title, description, cover_image_url, subject_id, topic_id,
        category_id, difficulty_level, creator_id, access_level, questions
      } = data;

      // Tạo quiz
      const quiz_code = crypto.randomBytes(3).toString("hex").toUpperCase();

      const quizResult = await client.query(
        `INSERT INTO quizzes (
          title, description, cover_image_url, quiz_code, subject_id,
          topic_id, category_id, difficulty_level, creator_id, access_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [title, description, cover_image_url, quiz_code, subject_id,
         topic_id, category_id, difficulty_level || "medium", creator_id, access_level || "draft"]
      );

      const quiz = quizResult.rows[0];

      // Tạo questions và answers
      const createdQuestions = [];
      let totalScore = 0;

      if (questions && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];

          const questionResult = await client.query(
            `INSERT INTO questions (quiz_id, content, image_url, question_order, points, time_limit)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [quiz.quiz_id, q.content, q.image_url, i + 1, q.points || 1, q.time_limit || 15]
          );

          const question = questionResult.rows[0];
          totalScore += question.points;

          // Tạo answers
          const createdAnswers = [];
          if (q.answers && q.answers.length > 0) {
            for (let j = 0; j < q.answers.length; j++) {
              const answerResult = await client.query(
                `INSERT INTO answers (question_id, content, is_correct, answer_order)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [question.question_id, q.answers[j].content, q.answers[j].is_correct, j + 1]
              );
              createdAnswers.push(answerResult.rows[0]);
            }
          }

          createdQuestions.push({ ...question, answers: createdAnswers });
        }

        // Cập nhật total_score
        await client.query(
          'UPDATE quizzes SET total_score = $1 WHERE quiz_id = $2',
          [totalScore, quiz.quiz_id]
        );
      }

      await client.query("COMMIT");

      return {
        wasSuccessful: true,
        message: "Tạo quiz với câu hỏi thành công",
        result: {
          ...quiz,
          total_score: totalScore,
          questions: createdQuestions,
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  },

  async update(quizId, data) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      const updatedQuiz = await QuizModel.update(quizId, data);

      return {
        wasSuccessful: true,
        message: "Cập nhật quiz thành công",
        result: updatedQuiz,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async delete(quizId) {
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

  async duplicate(quizId, creatorId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      // Tạo quiz mới
      const quiz_code = crypto.randomBytes(3).toString("hex").toUpperCase();

      const newQuizResult = await client.query(
        `INSERT INTO quizzes (
          title, description, cover_image_url, quiz_code, subject_id,
          topic_id, category_id, difficulty_level, creator_id, access_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          `${quiz.title} (Copy)`,
          quiz.description,
          quiz.cover_image_url,
          quiz_code,
          quiz.subject_id,
          quiz.topic_id,
          quiz.category_id,
          quiz.difficulty_level,
          creatorId,
          "draft"
        ]
      );

      const newQuiz = newQuizResult.rows[0];

      // Copy questions
      const questions = await QuestionModel.findByQuiz(quizId);

      for (const question of questions) {
        const newQuestionResult = await client.query(
          `INSERT INTO questions (quiz_id, content, image_url, question_order, points, time_limit)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [newQuiz.quiz_id, question.content, question.image_url, question.question_order, question.points, question.time_limit]
        );

        const newQuestion = newQuestionResult.rows[0];

        // Copy answers
        const answers = await AnswerModel.findByQuestion(question.question_id);

        for (const answer of answers) {
          await client.query(
            `INSERT INTO answers (question_id, content, is_correct, answer_order)
             VALUES ($1, $2, $3, $4)`,
            [newQuestion.question_id, answer.content, answer.is_correct, answer.answer_order]
          );
        }
      }

      // Copy config nếu có
      const config = await QuizConfigModel.findByQuiz(quizId);
      if (config) {
        await client.query(
          `INSERT INTO quiz_configs (
            quiz_id, start_time, end_time, result_mode, max_attempts,
            shuffle_questions, shuffle_answers, scoring_scale
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [newQuiz.quiz_id, config.start_time, config.end_time, config.result_mode,
           config.max_attempts, config.shuffle_questions, config.shuffle_answers, config.scoring_scale]
        );
      }

      await client.query("COMMIT");

      return {
        wasSuccessful: true,
        message: "Sao chép quiz thành công",
        result: newQuiz,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  },

  async publish(quizId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      // Kiểm tra có câu hỏi chưa
      const questions = await QuestionModel.findByQuiz(quizId);
      if (questions.length === 0) {
        return {
          wasSuccessful: false,
          message: "Quiz phải có ít nhất 1 câu hỏi để xuất bản",
        };
      }

      const updatedQuiz = await QuizModel.update(quizId, {
        status: "published",
        access_level: "public",
      });

      return {
        wasSuccessful: true,
        message: "Xuất bản quiz thành công",
        result: updatedQuiz,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getConfig(quizId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      let config = await QuizConfigModel.findByQuiz(quizId);

      if (!config) {
        // Tạo config mặc định nếu chưa có
        config = await QuizConfigModel.create({
          quiz_id: quizId,
        });
      }

      return {
        wasSuccessful: true,
        message: "Lấy cấu hình quiz thành công",
        result: config,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateConfig(quizId, data) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      let config = await QuizConfigModel.findByQuiz(quizId);

      if (!config) {
        // Tạo mới nếu chưa có
        config = await QuizConfigModel.create({
          quiz_id: quizId,
          ...data,
        });
      } else {
        // Cập nhật
        config = await QuizConfigModel.update(config.config_id, data);
      }

      return {
        wasSuccessful: true,
        message: "Cập nhật cấu hình quiz thành công",
        result: config,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getPopular(limit = 10) {
    try {
      const result = await pool.query(`
        SELECT q.*, s.subject_name, u.user_name as creator_name,
               COUNT(DISTINCT qa.attempt_id) as attempt_count
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.subject_id
        LEFT JOIN users u ON q.creator_id = u.user_id
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE q.status = 'published' AND q.access_level = 'public'
        GROUP BY q.quiz_id, s.subject_name, u.user_name
        ORDER BY attempt_count DESC
        LIMIT $1
      `, [limit]);

      return {
        wasSuccessful: true,
        message: "Lấy quiz phổ biến thành công",
        result: result.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getRecent(limit = 10) {
    try {
      const result = await pool.query(`
        SELECT q.*, s.subject_name, u.user_name as creator_name,
               COUNT(DISTINCT qa.attempt_id) as attempt_count
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.subject_id
        LEFT JOIN users u ON q.creator_id = u.user_id
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE q.status = 'published' AND q.access_level = 'public'
        GROUP BY q.quiz_id, s.subject_name, u.user_name
        ORDER BY q.created_at DESC
        LIMIT $1
      `, [limit]);

      return {
        wasSuccessful: true,
        message: "Lấy quiz mới nhất thành công",
        result: result.rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};