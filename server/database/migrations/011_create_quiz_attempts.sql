CREATE TABLE quiz_attempts (
  attempt_id SERIAL PRIMARY KEY,
  quiz_id INT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  total_score NUMERIC(5,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitted','graded','expired','abandoned')),
  attempt_number INT DEFAULT 1 CHECK (attempt_number >= 1),
  UNIQUE (quiz_id, user_id, attempt_number)
);
