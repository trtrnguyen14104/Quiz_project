-- =============================================
-- QUIZ PROJECT - SEED DATA
-- Dữ liệu mẫu cho hệ thống Quiz
-- =============================================

-- Xóa dữ liệu cũ (chỉ nếu bảng tồn tại)
DO $$
DECLARE
    tbl_name TEXT;
    seq_name TEXT;
BEGIN
    -- Truncate tables if they exist
    FOR tbl_name IN
        SELECT unnest(ARRAY['user_answers', 'quiz_attempts', 'class_members', 'class_quizzes',
                            'answers', 'questions', 'quizzes', 'quiz_categories', 'topics',
                            'classes', 'subjects', 'email_verifications', 'users'])
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND information_schema.tables.table_name = tbl_name) THEN
            EXECUTE 'TRUNCATE TABLE ' || tbl_name || ' CASCADE';
        END IF;
    END LOOP;

    -- Reset sequences if they exist
    FOR seq_name IN
        SELECT unnest(ARRAY['users_user_id_seq', 'subjects_subject_id_seq', 'topics_topic_id_seq',
                            'quiz_categories_category_id_seq', 'classes_class_id_seq', 'quizzes_quiz_id_seq',
                            'questions_question_id_seq', 'answers_answer_id_seq', 'class_members_member_id_seq',
                            'quiz_attempts_attempt_id_seq'])
    LOOP
        IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = seq_name) THEN
            EXECUTE 'ALTER SEQUENCE ' || seq_name || ' RESTART WITH 1';
        END IF;
    END LOOP;
END $$;

-- =============================================
-- 1. USERS (Người dùng)
-- Password cho tất cả: "123456" (đã hash với bcrypt)
-- =============================================
INSERT INTO users (user_name, email, password_hash, role, is_verified, status) VALUES
-- Admin
('Nguyễn Văn Admin', 'admin@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'admin', TRUE, 'active'),

-- Teachers (Giáo viên)
('Trần Thị Hương', 'huong.teacher@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'teacher', TRUE, 'active'),
('Lê Văn Nam', 'nam.teacher@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'teacher', TRUE, 'active'),
('Phạm Thị Lan', 'lan.teacher@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'teacher', TRUE, 'active'),

-- Students (Học sinh)
('Nguyễn Văn An', 'an.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Trần Thị Bình', 'binh.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Lê Văn Cường', 'cuong.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Phạm Thị Dung', 'dung.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Hoàng Văn Em', 'em.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Vũ Thị Phương', 'phuong.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Đặng Văn Giang', 'giang.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Bùi Thị Hà', 'ha.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Đinh Văn Khoa', 'khoa.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Mai Thị Linh', 'linh.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active'),
('Ngô Văn Minh', 'minh.student@quiz.com', '$2b$10$uHf6pvVvb5j4fBYnjaXoRewF0QcTdLWMHRAL5H0HcS7rJOwhyDo5y', 'student', TRUE, 'active');

-- =============================================
-- 2. SUBJECTS (Môn học)
-- =============================================
INSERT INTO subjects (subject_name, description) VALUES
('Toán học', 'Môn Toán học các cấp'),
('Vật lý', 'Môn Vật lý các cấp'),
('Hóa học', 'Môn Hóa học các cấp'),
('Sinh học', 'Môn Sinh học các cấp'),
('Ngữ văn', 'Môn Ngữ văn các cấp'),
('Tiếng Anh', 'Môn Tiếng Anh các cấp'),
('Lịch sử', 'Môn Lịch sử các cấp'),
('Địa lý', 'Môn Địa lý các cấp'),
('Tin học', 'Môn Tin học - Công nghệ thông tin'),
('GDCD', 'Giáo dục công dân');

-- =============================================
-- 3. TOPICS (Chủ đề)
-- =============================================
INSERT INTO topics (subject_id, topic_name, description) VALUES
-- Toán học (subject_id = 1)
(1, 'Đại số', 'Các chủ đề về đại số'),
(1, 'Hình học', 'Các chủ đề về hình học'),
(1, 'Giải tích', 'Các chủ đề về giải tích'),

-- Vật lý (subject_id = 2)
(2, 'Cơ học', 'Các chủ đề về cơ học'),
(2, 'Điện học', 'Các chủ đề về điện học'),
(2, 'Quang học', 'Các chủ đề về quang học'),

-- Tiếng Anh (subject_id = 6)
(6, 'Grammar', 'Ngữ pháp tiếng Anh'),
(6, 'Vocabulary', 'Từ vựng tiếng Anh'),
(6, 'Reading', 'Đọc hiểu tiếng Anh'),

-- Tin học (subject_id = 9)
(9, 'Lập trình cơ bản', 'Các khái niệm lập trình cơ bản'),
(9, 'Cấu trúc dữ liệu', 'Cấu trúc dữ liệu và giải thuật'),
(9, 'Web Development', 'Phát triển ứng dụng web');

-- =============================================
-- 4. QUIZ CATEGORIES (Danh mục Quiz)
-- =============================================
INSERT INTO quiz_categories (category_name, description) VALUES
('Kiểm tra định kỳ', 'Các bài kiểm tra định kỳ'),
('Kiểm tra giữa kỳ', 'Các bài kiểm tra giữa kỳ'),
('Kiểm tra cuối kỳ', 'Các bài kiểm tra cuối kỳ'),
('Ôn tập', 'Các bài ôn tập'),
('Luyện tập', 'Các bài luyện tập');

-- =============================================
-- 5. CLASSES (Lớp học)
-- =============================================
INSERT INTO classes (class_name, description, class_code, subject_id, teacher_id, status) VALUES
('Toán 10A1', 'Lớp Toán 10 nâng cao', 'MATH01', 1, 2, 'active'),
('Toán 11A1', 'Lớp Toán 11 cơ bản', 'MATH02', 1, 2, 'active'),
('Vật lý 10A1', 'Lớp Vật lý 10', 'PHYS01', 2, 3, 'active'),
('Tiếng Anh 10A1', 'Lớp Tiếng Anh giao tiếp', 'ENG001', 6, 3, 'active'),
('Tin học 11A1', 'Lớp Tin học ứng dụng', 'COMP01', 9, 4, 'active'),
('Toán 12A1', 'Lớp Toán ôn thi THPT', 'MATH03', 1, 2, 'active');

-- =============================================
-- 6. CLASS MEMBERS (Thành viên lớp)
-- =============================================
INSERT INTO class_members (class_id, user_id, status) VALUES
-- Toán 10A1 (class_id = 1)
(1, 5, 'active'),  -- Nguyễn Văn An
(1, 6, 'active'),  -- Trần Thị Bình
(1, 7, 'active'),  -- Lê Văn Cường
(1, 8, 'active'),  -- Phạm Thị Dung
(1, 9, 'active'),  -- Hoàng Văn Em

-- Toán 11A1 (class_id = 2)
(2, 10, 'active'), -- Vũ Thị Phương
(2, 11, 'active'), -- Đặng Văn Giang
(2, 12, 'active'), -- Bùi Thị Hà

-- Vật lý 10A1 (class_id = 3)
(3, 5, 'active'),  -- Nguyễn Văn An
(3, 6, 'active'),  -- Trần Thị Bình
(3, 13, 'active'), -- Đinh Văn Khoa
(3, 14, 'active'), -- Mai Thị Linh

-- Tiếng Anh 10A1 (class_id = 4)
(4, 7, 'active'),  -- Lê Văn Cường
(4, 8, 'active'),  -- Phạm Thị Dung
(4, 15, 'active'), -- Ngô Văn Minh

-- Tin học 11A1 (class_id = 5)
(5, 9, 'active'),  -- Hoàng Văn Em
(5, 10, 'active'), -- Vũ Thị Phương
(5, 11, 'active'), -- Đặng Văn Giang
(5, 12, 'active'); -- Bùi Thị Hà

-- =============================================
-- 7. QUIZZES (Bài Quiz)
-- =============================================
    INSERT INTO quizzes (title, description, quiz_code, subject_id, topic_id, category_id, difficulty_level, creator_id, access_level, status) VALUES
    -- Toán học
    ('Phương trình bậc 2', 'Kiểm tra về giải phương trình bậc 2', 'QZ0001', 1, 1, 1, 'medium', 2, 'public', 'published'),
    ('Hình học không gian', 'Bài tập về hình học không gian', 'QZ0002', 1, 2, 4, 'hard', 2, 'public', 'published'),
    ('Giới hạn và liên tục', 'Kiểm tra giữa kỳ - Giải tích', 'QZ0003', 1, 3, 2, 'medium', 2, 'public', 'published'),

    -- Vật lý
    ('Chuyển động thẳng đều', 'Kiểm tra cơ học cơ bản', 'QZ0004', 2, 4, 1, 'easy', 3, 'public', 'published'),
    ('Định luật Ôm', 'Bài tập về điện học', 'QZ0005', 2, 5, 4, 'medium', 3, 'public', 'published'),

    -- Tiếng Anh
    ('Present Tenses', 'Thì hiện tại trong tiếng Anh', 'QZ0006', 6, 7, 4, 'easy', 3, 'public', 'published'),
    ('Vocabulary - Unit 1', 'Từ vựng bài 1', 'QZ0007', 6, 8, 1, 'easy', 3, 'public', 'published'),

    -- Tin học (by Teachers)
    ('Cấu trúc rẽ nhánh', 'Lập trình cơ bản - If/Else', 'QZ0008', 9, 10, 4, 'medium', 4, 'public', 'published'),
    ('Array và String', 'Mảng và chuỗi trong lập trình', 'QZ0009', 9, 11, 1, 'medium', 4, 'public', 'published'),

    -- Quiz được tạo bởi học sinh (Students' Quizzes)
    -- Nguyễn Văn An (user_id = 5) - Toán học
    ('Luyện tập phương trình', 'Quiz ôn tập phương trình bậc nhất và bậc hai', 'QZ0010', 1, 1, 5, 'easy', 5, 'public', 'published'),

    -- Trần Thị Bình (user_id = 6) - Toán học
    ('Bất phương trình cơ bản', 'Ôn tập giải bất phương trình', 'QZ0011', 1, 1, 5, 'medium', 6, 'public', 'published'),

    -- Lê Văn Cường (user_id = 7) - Tiếng Anh
    ('Past Tenses Practice', 'Luyện tập thì quá khứ', 'QZ0012', 6, 7, 5, 'easy', 7, 'public', 'published'),

    -- Phạm Thị Dung (user_id = 8) - Tiếng Anh
    ('Common Idioms', 'Thành ngữ thông dụng trong tiếng Anh', 'QZ0013', 6, 8, 5, 'medium', 8, 'public', 'published'),

    -- Hoàng Văn Em (user_id = 9) - Tin học
    ('HTML & CSS Basics', 'Kiến thức cơ bản về HTML và CSS', 'QZ0014', 9, 12, 5, 'easy', 9, 'public', 'published'),

    -- Vũ Thị Phương (user_id = 10) - Vật lý
    ('Chuyển động biến đổi đều', 'Bài tập về chuyển động có gia tốc', 'QZ0015', 2, 4, 5, 'medium', 10, 'public', 'published');

-- =============================================
-- 8. CLASS QUIZZES (Gán Quiz cho lớp)
-- =============================================
INSERT INTO class_quizzes (class_id, quiz_id, assigned_at, due_date) VALUES
-- Toán 10A1
(1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days'),
(1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '14 days'),

-- Toán 11A1
(2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '10 days'),

-- Vật lý 10A1
(3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 days'),
(3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days'),

-- Tiếng Anh 10A1
(4, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days'),
(4, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 days'),

-- Tin học 11A1
(5, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days'),
(5, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '10 days');

-- =============================================
-- 9. QUESTIONS (Câu hỏi)
-- =============================================

-- Quiz 1: Phương trình bậc 2 (quiz_id = 1)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(1, 'Phương trình x² - 5x + 6 = 0 có nghiệm là:', 1, 2.00, 30),
(1, 'Phương trình nào sau đây vô nghiệm?', 2, 2.00, 30),
(1, 'Tổng hai nghiệm của phương trình x² - 7x + 10 = 0 là:', 3, 2.00, 30),
(1, 'Phương trình x² + 2x + 1 = 0 có nghiệm kép là:', 4, 2.00, 30),
(1, 'Biệt thức Delta của phương trình 2x² - 3x + 1 = 0 là:', 5, 2.00, 30);

-- Quiz 2: Hình học không gian (quiz_id = 2)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(2, 'Thể tích hình hộp chữ nhật có các cạnh 3cm, 4cm, 5cm là:', 1, 3.00, 45),
(2, 'Diện tích xung quanh hình trụ có bán kính đáy r=2cm, chiều cao h=5cm là:', 2, 3.00, 45),
(2, 'Thể tích hình cầu bán kính R=3cm là:', 3, 3.00, 45),
(2, 'Hai đường thẳng trong không gian có thể có mấy vị trí tương đối?', 4, 2.00, 30);

-- Quiz 3: Giới hạn và liên tục (quiz_id = 3)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(3, 'lim(x→∞) (2x+1)/(x-3) bằng:', 1, 2.50, 40),
(3, 'Hàm số nào sau đây liên tục tại x=0?', 2, 2.50, 40),
(3, 'lim(x→0) sin(x)/x bằng:', 3, 2.50, 40),
(3, 'Giới hạn vô cực là gì?', 4, 2.50, 40);

-- Quiz 4: Chuyển động thẳng đều (quiz_id = 4)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(4, 'Vận tốc trong chuyển động thẳng đều:', 1, 2.00, 25),
(4, 'Một xe chạy 100km trong 2 giờ. Vận tốc trung bình là:', 2, 2.00, 25),
(4, 'Quãng đường = Vận tốc × ...?', 3, 2.00, 25),
(4, 'Đơn vị của vận tốc trong hệ SI là:', 4, 2.00, 25),
(4, 'Gia tốc của chuyển động thẳng đều bằng:', 5, 2.00, 25);

-- Quiz 5: Định luật Ôm (quiz_id = 5)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(5, 'Định luật Ôm được biểu diễn bởi công thức:', 1, 2.50, 30),
(5, 'Điện trở của dây dẫn phụ thuộc vào:', 2, 2.50, 30),
(5, 'Hiệu điện thế 12V, điện trở 4Ω. Cường độ dòng điện là:', 3, 2.50, 30),
(5, 'Đơn vị của điện trở là:', 4, 2.50, 30);

-- Quiz 6: Present Tenses (quiz_id = 6)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(6, 'Which sentence is in Present Simple?', 1, 2.00, 20),
(6, 'Choose the correct form: She ___ to school every day.', 2, 2.00, 20),
(6, 'Present Continuous is used for:', 3, 2.00, 20),
(6, 'I ___ studying English now. (Fill in the blank)', 4, 2.00, 20),
(6, 'Have/Has + V3 is the structure of:', 5, 2.00, 20);

-- Quiz 7: Vocabulary - Unit 1 (quiz_id = 7)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(7, '"Beautiful" is an:', 1, 1.50, 15),
(7, 'What is the opposite of "happy"?', 2, 1.50, 15),
(7, '"Run" is a:', 3, 1.50, 15),
(7, 'Choose the correct spelling:', 4, 1.50, 15),
(7, '"Big, bigger, biggest" are forms of:', 5, 1.50, 15);

-- Quiz 8: Cấu trúc rẽ nhánh (quiz_id = 8)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(8, 'Cấu trúc if-else được sử dụng để:', 1, 2.00, 30),
(8, 'Trong Python, cú pháp if đúng là:', 2, 2.00, 30),
(8, 'Kết quả của: if (5 > 3) là:', 3, 2.00, 30),
(8, 'else if trong Python được viết là:', 4, 2.00, 30),
(8, 'Switch-case có trong Python không?', 5, 2.00, 30);

-- Quiz 9: Array và String (quiz_id = 9)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(9, 'Mảng (Array) là gì?', 1, 2.50, 35),
(9, 'Index của phần tử đầu tiên trong mảng là:', 2, 2.50, 35),
(9, 'Để lấy độ dài chuỗi trong Python dùng:', 3, 2.50, 35),
(9, 'Chuỗi trong Python có thể thay đổi được không?', 4, 2.50, 35);

-- =============================================
-- QUESTIONS FOR STUDENT-CREATED QUIZZES
-- =============================================

-- Quiz 10: Luyện tập phương trình (by Nguyễn Văn An - student)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(10, 'Phương trình 2x + 4 = 10 có nghiệm là:', 1, 2.00, 20),
(10, 'Giải phương trình: 3x - 6 = 0', 2, 2.00, 20),
(10, 'Phương trình x² - 4 = 0 có mấy nghiệm?', 3, 2.00, 25),
(10, 'Nghiệm của phương trình x² + 4x + 4 = 0 là:', 4, 2.00, 25);

-- Quiz 11: Bất phương trình cơ bản (by Trần Thị Bình - student)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(11, 'Giải bất phương trình: 2x + 3 > 7', 1, 2.50, 30),
(11, 'Bất phương trình x - 5 ≤ 0 có nghiệm là:', 2, 2.50, 30),
(11, 'Tập nghiệm của bất phương trình -x > 3 là:', 3, 2.50, 30);

-- Quiz 12: Past Tenses Practice (by Lê Văn Cường - student)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(12, 'I ___ to the park yesterday.', 1, 2.00, 20),
(12, 'She ___ her homework last night.', 2, 2.00, 20),
(12, 'They ___ soccer when it started to rain.', 3, 2.00, 20),
(12, 'Which sentence is in Past Perfect?', 4, 2.00, 25);

-- Quiz 13: Common Idioms (by Phạm Thị Dung - student)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(13, 'What does "break the ice" mean?', 1, 2.00, 25),
(13, '"A piece of cake" means:', 2, 2.00, 25),
(13, 'What is the meaning of "hit the books"?', 3, 2.00, 25),
(13, '"Under the weather" means:', 4, 2.00, 25);

-- Quiz 14: HTML & CSS Basics (by Hoàng Văn Em - student)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(14, 'HTML là viết tắt của:', 1, 2.00, 20),
(14, 'Thẻ nào dùng để tạo tiêu đề lớn nhất?', 2, 2.00, 20),
(14, 'CSS được dùng để làm gì?', 3, 2.00, 20),
(14, 'Thuộc tính nào thay đổi màu chữ trong CSS?', 4, 2.00, 20);

-- Quiz 15: Chuyển động biến đổi đều (by Vũ Thị Phương - student)
INSERT INTO questions (quiz_id, content, question_order, points, time_limit) VALUES
(15, 'Công thức tính vận tốc trong chuyển động biến đổi đều:', 1, 2.50, 30),
(15, 'Một xe tăng tốc từ 0 đến 20m/s trong 5s. Gia tốc là:', 2, 2.50, 30),
(15, 'Quãng đường trong chuyển động biến đổi đều được tính bằng:', 3, 2.50, 30);

-- =============================================
-- 10. ANSWERS (Đáp án)
-- =============================================

-- Quiz 1 - Câu 1: Phương trình x² - 5x + 6 = 0
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(1, 'x = 2 hoặc x = 3', TRUE, 1),
(1, 'x = 1 hoặc x = 6', FALSE, 2),
(1, 'x = -2 hoặc x = -3', FALSE, 3),
(1, 'Vô nghiệm', FALSE, 4);

-- Quiz 1 - Câu 2: Phương trình vô nghiệm
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(2, 'x² + x + 1 = 0', TRUE, 1),
(2, 'x² - 4x + 4 = 0', FALSE, 2),
(2, 'x² - 1 = 0', FALSE, 3),
(2, 'x² - 5x + 6 = 0', FALSE, 4);

-- Quiz 1 - Câu 3: Tổng nghiệm
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(3, '7', TRUE, 1),
(3, '10', FALSE, 2),
(3, '-7', FALSE, 3),
(3, '5', FALSE, 4);

-- Quiz 1 - Câu 4: Nghiệm kép
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(4, 'x = -1', TRUE, 1),
(4, 'x = 1', FALSE, 2),
(4, 'x = 0', FALSE, 3),
(4, 'x = 2', FALSE, 4);

-- Quiz 1 - Câu 5: Biệt thức Delta
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(5, '1', TRUE, 1),
(5, '9', FALSE, 2),
(5, '-1', FALSE, 3),
(5, '5', FALSE, 4);

-- Quiz 2 - Câu 1: Thể tích hình hộp
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(6, '60 cm³', TRUE, 1),
(6, '12 cm³', FALSE, 2),
(6, '47 cm³', FALSE, 3),
(6, '120 cm³', FALSE, 4);

-- Quiz 2 - Câu 2: Diện tích xung quanh hình trụ
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(7, '20π cm²', TRUE, 1),
(7, '10π cm²', FALSE, 2),
(7, '40π cm²', FALSE, 3),
(7, '20 cm²', FALSE, 4);

-- Quiz 2 - Câu 3: Thể tích hình cầu
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(8, '36π cm³', TRUE, 1),
(8, '12π cm³', FALSE, 2),
(8, '27π cm³', FALSE, 3),
(8, '9π cm³', FALSE, 4);

-- Quiz 2 - Câu 4: Vị trí tương đối
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(9, '3 vị trí: trùng nhau, song song, chéo nhau', TRUE, 1),
(9, '2 vị trí: song song hoặc cắt nhau', FALSE, 2),
(9, '4 vị trí', FALSE, 3),
(9, '5 vị trí', FALSE, 4);

-- Quiz 3 - Câu 1: Giới hạn
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(10, '2', TRUE, 1),
(10, '1', FALSE, 2),
(10, '∞', FALSE, 3),
(10, '0', FALSE, 4);

-- Quiz 3 - Câu 2: Hàm liên tục
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(11, 'f(x) = x²', TRUE, 1),
(11, 'f(x) = 1/x', FALSE, 2),
(11, 'f(x) = |x|/x', FALSE, 3),
(11, 'f(x) = tan(x)', FALSE, 4);

-- Quiz 3 - Câu 3: lim sin(x)/x
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(12, '1', TRUE, 1),
(12, '0', FALSE, 2),
(12, '∞', FALSE, 3),
(12, '-1', FALSE, 4);

-- Quiz 3 - Câu 4: Giới hạn vô cực
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(13, 'Giới hạn không tồn tại hữu hạn', TRUE, 1),
(13, 'Giới hạn bằng 0', FALSE, 2),
(13, 'Giới hạn bằng 1', FALSE, 3),
(13, 'Không có đáp án đúng', FALSE, 4);

-- Quiz 4 - Câu 1-5: Vật lý
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(14, 'Không đổi theo thời gian', TRUE, 1),
(14, 'Tăng dần', FALSE, 2),
(14, 'Giảm dần', FALSE, 3),
(14, 'Có thể tăng hoặc giảm', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(15, '50 km/h', TRUE, 1),
(15, '100 km/h', FALSE, 2),
(15, '200 km/h', FALSE, 3),
(15, '25 km/h', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(16, 'Thời gian', TRUE, 1),
(16, 'Gia tốc', FALSE, 2),
(16, 'Khối lượng', FALSE, 3),
(16, 'Lực', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(17, 'm/s', TRUE, 1),
(17, 'km/h', FALSE, 2),
(17, 'm/s²', FALSE, 3),
(17, 'km/s', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(18, '0', TRUE, 1),
(18, '9.8 m/s²', FALSE, 2),
(18, '1 m/s²', FALSE, 3),
(18, 'Thay đổi', FALSE, 4);

-- Quiz 5 - Định luật Ôm
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(19, 'I = U/R', TRUE, 1),
(19, 'I = U × R', FALSE, 2),
(19, 'U = I/R', FALSE, 3),
(19, 'R = U × I', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(20, 'Chiều dài, tiết diện, vật liệu', TRUE, 1),
(20, 'Chỉ phụ thuộc chiều dài', FALSE, 2),
(20, 'Nhiệt độ', FALSE, 3),
(20, 'Điện áp', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(21, '3A', TRUE, 1),
(21, '48A', FALSE, 2),
(21, '8A', FALSE, 3),
(21, '16A', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(22, 'Ω (Ohm)', TRUE, 1),
(22, 'V (Volt)', FALSE, 2),
(22, 'A (Ampe)', FALSE, 3),
(22, 'W (Watt)', FALSE, 4);

-- Quiz 6 - Present Tenses
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(23, 'I go to school.', TRUE, 1),
(23, 'I am going to school.', FALSE, 2),
(23, 'I have gone to school.', FALSE, 3),
(23, 'I went to school.', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(24, 'goes', TRUE, 1),
(24, 'go', FALSE, 2),
(24, 'going', FALSE, 3),
(24, 'gone', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(25, 'Actions happening now', TRUE, 1),
(25, 'Habits', FALSE, 2),
(25, 'Completed actions', FALSE, 3),
(25, 'Future plans', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(26, 'am', TRUE, 1),
(26, 'is', FALSE, 2),
(26, 'are', FALSE, 3),
(26, 'be', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(27, 'Present Perfect', TRUE, 1),
(27, 'Present Simple', FALSE, 2),
(27, 'Present Continuous', FALSE, 3),
(27, 'Past Simple', FALSE, 4);

-- Quiz 7 - Vocabulary
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(28, 'Adjective', TRUE, 1),
(28, 'Noun', FALSE, 2),
(28, 'Verb', FALSE, 3),
(28, 'Adverb', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(29, 'sad', TRUE, 1),
(29, 'joy', FALSE, 2),
(29, 'glad', FALSE, 3),
(29, 'smile', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(30, 'Verb', TRUE, 1),
(30, 'Noun', FALSE, 2),
(30, 'Adjective', FALSE, 3),
(30, 'Adverb', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(31, 'beautiful', TRUE, 1),
(31, 'beutiful', FALSE, 2),
(31, 'beatiful', FALSE, 3),
(31, 'beautyful', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(32, 'Comparison of adjectives', TRUE, 1),
(32, 'Tenses', FALSE, 2),
(32, 'Nouns', FALSE, 3),
(32, 'Verbs', FALSE, 4);

-- Quiz 8 - Cấu trúc rẽ nhánh
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(33, 'Thực hiện các lệnh khác nhau dựa trên điều kiện', TRUE, 1),
(33, 'Lặp lại một đoạn code', FALSE, 2),
(33, 'Khai báo biến', FALSE, 3),
(33, 'Định nghĩa hàm', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(34, 'if condition:', TRUE, 1),
(34, 'if (condition)', FALSE, 2),
(34, 'if condition then', FALSE, 3),
(34, 'IF condition:', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(35, 'True', TRUE, 1),
(35, 'False', FALSE, 2),
(35, 'Error', FALSE, 3),
(35, 'None', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(36, 'elif', TRUE, 1),
(36, 'else if', FALSE, 2),
(36, 'elseif', FALSE, 3),
(36, 'elsif', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(37, 'Không, có thể dùng dictionary hoặc if-elif-else', TRUE, 1),
(37, 'Có', FALSE, 2),
(37, 'Chỉ có trong Python 3.10+', FALSE, 3),
(37, 'Dùng từ khóa switch', FALSE, 4);

-- Quiz 9 - Array và String
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(38, 'Tập hợp các phần tử cùng kiểu dữ liệu', TRUE, 1),
(38, 'Một biến đơn', FALSE, 2),
(38, 'Một hàm', FALSE, 3),
(38, 'Một class', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(39, '0', TRUE, 1),
(39, '1', FALSE, 2),
(39, '-1', FALSE, 3),
(39, 'Tùy thuộc ngôn ngữ', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(40, 'len()', TRUE, 1),
(40, 'length()', FALSE, 2),
(40, 'size()', FALSE, 3),
(40, 'count()', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(41, 'Không, chuỗi là immutable', TRUE, 1),
(41, 'Có', FALSE, 2),
(41, 'Chỉ khi dùng list', FALSE, 3),
(41, 'Tùy version Python', FALSE, 4);

-- Quiz 10 - Luyện tập phương trình (by student Nguyễn Văn An)
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(42, 'x = 3', TRUE, 1),
(42, 'x = 2', FALSE, 2),
(42, 'x = 4', FALSE, 3),
(42, 'x = 5', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(43, 'x = 2', TRUE, 1),
(43, 'x = 0', FALSE, 2),
(43, 'x = 3', FALSE, 3),
(43, 'x = -2', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(44, '2 nghiệm', TRUE, 1),
(44, '1 nghiệm', FALSE, 2),
(44, 'Vô nghiệm', FALSE, 3),
(44, 'Vô số nghiệm', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(45, 'x = -2', TRUE, 1),
(45, 'x = 2', FALSE, 2),
(45, 'x = 0', FALSE, 3),
(45, 'x = -4', FALSE, 4);

-- Quiz 11 - Bất phương trình cơ bản (by student Trần Thị Bình)
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(46, 'x > 3', TRUE, 1),
(46, 'x < 3', FALSE, 2),
(46, 'x ≥ 3', FALSE, 3),
(46, 'x ≤ 3', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(47, 'x ≥ 5', TRUE, 1),
(47, 'x > 5', FALSE, 2),
(47, 'x ≤ 5', FALSE, 3),
(47, 'x < 5', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(48, '1 < x < 4', TRUE, 1),
(48, 'x > 4', FALSE, 2),
(48, 'x < 1', FALSE, 3),
(48, '1 ≤ x ≤ 4', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(49, 'x ≤ 2', TRUE, 1),
(49, 'x ≥ 2', FALSE, 2),
(49, 'x > 2', FALSE, 3),
(49, 'x < 2', FALSE, 4);

-- Quiz 12 - Past Tenses Practice (by student Lê Văn Cường)
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(50, 'went', TRUE, 1),
(50, 'go', FALSE, 2),
(50, 'going', FALSE, 3),
(50, 'gone', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(51, 'was studying', TRUE, 1),
(51, 'studied', FALSE, 2),
(51, 'study', FALSE, 3),
(51, 'have studied', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(52, 'had finished', TRUE, 1),
(52, 'finished', FALSE, 2),
(52, 'have finished', FALSE, 3),
(52, 'finishing', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(53, 'did not like', TRUE, 1),
(53, 'does not like', FALSE, 2),
(53, 'do not like', FALSE, 3),
(53, 'not liked', FALSE, 4);

-- Quiz 13 - Common Idioms (by student Phạm Thị Dung)
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(54, 'Very easy', TRUE, 1),
(54, 'Very difficult', FALSE, 2),
(54, 'Very expensive', FALSE, 3),
(54, 'Very sweet', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(55, 'To reveal a secret', TRUE, 1),
(55, 'To catch a cat', FALSE, 2),
(55, 'To open a bag', FALSE, 3),
(55, 'To make a mistake', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(56, 'Its raining very heavily', TRUE, 1),
(56, 'There are many pets', FALSE, 2),
(56, 'The weather is nice', FALSE, 3),
(56, 'Animals are fighting', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(57, 'To do two things at the same time', TRUE, 1),
(57, 'To kill two birds', FALSE, 2),
(57, 'To throw stones', FALSE, 3),
(57, 'To save money', FALSE, 4);

-- Quiz 14 - HTML & CSS Basics (by student Hoàng Văn Em)
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(58, 'HyperText Markup Language', TRUE, 1),
(58, 'Home Tool Markup Language', FALSE, 2),
(58, 'Hyperlinks and Text Markup Language', FALSE, 3),
(58, 'High Tech Modern Language', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(59, '<div>', TRUE, 1),
(59, '<container>', FALSE, 2),
(59, '<box>', FALSE, 3),
(59, '<section>', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(60, 'Cascading Style Sheets', TRUE, 1),
(60, 'Computer Style Sheets', FALSE, 2),
(60, 'Creative Style System', FALSE, 3),
(60, 'Colorful Style Sheets', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(61, 'color', TRUE, 1),
(61, 'text-color', FALSE, 2),
(61, 'font-color', FALSE, 3),
(61, 'text-style', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(62, '.myClass', TRUE, 1),
(62, '#myClass', FALSE, 2),
(62, 'class=myClass', FALSE, 3),
(62, '*myClass', FALSE, 4);

-- Quiz 15 - Chuyển động biến đổi đều (by student Vũ Thị Phương)
INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(63, 'v = v₀ + at', TRUE, 1),
(63, 'v = v₀ - at', FALSE, 2),
(63, 'v = at', FALSE, 3),
(63, 'v = v₀/t', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(64, '4 m/s²', TRUE, 1),
(64, '2 m/s²', FALSE, 2),
(64, '5 m/s²', FALSE, 3),
(64, '100 m/s²', FALSE, 4);

INSERT INTO answers (question_id, content, is_correct, answer_order) VALUES
(65, 's = v₀t + ½at²', TRUE, 1),
(65, 's = vt', FALSE, 2),
(65, 's = at²', FALSE, 3),
(65, 's = v₀ + at', FALSE, 4);

-- =============================================
-- 11. QUIZ ATTEMPTS (Lượt làm bài)
-- =============================================
INSERT INTO quiz_attempts (quiz_id, user_id, start_time, end_time, total_score, status, attempt_number) VALUES
-- Nguyễn Văn An (user_id = 5)
(1, 5, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '15 minutes', 8.00, 'submitted', 1),
(4, 5, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '10 minutes', 9.00, 'submitted', 1),

-- Trần Thị Bình (user_id = 6)
(1, 6, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '12 minutes', 10.00, 'submitted', 1),
(4, 6, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours' + INTERVAL '8 minutes', 8.00, 'submitted', 1),

-- Lê Văn Cường (user_id = 7)
(1, 7, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '18 minutes', 6.00, 'submitted', 1),
(6, 7, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '8 minutes', 9.00, 'submitted', 1),
(7, 7, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '5 minutes', 7.50, 'submitted', 1),

-- Phạm Thị Dung (user_id = 8)
(1, 8, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '4 hours' + INTERVAL '20 minutes', 7.00, 'submitted', 1),
(6, 8, CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '5 hours' + INTERVAL '9 minutes', 10.00, 'submitted', 1),

-- Hoàng Văn Em (user_id = 9)
(1, 9, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours' + INTERVAL '14 minutes', 9.00, 'submitted', 1),
(8, 9, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '12 minutes', 8.00, 'submitted', 1);

-- =============================================
-- 12. UPDATE TOTAL SCORES (Cập nhật tổng điểm)
-- =============================================
UPDATE quizzes SET total_score = (
  SELECT COALESCE(SUM(points), 0) FROM questions WHERE quiz_id = quizzes.quiz_id
);

-- =============================================
-- HOÀN TẤT SEED DATA
-- =============================================
-- Kiểm tra kết quả
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'Topics', COUNT(*) FROM topics
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes
UNION ALL
SELECT 'Class Members', COUNT(*) FROM class_members
UNION ALL
SELECT 'Quizzes', COUNT(*) FROM quizzes
UNION ALL
SELECT 'Questions', COUNT(*) FROM questions
UNION ALL
SELECT 'Answers', COUNT(*) FROM answers
UNION ALL
SELECT 'Quiz Attempts', COUNT(*) FROM quiz_attempts;
