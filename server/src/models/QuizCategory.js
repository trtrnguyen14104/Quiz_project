import { pool } from "../config/database.js";

export const QuizCategoryModel = {
  async findAll() {
    const result = await pool.query(
      "SELECT * FROM quiz_categories WHERE deleted_at IS NULL ORDER BY category_name"
    );
    return result.rows;
  },

  async findById(categoryId) {
    const result = await pool.query(
      "SELECT * FROM quiz_categories WHERE category_id = $1 AND deleted_at IS NULL",
      [categoryId]
    );
    return result.rows[0];
  },

  async findByName(categoryName) {
    const result = await pool.query(
      "SELECT * FROM quiz_categories WHERE category_name = $1 AND deleted_at IS NULL",
      [categoryName]
    );
    return result.rows[0];
  },

  async create(categoryData) {
    const { category_name, description } = categoryData;

    const result = await pool.query(
      `INSERT INTO quiz_categories (category_name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [category_name, description]
    );
    return result.rows[0];
  },

  async update(categoryId, categoryData) {
    const { category_name, description } = categoryData;

    const result = await pool.query(
      `UPDATE quiz_categories 
       SET category_name = COALESCE($1, category_name),
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE category_id = $3 AND deleted_at IS NULL
       RETURNING *`,
      [category_name, description, categoryId]
    );
    return result.rows[0];
  },

  async softDelete(categoryId) {
    return pool.query(
      "UPDATE quiz_categories SET deleted_at = CURRENT_TIMESTAMP WHERE category_id = $1",
      [categoryId]
    );
  },

  async countQuizzes(categoryId) {
    const result = await pool.query(
      "SELECT COUNT(*) as quiz_count FROM quizzes WHERE category_id = $1",
      [categoryId]
    );
    return parseInt(result.rows[0].quiz_count);
  },
};
