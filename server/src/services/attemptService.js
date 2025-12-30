import {QuizAttemptModel} from "../models/QuizAttempt.js";
import {UserAnswerModel} from "../models/UserAnswer.js";
import {QuizModel} from "../models/Quiz.js";
import {QuizConfigModel} from "../models/QuizConfig.js";
import {AnswerModel} from "../models/Answer.js";
import {QuestionModel} from "../models/Question.js";
import {pool} from "../config/database.js";
export const attemptService = {
  async startAttempt(quizId, userId) {
    try {
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      // Kiểm tra quiz config
      const config = await QuizConfigModel.findByQuiz(quizId);
      if (config) {
        const now = new Date();
        
        // Kiểm tra thời gian bắt đầu
        if (config.start_time && new Date(config.start_time) > now) {
          return {
            wasSuccessful: false,
            message: "Quiz chưa bắt đầu",
          };
        }

        // Kiểm tra thời gian kết thúc
        if (config.end_time && new Date(config.end_time) < now) {
          return {
            wasSuccessful: false,
            message: "Quiz đã kết thúc",
          };
        }

        // Kiểm tra số lần làm - chỉ đếm các attempt đã submitted
        const previousAttempts = await QuizAttemptModel.findByUser(userId);
        const submittedAttempts = previousAttempts.filter(
          a => a.quiz_id === parseInt(quizId) && a.status === 'submitted'
        );

        if (config.max_attempts && submittedAttempts.length >= config.max_attempts) {
          return {
            wasSuccessful: false,
            message: `Bạn đã hết số lần làm bài (${config.max_attempts} lần)`,
          };
        }
      }

      // Kiểm tra xem có attempt in_progress không, nếu có thì xóa hoặc sử dụng lại
      const allUserAttempts = await QuizAttemptModel.findByUser(userId);
      const existingInProgress = allUserAttempts.find(
        a => a.quiz_id === parseInt(quizId) && a.status === 'in_progress'
      );

      if (existingInProgress) {
        // Trả về attempt đang in_progress thay vì tạo mới
        return {
          wasSuccessful: true,
          message: "Tiếp tục làm quiz",
          result: existingInProgress,
        };
      }

      // Tạo attempt mới - chỉ đếm các attempt đã submitted để tính attempt_number
      const submittedAttemptsForQuiz = allUserAttempts.filter(
        a => a.quiz_id === parseInt(quizId) && a.status === 'submitted'
      );
      const attemptNumber = submittedAttemptsForQuiz.length + 1;

      const newAttempt = await QuizAttemptModel.create({
        quiz_id: quizId,
        user_id: userId,
        attempt_number: attemptNumber,
      });

      return {
        wasSuccessful: true,
        message: "Bắt đầu làm quiz",
        result: newAttempt,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async submitAnswer(attemptId, data) {
    try {
      const { question_id, answer_id, time_taken } = data;

      const attempt = await QuizAttemptModel.findById(attemptId);
      if (!attempt) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy attempt",
        };
      }

      if (attempt.status === "submitted") {
        return {
          wasSuccessful: false,
          message: "Quiz đã hoàn thành",
        };
      }

      // Lấy thông tin quiz để kiểm tra result_mode
      const quiz = await QuizModel.findById(attempt.quiz_id);

      // Check if quiz is assigned to a class and get class-specific result_mode
      const classQuizQuery = await pool.query(
        `SELECT cq.result_mode
         FROM class_quizzes cq
         JOIN class_members cm ON cq.class_id = cm.class_id
         WHERE cq.quiz_id = $1 AND cm.user_id = $2 AND cm.status = 'active'
         LIMIT 1`,
        [attempt.quiz_id, attempt.user_id]
      );

      // Use class-specific result_mode if available, otherwise use quiz's default
      const resultMode = classQuizQuery.rows[0]?.result_mode || quiz.result_mode;

      // Kiểm tra đã trả lời câu này chưa
      const existingAnswer = await UserAnswerModel.findByAttemptAndQuestion(attemptId, question_id);

      if (existingAnswer) {
        // Nếu là chế độ practice, chỉ cho phép nếu chọn lại CÙNG đáp án (re-submit)
        // KHÔNG cho đổi sang đáp án khác vì đã thấy kết quả đúng/sai
        if (resultMode === 'practice' && existingAnswer.answer_id !== answer_id) {
          return {
            wasSuccessful: false,
            message: "Không thể thay đổi câu trả lời trong chế độ luyện tập",
          };
        }

        // Nếu là chế độ exam hoặc practice mode nhưng chọn lại cùng answer
        const answer = await AnswerModel.findById(answer_id);
        const is_correct = answer ? answer.is_correct : false;

        const question = await QuestionModel.findById(question_id);
        const points_earned = is_correct ? (question?.points || 0) : 0;

        const updatedAnswer = await UserAnswerModel.update(existingAnswer.user_answer_id, {
          answer_id,
          is_correct,
          points_earned,
          time_taken,
        });

        return {
          wasSuccessful: true,
          message: "Cập nhật câu trả lời",
          result: {
            ...updatedAnswer,
            is_correct: resultMode === 'practice' ? is_correct : null, // Chỉ trả về trong practice mode
          },
        };
      }

      // Tạo câu trả lời mới
      const answer = await AnswerModel.findById(answer_id);
      const is_correct = answer ? answer.is_correct : false;

      const question = await QuestionModel.findById(question_id);
      const points_earned = is_correct ? (question?.points || 0) : 0;

      const userAnswer = await UserAnswerModel.create({
        attempt_id: attemptId,
        question_id,
        answer_id,
        is_correct,
        points_earned,
        time_taken,
      });

      return {
        wasSuccessful: true,
        message: "Ghi nhận câu trả lời",
        result: {
          ...userAnswer,
          is_correct: resultMode === 'practice' ? is_correct : null, // Chỉ trả về trong practice mode
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async finishAttempt(attemptId) {
    try {
      const attempt = await QuizAttemptModel.findById(attemptId);
      if (!attempt) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy attempt",
        };
      }

      if (attempt.status === "submitted") {
        return {
          wasSuccessful: false,
          message: "Quiz đã hoàn thành rồi",
        };
      }

      // Tính tổng điểm
      const total_score = await UserAnswerModel.calculateScore(attemptId);

      // Cập nhật attempt
      const updatedAttempt = await QuizAttemptModel.update(attemptId, {
        end_time: new Date(),
        total_score,
        status: "submitted",
      });

      // Lấy statistics
      const statistics = await UserAnswerModel.getStatistics(attemptId);

      return {
        wasSuccessful: true,
        message: "Hoàn thành quiz",
        result: {
          ...updatedAttempt,
          statistics,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getResult(attemptId) {
    try {
      const attempt = await QuizAttemptModel.findById(attemptId);
      if (!attempt) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy kết quả",
        };
      }

      // Lấy thông tin quiz
      const quiz = await QuizModel.findById(attempt.quiz_id);

      // Lấy user answers với thông tin chi tiết
      const userAnswers = await UserAnswerModel.findByAttempt(attemptId);

      // Lấy questions với answers
      const {QuestionModel} = await import("../models/Question.js");
      const {AnswerModel} = await import("../models/Answer.js");
      const {pool} = await import("../config/database.js");

      const questions = await QuestionModel.findByQuiz(attempt.quiz_id);

      // Gắn answers vào từng question và đánh dấu user answer
      const questionsWithDetails = await Promise.all(
        questions.map(async (question) => {
          const answers = await AnswerModel.findByQuestion(question.question_id);
          const userAnswer = userAnswers.find(ua => ua.question_id === question.question_id);

          return {
            ...question,
            answers,
            user_answer: userAnswer || null,
          };
        })
      );

      const statistics = await UserAnswerModel.getStatistics(attemptId);

      // Kiểm tra thông tin về số lần làm bài và giới hạn
      // Đếm số lần user đã làm quiz này
      const attemptsCountQuery = await pool.query(
        `SELECT COUNT(*) as count
         FROM quiz_attempts
         WHERE quiz_id = $1 AND user_id = $2 AND status = 'submitted'`,
        [attempt.quiz_id, attempt.user_id]
      );
      const userAttemptsCount = parseInt(attemptsCountQuery.rows[0].count) || 0;

      // Lấy thông tin giới hạn từ class_quizzes nếu quiz được gán vào lớp
      const classQuizQuery = await pool.query(
        `SELECT cq.max_attempts, cq.result_mode, cq.due_date
         FROM class_quizzes cq
         JOIN class_members cm ON cq.class_id = cm.class_id
         WHERE cq.quiz_id = $1 AND cm.user_id = $2 AND cm.status = 'active'
         LIMIT 1`,
        [attempt.quiz_id, attempt.user_id]
      );

      const classQuizInfo = classQuizQuery.rows[0];
      const maxAttempts = classQuizInfo?.max_attempts || null;
      const canRetake = !maxAttempts || userAttemptsCount < maxAttempts;

      return {
        wasSuccessful: true,
        message: "Lấy kết quả thành công",
        result: {
          attempt,
          quiz,
          questions: questionsWithDetails,
          statistics,
          user_attempts_count: userAttemptsCount,
          max_attempts: maxAttempts,
          can_retake: canRetake,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserAttempts(userId) {
    try {
      const attempts = await QuizAttemptModel.findByUser(userId);
      return {
        wasSuccessful: true,
        message: "Lấy danh sách attempts thành công",
        result: attempts,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getQuizAttempts(quizId) {
    try {
      const attempts = await QuizAttemptModel.findByQuiz(quizId);
      return {
        wasSuccessful: true,
        message: "Lấy danh sách attempts của quiz thành công",
        result: attempts,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};