import { pool } from "../config/database.js";
export const UserAnswerModel = {
  async findByAttempt(attemptId) {
    const result = await pool.query(
      `SELECT ua.*, q.content as question_content, a.content as answer_content
       FROM user_answers ua
       JOIN questions q ON ua.question_id = q.question_id
       LEFT JOIN answers a ON ua.answer_id = a.answer_id
       WHERE ua.attempt_id = $1
       ORDER BY q.question_order`,
      [attemptId]
    );
    return result.rows;
  },

  async findByAttemptAndQuestion(attemptId, questionId) {
    const result = await pool.query(
      "SELECT * FROM user_answers WHERE attempt_id = $1 AND question_id = $2",
      [attemptId, questionId]
    );
    return result.rows[0];
  },

  async findById(userAnswerId) {
    const result = await pool.query(
      `SELECT ua.*, q.content as question_content, a.content as answer_content, a.is_correct
       FROM user_answers ua
       JOIN questions q ON ua.question_id = q.question_id
       LEFT JOIN answers a ON ua.answer_id = a.answer_id
       WHERE ua.user_answer_id = $1`,
      [userAnswerId]
    );
    return result.rows[0];
  },

  async create(userAnswerData) {
    const {
      attempt_id,
      question_id,
      answer_id,
      is_correct,
      points_earned,
      time_taken,
    } = userAnswerData;

    const result = await pool.query(
      `INSERT INTO user_answers (attempt_id, question_id, answer_id, is_correct, points_earned, time_taken)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        attempt_id,
        question_id,
        answer_id,
        is_correct,
        points_earned,
        time_taken,
      ]
    );
    return result.rows[0];
  },

  async update(userAnswerId, userAnswerData) {
    const { answer_id, is_correct, points_earned, time_taken } = userAnswerData;

    const result = await pool.query(
      `UPDATE user_answers 
       SET answer_id = COALESCE($1, answer_id),
           is_correct = COALESCE($2, is_correct),
           points_earned = COALESCE($3, points_earned),
           time_taken = COALESCE($4, time_taken),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_answer_id = $5
       RETURNING *`,
      [answer_id, is_correct, points_earned, time_taken, userAnswerId]
    );
    return result.rows[0];
  },

  async calculateScore(attemptId) {
    const result = await pool.query(
      "SELECT SUM(points_earned) as total_score FROM user_answers WHERE attempt_id = $1",
      [attemptId]
    );
    return parseFloat(result.rows[0].total_score) || 0;
  },

  async getStatistics(attemptId) {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_questions,
         SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) as correct_answers,
         SUM(points_earned) as total_points,
         AVG(time_taken) as avg_time
       FROM user_answers 
       WHERE attempt_id = $1`,
      [attemptId]
    );
    return result.rows[0];
  },
};
