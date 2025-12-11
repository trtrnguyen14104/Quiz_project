import { pool } from "../config/database.js";
export const AnswerModel = {
  async findByQuestion(questionId) {
    const result = await pool.query(
      "SELECT * FROM answers WHERE question_id = $1 ORDER BY answer_order",
      [questionId]
    );
    return result.rows;
  },

  async findById(answerId) {
    const result = await pool.query(
      "SELECT * FROM answers WHERE answer_id = $1",
      [answerId]
    );
    return result.rows[0];
  },

  async create(answerData) {
    const { question_id, content, is_correct, answer_order } = answerData;

    const result = await pool.query(
      `INSERT INTO answers (question_id, content, is_correct, answer_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [question_id, content, is_correct, answer_order]
    );
    return result.rows[0];
  },

  async update(answerId, answerData) {
    const { content, is_correct } = answerData;

    const result = await pool.query(
      `UPDATE answers 
       SET content = COALESCE($1, content),
           is_correct = COALESCE($2, is_correct),
           updated_at = CURRENT_TIMESTAMP
       WHERE answer_id = $3
       RETURNING *`,
      [content, is_correct, answerId]
    );
    return result.rows[0];
  },

  async delete(answerId) {
    return pool.query("DELETE FROM answers WHERE answer_id = $1", [answerId]);
  },
};
