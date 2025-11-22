CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  question_id INT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  answer_order INT NOT NULL,
  UNIQUE (question_id, answer_order)
);
