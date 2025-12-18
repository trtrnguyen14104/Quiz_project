-- Add result_mode to quizzes table (for quizzes not in a class)
ALTER TABLE quizzes
ADD COLUMN result_mode VARCHAR(20) DEFAULT 'exam' CHECK (result_mode IN ('practice', 'exam'));

-- Add result_mode and max_attempts to class_quizzes table
ALTER TABLE class_quizzes
ADD COLUMN result_mode VARCHAR(20) DEFAULT 'exam' CHECK (result_mode IN ('practice', 'exam')),
ADD COLUMN max_attempts INT DEFAULT NULL;
