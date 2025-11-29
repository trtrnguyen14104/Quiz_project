import { pool } from "../config/database.js";
const ClassModel = {
  async findAll() {
    const result = await pool.query(
      `SELECT c.*, s.subject_name, u.user_name as teacher_name
       FROM classes c
       LEFT JOIN subjects s ON c.subject_id = s.subject_id
       LEFT JOIN users u ON c.teacher_id = u.user_id
       WHERE c.deleted_at IS NULL AND c.status = 'active'
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  },

  async findByTeacher(teacherId) {
    const result = await pool.query(
      `SELECT c.*, s.subject_name
       FROM classes c
       LEFT JOIN subjects s ON c.subject_id = s.subject_id
       WHERE c.teacher_id = $1 AND c.deleted_at IS NULL
       ORDER BY c.created_at DESC`,
      [teacherId]
    );
    return result.rows;
  },

  async findById(classId) {
    const result = await pool.query(
      `SELECT c.*, s.subject_name, u.user_name as teacher_name
       FROM classes c
       LEFT JOIN subjects s ON c.subject_id = s.subject_id
       LEFT JOIN users u ON c.teacher_id = u.user_id
       WHERE c.class_id = $1 AND c.deleted_at IS NULL`,
      [classId]
    );
    return result.rows[0];
  },

  async findByCode(classCode) {
    const result = await pool.query(
      'SELECT * FROM classes WHERE class_code = $1 AND deleted_at IS NULL',
      [classCode]
    );
    return result.rows[0];
  },

  async create(classData) {
    const { class_name, description, class_code, subject_id, teacher_id } = classData;

    const result = await pool.query(
      `INSERT INTO classes (class_name, description, class_code, subject_id, teacher_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [class_name, description, class_code, subject_id, teacher_id]
    );
    return result.rows[0];
  },

  async update(classId, classData) {
    const { class_name, description, status } = classData;

    const result = await pool.query(
      `UPDATE classes 
       SET class_name = COALESCE($1, class_name),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE class_id = $4 AND deleted_at IS NULL
       RETURNING *`,
      [class_name, description, status, classId]
    );
    return result.rows[0];
  },

  async softDelete(classId) {
    return pool.query(
      'UPDATE classes SET deleted_at = CURRENT_TIMESTAMP WHERE class_id = $1',
      [classId]
    );
  }
};