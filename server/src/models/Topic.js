import { pool } from "../config/database.js";
const TopicModel = {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM topics WHERE deleted_at IS NULL ORDER BY topic_name'
    );
    return result.rows;
  },

  async findBySubject(subjectId) {
    const result = await pool.query(
      'SELECT * FROM topics WHERE subject_id = $1 AND deleted_at IS NULL ORDER BY topic_name',
      [subjectId]
    );
    return result.rows;
  },

  async findById(topicId) {
    const result = await pool.query(
      'SELECT * FROM topics WHERE topic_id = $1 AND deleted_at IS NULL',
      [topicId]
    );
    return result.rows[0];
  },

  async create(topicData) {
    const { topic_name, subject_id, description } = topicData;
    const result = await pool.query(
      `INSERT INTO topics (topic_name, subject_id, description) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [topic_name, subject_id, description]
    );
    return result.rows[0];
  },

  async update(topicId, topicData) {
    const { topic_name, description } = topicData;
    const result = await pool.query(
      `UPDATE topics 
       SET topic_name = COALESCE($1, topic_name),
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE topic_id = $3 AND deleted_at IS NULL
       RETURNING *`,
      [topic_name, description, topicId]
    );
    return result.rows[0];
  },

  async softDelete(topicId) {
    return pool.query(
      'UPDATE topics SET deleted_at = CURRENT_TIMESTAMP WHERE topic_id = $1',
      [topicId]
    );
  }
};