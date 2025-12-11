-- Foreign Key Indexes
CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_classes_subject ON classes(subject_id);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_class_members_class ON class_members(class_id);
CREATE INDEX idx_class_members_user ON class_members(user_id);
CREATE INDEX idx_quizzes_subject ON quizzes(subject_id);
CREATE INDEX idx_quizzes_topic ON quizzes(topic_id);
CREATE INDEX idx_quizzes_category ON quizzes(category_id);
CREATE INDEX idx_quizzes_creator ON quizzes(creator_id);
CREATE INDEX idx_class_quizzes_class ON class_quizzes(class_id);
CREATE INDEX idx_class_quizzes_quiz ON class_quizzes(quiz_id);
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_user_answers_attempt ON user_answers(attempt_id);
CREATE INDEX idx_user_answers_question ON user_answers(question_id);
CREATE INDEX idx_system_logs_user ON system_logs(user_id);
CREATE INDEX idx_email_verifications_token ON email_verifications(token);
CREATE INDEX idx_email_verifications_user ON email_verifications(user_id);
CREATE INDEX idx_email_verifications_expires ON email_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);

-- Search Indexes
CREATE INDEX idx_subjects_name ON subjects(subject_name);
CREATE INDEX idx_classes_code ON classes(class_code);
CREATE INDEX idx_quizzes_code ON quizzes(quiz_code);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_categories_name ON quiz_categories(category_name);

-- Performance Indexes
CREATE INDEX idx_quiz_configs_quiz ON quiz_configs(quiz_id);
CREATE INDEX idx_class_members_status ON class_members(status);
CREATE INDEX idx_quizzes_status ON quizzes(status);