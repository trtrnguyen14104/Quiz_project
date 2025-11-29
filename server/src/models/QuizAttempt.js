import { pool } from "../config/database.js";
const QuizAttemptModel = {
  async findByUser(userId) {
    const result = await pool.query(
      `SELECT qa.*, q.title as quiz_title
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.quiz_id
       WHERE qa.user_id = $1
       ORDER BY qa.start_time DESC`,
      [userId]
    );
    return result.rows;
  },

  async findByQuiz(quizId) {
    const result = await pool.query(
      `SELECT qa.*, u.user_name
       FROM quiz_attempts qa
       JOIN users u ON qa.user_id = u.user_id
       WHERE qa.quiz_id = $1
       ORDER BY qa.total_score DESC`,
      [quizId]
    );
    return result.rows;
  },

  async findById(attemptId) {
    const result = await pool.query(
      `SELECT qa.*, q.title as quiz_title, u.user_name
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.quiz_id
       JOIN users u ON qa.user_id = u.user_id
       WHERE qa.attempt_id = $1`,
      [attemptId]
    );
    return result.rows[0];
  },

  async create(attemptData) {
    const { quiz_id, user_id, attempt_number } = attemptData;

    const result = await pool.query(
      `INSERT INTO quiz_attempts (quiz_id, user_id, attempt_number)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [quiz_id, user_id, attempt_number]
    );
    return result.rows[0];
  },

  async update(attemptId, attemptData) {
    const { end_time, total_score, status } = attemptData;

    const result = await pool.query(
      `UPDATE quiz_attempts 
       SET end_time = COALESCE($1, end_time),
           total_score = COALESCE($2, total_score),
           status = COALESCE($3, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE attempt_id = $4
       RETURNING *`,
      [end_time, total_score, status, attemptId]
    );
    return result.rows[0];
  }
};