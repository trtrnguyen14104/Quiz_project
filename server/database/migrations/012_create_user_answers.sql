CREATE TABLE user_answers (
  user_answer_id SERIAL PRIMARY KEY,
  attempt_id INT NOT NULL REFERENCES quiz_attempts(attempt_id) ON DELETE CASCADE,
  question_id INT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  answer_id INT REFERENCES answers(answer_id) ON DELETE SET NULL,
  is_correct BOOLEAN,
  points_earned NUMERIC(5,2) DEFAULT 0,
  time_taken INT,
  UNIQUE (attempt_id, question_id)
);
