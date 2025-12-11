import { pool } from "../config/database.js";
export const ClassQuizModel = {
  async findByClass(classId) {
    const result = await pool.query(
      `SELECT cq.*, q.title, q.description, q.quiz_code, q.difficulty_level, q.total_score
       FROM class_quizzes cq
       JOIN quizzes q ON cq.quiz_id = q.quiz_id
       WHERE cq.class_id = $1
       ORDER BY cq.assigned_at DESC`,
      [classId]
    );
    return result.rows;
  },

  async findByQuiz(quizId) {
    const result = await pool.query(
      `SELECT cq.*, c.class_name, c.class_code
       FROM class_quizzes cq
       JOIN classes c ON cq.class_id = c.class_id
       WHERE cq.quiz_id = $1
       ORDER BY cq.assigned_at DESC`,
      [quizId]
    );
    return result.rows;
  },

  async findById(classQuizId) {
    const result = await pool.query(
      `SELECT cq.*, c.class_name, q.title as quiz_title
       FROM class_quizzes cq
       JOIN classes c ON cq.class_id = c.class_id
       JOIN quizzes q ON cq.quiz_id = q.quiz_id
       WHERE cq.class_quiz_id = $1`,
      [classQuizId]
    );
    return result.rows[0];
  },

  async findByClassAndQuiz(classId, quizId) {
    const result = await pool.query(
      "SELECT * FROM class_quizzes WHERE class_id = $1 AND quiz_id = $2",
      [classId, quizId]
    );
    return result.rows[0];
  },

  async create(classQuizData) {
    const { class_id, quiz_id, due_date } = classQuizData;

    const result = await pool.query(
      `INSERT INTO class_quizzes (class_id, quiz_id, due_date)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [class_id, quiz_id, due_date]
    );
    return result.rows[0];
  },

  async updateDueDate(classQuizId, dueDate) {
    const result = await pool.query(
      `UPDATE class_quizzes 
       SET due_date = $1
       WHERE class_quiz_id = $2
       RETURNING *`,
      [dueDate, classQuizId]
    );
    return result.rows[0];
  },

  async delete(classQuizId) {
    return pool.query("DELETE FROM class_quizzes WHERE class_quiz_id = $1", [
      classQuizId,
    ]);
  },
};
