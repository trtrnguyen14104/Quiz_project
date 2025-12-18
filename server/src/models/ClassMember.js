import { pool } from "../config/database.js";

export const ClassMemberModel = {
  async findByClassAndUser(classId, userId) {
    const result = await pool.query(
      `SELECT * FROM class_members
       WHERE class_id = $1 AND user_id = $2`,
      [classId, userId]
    );
    return result.rows[0];
  },

  async findByClass(classId) {
    const result = await pool.query(
      `SELECT cm.*, u.user_name, u.email, u.avatar_url
       FROM class_members cm
       JOIN users u ON cm.user_id = u.user_id
       WHERE cm.class_id = $1 AND cm.status = 'active'
       ORDER BY cm.joined_at DESC`,
      [classId]
    );
    return result.rows;
  },

  async findByUser(userId) {
    const result = await pool.query(
      `SELECT cm.*, c.class_name, c.class_code, s.subject_name, u.user_name as teacher_name
       FROM class_members cm
       JOIN classes c ON cm.class_id = c.class_id
       LEFT JOIN subjects s ON c.subject_id = s.subject_id
       LEFT JOIN users u ON c.teacher_id = u.user_id
       WHERE cm.user_id = $1 AND cm.status = 'active' AND c.deleted_at IS NULL
       ORDER BY cm.joined_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async create(memberData) {
    const { class_id, user_id, status = 'active' } = memberData;

    const result = await pool.query(
      `INSERT INTO class_members (class_id, user_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [class_id, user_id, status]
    );
    return result.rows[0];
  },

  async updateStatus(classId, userId, status) {
    const result = await pool.query(
      `UPDATE class_members
       SET status = $3
       WHERE class_id = $1 AND user_id = $2
       RETURNING *`,
      [classId, userId, status]
    );
    return result.rows[0];
  },

  async remove(classId, userId) {
    const result = await pool.query(
      `DELETE FROM class_members
       WHERE class_id = $1 AND user_id = $2
       RETURNING *`,
      [classId, userId]
    );
    return result.rows[0];
  },
};
