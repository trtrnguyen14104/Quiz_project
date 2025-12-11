import {QuizAttemptModel} from "../models/QuizAttempt.js";
import {UserAnswerModel} from "../models/UserAnswer.js";
import {QuizModel} from "../models/Quiz.js";
import {QuizConfigModel} from "../models/QuizConfig.js";
import {AnswerModel} from "../models/Answer.js";
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

        // Kiểm tra số lần làm
        const previousAttempts = await QuizAttemptModel.findByUser(userId);
        const attemptCount = previousAttempts.filter(a => a.quiz_id === parseInt(quizId)).length;
        
        if (config.max_attempts && attemptCount >= config.max_attempts) {
          return {
            wasSuccessful: false,
            message: `Bạn đã hết số lần làm bài (${config.max_attempts} lần)`,
          };
        }
      }

      // Tạo attempt mới
      const attemptNumber = (await QuizAttemptModel.findByUser(userId))
        .filter(a => a.quiz_id === parseInt(quizId))
        .length + 1;

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

      if (attempt.status === "completed") {
        return {
          wasSuccessful: false,
          message: "Quiz đã hoàn thành",
        };
      }

      // Kiểm tra đã trả lời câu này chưa
      const existingAnswer = await UserAnswerModel.findByAttemptAndQuestion(attemptId, question_id);
      if (existingAnswer) {
        return {
          wasSuccessful: false,
          message: "Đã trả lời câu hỏi này rồi",
        };
      }

      // Kiểm tra đáp án đúng
      const answer = await AnswerModel.findById(answer_id);
      const is_correct = answer ? answer.is_correct : false;
      
      // Tính điểm
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
          is_correct, // Trả về để frontend biết đúng/sai
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

      if (attempt.status === "completed") {
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
        status: "completed",
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

      const answers = await UserAnswerModel.findByAttempt(attemptId);
      const statistics = await UserAnswerModel.getStatistics(attemptId);

      return {
        wasSuccessful: true,
        message: "Lấy kết quả thành công",
        result: {
          attempt,
          answers,
          statistics,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};