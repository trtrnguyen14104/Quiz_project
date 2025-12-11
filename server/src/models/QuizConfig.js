import { pool } from "../config/database.js";
export const QuizConfigModel = {
  async findByQuiz(quizId) {
    const result = await pool.query(
      "SELECT * FROM quiz_configs WHERE quiz_id = $1",
      [quizId]
    );
    return result.rows[0];
  },

  async findById(configId) {
    const result = await pool.query(
      "SELECT * FROM quiz_configs WHERE config_id = $1",
      [configId]
    );
    return result.rows[0];
  },

  async create(configData) {
    const {
      quiz_id,
      start_time,
      end_time,
      result_mode,
      max_attempts,
      shuffle_questions,
      shuffle_answers,
      scoring_scale,
    } = configData;

    const result = await pool.query(
      `INSERT INTO quiz_configs (
        quiz_id, start_time, end_time, result_mode, max_attempts,
        shuffle_questions, shuffle_answers, scoring_scale
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        quiz_id,
        start_time,
        end_time,
        result_mode,
        max_attempts,
        shuffle_questions,
        shuffle_answers,
        scoring_scale,
      ]
    );
    return result.rows[0];
  },

  async update(configId, configData) {
    const {
      start_time,
      end_time,
      result_mode,
      max_attempts,
      shuffle_questions,
      shuffle_answers,
      scoring_scale,
    } = configData;

    const result = await pool.query(
      `UPDATE quiz_configs 
       SET start_time = COALESCE($1, start_time),
           end_time = COALESCE($2, end_time),
           result_mode = COALESCE($3, result_mode),
           max_attempts = COALESCE($4, max_attempts),
           shuffle_questions = COALESCE($5, shuffle_questions),
           shuffle_answers = COALESCE($6, shuffle_answers),
           scoring_scale = COALESCE($7, scoring_scale)
       WHERE config_id = $8
       RETURNING *`,
      [
        start_time,
        end_time,
        result_mode,
        max_attempts,
        shuffle_questions,
        shuffle_answers,
        scoring_scale,
        configId,
      ]
    );
    return result.rows[0];
  },

  async delete(configId) {
    return pool.query("DELETE FROM quiz_configs WHERE config_id = $1", [
      configId,
    ]);
  },
};
