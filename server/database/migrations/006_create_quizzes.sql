CREATE TABLE quizzes (
  quiz_id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image_url VARCHAR(500),
  subject_id INT NOT NULL REFERENCES subjects(subject_id),
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy','medium','hard')),
  creator_id INT NOT NULL REFERENCES users(user_id),
  access_level VARCHAR(20) DEFAULT 'private' CHECK (access_level IN ('private','class','public','code')),
  quiz_code VARCHAR(6) UNIQUE,
  total_score NUMERIC(5,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
