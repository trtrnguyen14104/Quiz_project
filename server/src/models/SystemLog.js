import { pool } from "../config/database.js";
export const SystemLogModel = {
  async findAll(limit = 100, offset = 0) {
    const result = await pool.query(
      `SELECT sl.*, u.user_name
       FROM system_logs sl
       LEFT JOIN users u ON sl.user_id = u.user_id
       ORDER BY sl.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async findByUser(userId, limit = 50) {
    const result = await pool.query(
      `SELECT * FROM system_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async findByAction(action, limit = 50) {
    const result = await pool.query(
      `SELECT sl.*, u.user_name
       FROM system_logs sl
       LEFT JOIN users u ON sl.user_id = u.user_id
       WHERE sl.action = $1
       ORDER BY sl.created_at DESC
       LIMIT $2`,
      [action, limit]
    );
    return result.rows;
  },

  async findByEntity(entityType, entityId) {
    const result = await pool.query(
      `SELECT sl.*, u.user_name
       FROM system_logs sl
       LEFT JOIN users u ON sl.user_id = u.user_id
       WHERE sl.entity_type = $1 AND sl.entity_id = $2
       ORDER BY sl.created_at DESC`,
      [entityType, entityId]
    );
    return result.rows;
  },

  async create(logData) {
    const { user_id, action, entity_type, entity_id, ip_address } = logData;

    const result = await pool.query(
      `INSERT INTO system_logs (user_id, action, entity_type, entity_id, ip_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, action, entity_type, entity_id, ip_address]
    );
    return result.rows[0];
  },

  async deleteOldLogs(daysToKeep = 90) {
    const result = await pool.query(
      `DELETE FROM system_logs 
       WHERE created_at < NOW() - INTERVAL '1 day' * $1`,
      [daysToKeep]
    );
    return result.rowCount;
  },

  async getStatsByAction(startDate, endDate) {
    const result = await pool.query(
      `SELECT action, COUNT(*) as count
       FROM system_logs
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY action
       ORDER BY count DESC`,
      [startDate, endDate]
    );
    return result.rows;
  },
};
