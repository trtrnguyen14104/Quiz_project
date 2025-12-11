import {pool} from "../config/database.js";

export const UserModel = {
async findAll() {
    try {
        const result = await pool.query(
        `SELECT user_id, user_name, email, avatar_url, role, is_verified, status, created_at FROM users WHERE status = $1`,
        ["active"]
    );
    return result.rows;
    } catch (error) {
        console.error("lỗi find all users Model");
        throw error;
    }
    
},

async findById(userId) {
    try {
    const result = await pool.query(
    `SELECT user_id, user_name, email, avatar_url, role, is_verified, status, created_at FROM users WHERE user_id = $1`,
    [userId]
    );
    return result.rows[0];
    } catch (error) {
        console.error("lỗi find user by Id Model");
        throw error;
    }
    
},

async findByEmail(email) {
    try {
    const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
    );
    return result.rows[0]; 
    } catch (error) {
        console.error("lỗi find user by email Model");
        throw error;
    }
    
},

async create(userData) {
    try {
        const { user_name, email, password_hash, role } = userData;
        const result = await pool.query(
        `INSERT INTO users (user_name, email, password_hash, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING user_id, user_name, email, role, created_at`,
        [user_name, email, password_hash, role]
        );
        return result.rows[0]; 
    } catch (error) {
        console.error("lỗi create user Model");
        throw error;
    }
    
},

async update(userId, userData) {
    try {
        const { user_name, avatar_url, is_verified, status } = userData;
        const result = await pool.query(
        `UPDATE users 
        SET user_name = COALESCE($1, user_name),
            avatar_url = COALESCE($2, avatar_url),
            is_verified = COALESCE($3, is_verified),
            status = COALESCE($4, status),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $5
        RETURNING user_id, 
                user_name, 
                email, 
                avatar_url, 
                role, 
                is_verified, 
                status`,
                [user_name, 
                avatar_url, 
                is_verified, 
                status, 
                userId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("lỗi update user Model");
        throw error;
    }
    
},
async delete (id){
    try {
        const result = await pool.query(`DELETE FROM users WHERE user_id = $1`,[id]);
        return result.rows[0];
    } catch (error) {
        console.error("lỗi delete user Model");
        throw error;
    }
},
async createGoogleUser(userData) {
  const { user_name, email, avatar_url } = userData;
  const result = await pool.query(
    `INSERT INTO users (user_name, email, password_hash, role, avatar_url, is_verified) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING user_id, user_name, email, role, avatar_url, is_verified, created_at`,
    [user_name, email, "google", "student", avatar_url, true]
  );
  return result.rows[0];
},
}