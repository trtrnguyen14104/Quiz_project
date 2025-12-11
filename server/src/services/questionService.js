import {QuestionModel} from "../models/Question.js";
import {AnswerModel} from "../models/Answer.js";
import {QuizModel} from "../models/Quiz.js";
import {pool} from "../config/database.js";

export const questionService = {
  async getByQuiz(quizId) {
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

      return {
        wasSuccessful: true,
        message: "Lấy danh sách câu hỏi thành công",
        result: questionsWithAnswers,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async create(data) {
    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      const { quiz_id, content, image_url, question_order, points, time_limit, answers } = data;

      // Tạo question
      const questionResult = await client.query(
        `INSERT INTO questions (quiz_id, content, image_url, question_order, points, time_limit)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [quiz_id, content, image_url, question_order, points, time_limit]
      );
      
      const question = questionResult.rows[0];

      // Tạo answers nếu có
      let createdAnswers = [];
      if (answers && answers.length > 0) {
        for (let i = 0; i < answers.length; i++) {
          const answerResult = await client.query(
            `INSERT INTO answers (question_id, content, is_correct, answer_order)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [question.question_id, answers[i].content, answers[i].is_correct, i + 1]
          );
          createdAnswers.push(answerResult.rows[0]);
        }
      }

      await client.query("COMMIT");

      return {
        wasSuccessful: true,
        message: "Tạo câu hỏi thành công",
        result: { ...question, answers: createdAnswers },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  },

  async createBulk(quizId, questions) {
    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      const createdQuestions = [];

      for (const questionData of questions) {
        const { content, image_url, question_order, points, time_limit, answers } = questionData;

        // Tạo question
        const questionResult = await client.query(
          `INSERT INTO questions (quiz_id, content, image_url, question_order, points, time_limit)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [quizId, content, image_url, question_order, points, time_limit]
        );
        
        const question = questionResult.rows[0];

        // Tạo answers
        const createdAnswers = [];
        if (answers && answers.length > 0) {
          for (let i = 0; i < answers.length; i++) {
            const answerResult = await client.query(
              `INSERT INTO answers (question_id, content, is_correct, answer_order)
               VALUES ($1, $2, $3, $4)
               RETURNING *`,
              [question.question_id, answers[i].content, answers[i].is_correct, i + 1]
            );
            createdAnswers.push(answerResult.rows[0]);
          }
        }

        createdQuestions.push({ ...question, answers: createdAnswers });
      }

      // Cập nhật total_score cho quiz
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
      await client.query(
        'UPDATE quizzes SET total_score = $1 WHERE quiz_id = $2',
        [totalPoints, quizId]
      );

      await client.query("COMMIT");

      return {
        wasSuccessful: true,
        message: `Tạo ${createdQuestions.length} câu hỏi thành công`,
        result: createdQuestions,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  },

  async delete(questionId) {
    try {
      const question = await QuestionModel.findById(questionId);
      if (!question) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy câu hỏi",
        };
      }

      await QuestionModel.softDelete(questionId);

      return {
        wasSuccessful: true,
        message: "Xóa câu hỏi thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};