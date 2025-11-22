INSERT INTO answers (question_id, content, is_correct, answer_order)
VALUES
-- Câu 1: 2x + 3 = 7 => x = 2
(1, 'x = 2', TRUE, 1),
(1, 'x = 3', FALSE, 2),
(1, 'x = 4', FALSE, 3),
(1, 'x = 1', FALSE, 4),

-- Câu 2: (5+3)*2 = 16
(2, '16', TRUE, 1),
(2, '10', FALSE, 2),
(2, '20', FALSE, 3),
(2, '8', FALSE, 4),

-- Câu 3: F = ma => a = 10/2 = 5 m/s^2
(3, '5 m/s^2', TRUE, 1),
(3, '2 m/s^2', FALSE, 2),
(3, '10 m/s^2', FALSE, 3),
(3, '0.5 m/s^2', FALSE, 4),

-- Câu 4: Định luật II Newton
(4, 'F = m * a', TRUE, 1),
(4, 'Mọi vật duy trì trạng thái chuyển động thẳng đều', FALSE, 2),
(4, 'Mọi vật có khối lượng đều hút nhau', FALSE, 3),
(4, 'Năng lượng không tự sinh ra hay mất đi', FALSE, 4);
