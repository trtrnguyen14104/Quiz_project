CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  google_id VARCHAR(255),
  avatar_url VARCHAR(500),
  role VARCHAR(20) NOT NULL CHECK (role IN ('student','teacher','admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);