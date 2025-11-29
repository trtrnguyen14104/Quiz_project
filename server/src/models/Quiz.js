import { pool } from "../config/database.js";

const QuizModel = {
  async findAll(filters = {}) {
    let query = `
      SELECT q.*, s.subject_name, u.user_name as creator_name
      FROM quizzes q
      LEFT JOIN subjects s ON q.subject_id = s.subject_id
      LEFT JOIN users u ON q.creator_id = u.user_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.subject_id) {
      query += ` AND q.subject_id = $${paramCount++}`;
      params.push(filters.subject_id);
    }

    if (filters.difficulty_level) {
      query += ` AND q.difficulty_level = $${paramCount++}`;
      params.push(filters.difficulty_level);
    }

    if (filters.status) {
      query += ` AND q.status = $${paramCount++}`;
      params.push(filters.status);
    }

    query += ' ORDER BY q.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(quizId) {
    const result = await pool.query(
      `SELECT q.*, s.subject_name, t.topic_name, c.category_name, u.user_name as creator_name
       FROM quizzes q
       LEFT JOIN subjects s ON q.subject_id = s.subject_id
       LEFT JOIN topics t ON q.topic_id = t.topic_id
       LEFT JOIN quiz_categories c ON q.category_id = c.category_id
       LEFT JOIN users u ON q.creator_id = u.user_id
       WHERE q.quiz_id = $1`,
      [quizId]
    );
    return result.rows[0];
  },

  async findByCode(quizCode) {
    const result = await pool.query(
      'SELECT * FROM quizzes WHERE quiz_code = $1',
      [quizCode]
    );
    return result.rows[0];
  },

  async create(quizData) {
    const {
      title, description, cover_image_url, quiz_code, subject_id,
      topic_id, category_id, difficulty_level, creator_id, access_level
    } = quizData;

    const result = await pool.query(
      `INSERT INTO quizzes (
        title, description, cover_image_url, quiz_code, subject_id,
        topic_id, category_id, difficulty_level, creator_id, access_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [title, description, cover_image_url, quiz_code, subject_id,
       topic_id, category_id, difficulty_level, creator_id, access_level]
    );
    return result.rows[0];
  },

  async update(quizId, quizData) {
    const {
      title, description, cover_image_url, difficulty_level,
      access_level, status, total_score
    } = quizData;

    const result = await pool.query(
      `UPDATE quizzes 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           cover_image_url = COALESCE($3, cover_image_url),
           difficulty_level = COALESCE($4, difficulty_level),
           access_level = COALESCE($5, access_level),
           status = COALESCE($6, status),
           total_score = COALESCE($7, total_score),
           updated_at = CURRENT_TIMESTAMP
       WHERE quiz_id = $8
       RETURNING *`,
      [title, description, cover_image_url, difficulty_level,
       access_level, status, total_score, quizId]
    );
    return result.rows[0];
  },

  async delete(quizId) {
    return pool.query('DELETE FROM quizzes WHERE quiz_id = $1', [quizId]);
  }
};