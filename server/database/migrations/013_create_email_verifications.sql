CREATE TABLE email_verifications (
      verification_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      token VARCHAR(255) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_email_verifications_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
    );