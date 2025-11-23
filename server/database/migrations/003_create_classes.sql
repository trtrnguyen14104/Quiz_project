CREATE TABLE classes (
  class_id SERIAL PRIMARY KEY,
  class_name VARCHAR(150) NOT NULL,
  description TEXT,
  class_code VARCHAR(6) UNIQUE NOT NULL,
  subject_id INT NOT NULL REFERENCES subjects(subject_id),
  teacher_id INT NOT NULL REFERENCES users(user_id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','archived','deleted')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
