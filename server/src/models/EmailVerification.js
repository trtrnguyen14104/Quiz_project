import { pool } from "../config/database.js";
import crypto from "crypto";
export const EmailVerificationModel = {
  async create(userId) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await pool.query(
      `INSERT INTO email_verifications (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, token, expiresAt]
    );
    return result.rows[0];
  },

  async findByToken(token) {
    const result = await pool.query(
      `SELECT ev.*, u.email, u.user_name
       FROM email_verifications ev
       JOIN users u ON ev.user_id = u.user_id
       WHERE ev.token = $1 AND ev.expires_at > NOW()`,
      [token]
    );
    return result.rows[0];
  },

  async deleteByUserId(userId) {
    return pool.query(
      "DELETE FROM email_verifications WHERE user_id = $1",
      [userId]
    );
  },

  async deleteExpired() {
    return pool.query(
      "DELETE FROM email_verifications WHERE expires_at < NOW()"
    );
  },
};