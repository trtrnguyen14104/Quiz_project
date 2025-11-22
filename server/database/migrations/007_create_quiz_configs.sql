CREATE TABLE quiz_configs (
  config_id SERIAL PRIMARY KEY,
  quiz_id INT UNIQUE NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  result_mode VARCHAR(20) DEFAULT 'immediate' CHECK (result_mode IN ('immediate','delayed','hidden')),
  max_attempts INT DEFAULT 1 CHECK (max_attempts >= 1),
  shuffle_questions BOOLEAN DEFAULT TRUE,
  shuffle_answers BOOLEAN DEFAULT TRUE,
  scoring_scale NUMERIC(5,2) DEFAULT 10.00
);
