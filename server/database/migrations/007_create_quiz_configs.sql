CREATE TABLE quiz_configs (
  config_id SERIAL PRIMARY KEY,
  quiz_id INT UNIQUE NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  result_mode VARCHAR(20) DEFAULT 'practice' CHECK (result_mode IN ('practice', 'exam')),
  max_attempts INT DEFAULT 1 CHECK (max_attempts >= 1),
  shuffle_questions BOOLEAN DEFAULT FALSE,
  shuffle_answers BOOLEAN DEFAULT FALSE,
  scoring_scale DECIMAL(5,2) DEFAULT 10.00
);