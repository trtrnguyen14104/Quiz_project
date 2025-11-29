import { pool } from "../config/database.js";

const SubjectModel = {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE deleted_at IS NULL ORDER BY subject_name'
    );
    return result.rows;
  },

  async findById(subjectId) {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE subject_id = $1 AND deleted_at IS NULL',
      [subjectId]
    );
    return result.rows[0];
  },

  async create(subjectData) {
    const { subject_name, description } = subjectData;
    const result = await pool.query(
      `INSERT INTO subjects (subject_name, description) 
       VALUES ($1, $2) 
       RETURNING *`,
      [subject_name, description]
    );
    return result.rows[0];
  },

  async update(subjectId, subjectData) {
    const { subject_name, description } = subjectData;
    const result = await pool.query(
      `UPDATE subjects 
       SET subject_name = COALESCE($1, subject_name),
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE subject_id = $3 AND deleted_at IS NULL
       RETURNING *`,
      [subject_name, description, subjectId]
    );
    return result.rows[0];
  },

  async softDelete(subjectId) {
    const result = await pool.query(
      `UPDATE subjects 
       SET deleted_at = CURRENT_TIMESTAMP 
       WHERE subject_id = $1
       RETURNING *`,
      [subjectId]
    );
    return result.rows[0];
  },

  async delete(subjectId) {
    return pool.query('DELETE FROM subjects WHERE subject_id = $1', [subjectId]);
  }
};