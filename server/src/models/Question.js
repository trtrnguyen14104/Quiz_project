import { pool } from "../config/database.js";
const QuestionModel = {
  async findByQuiz(quizId) {
    const result = await pool.query(
      `SELECT * FROM questions 
       WHERE quiz_id = $1 AND deleted_at IS NULL 
       ORDER BY question_order`,
      [quizId]
    );
    return result.rows;
  },

  async findById(questionId) {
    const result = await pool.query(
      'SELECT * FROM questions WHERE question_id = $1 AND deleted_at IS NULL',
      [questionId]
    );
    return result.rows[0];
  },

  async create(questionData) {
    const {
      quiz_id, content, image_url, question_order, points, time_limit
    } = questionData;

    const result = await pool.query(
      `INSERT INTO questions (
        quiz_id, content, image_url, question_order, points, time_limit
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [quiz_id, content, image_url, question_order, points, time_limit]
    );
    return result.rows[0];
  },

  async update(questionId, questionData) {
    const { content, image_url, points, time_limit } = questionData;

    const result = await pool.query(
      `UPDATE questions 
       SET content = COALESCE($1, content),
           image_url = COALESCE($2, image_url),
           points = COALESCE($3, points),
           time_limit = COALESCE($4, time_limit),
           updated_at = CURRENT_TIMESTAMP
       WHERE question_id = $5 AND deleted_at IS NULL
       RETURNING *`,
      [content, image_url, points, time_limit, questionId]
    );
    return result.rows[0];
  },

  async softDelete(questionId) {
    return pool.query(
      'UPDATE questions SET deleted_at = CURRENT_TIMESTAMP WHERE question_id = $1',
      [questionId]
    );
  }
};

// models/answer.model.js
const pool = require('../db/pool');

const AnswerModel = {
  async findByQuestion(questionId) {
    const result = await pool.query(
      'SELECT * FROM answers WHERE question_id = $1 ORDER BY answer_order',
      [questionId]
    );
    return result.rows;
  },

  async findById(answerId) {
    const result = await pool.query(
      'SELECT * FROM answers WHERE answer_id = $1',
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
    return pool.query('DELETE FROM answers WHERE answer_id = $1', [answerId]);
  }
};