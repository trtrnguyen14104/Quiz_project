CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  quiz_id INT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  question_order INT NOT NULL,
  points DECIMAL(5,2) DEFAULT 1.00,
  time_limit INT DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE (quiz_id, question_order)
);