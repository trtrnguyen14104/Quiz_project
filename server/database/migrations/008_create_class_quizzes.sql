CREATE TABLE class_quizzes (
  class_quiz_id SERIAL PRIMARY KEY,
  class_id INT NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
  quiz_id INT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (class_id, quiz_id)
);
