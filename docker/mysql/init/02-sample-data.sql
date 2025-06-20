-- Sample data for testing
USE account_calendar;

-- Insert sample user
INSERT INTO user (email, password, target_expense, created_date) VALUES
('test@example.com', '$2b$10$example.hash.password', 500000, CURRENT_DATE);

-- Insert sample major categories
INSERT INTO major_category (user_id, label, emoji, type, created_date) VALUES
(1, '식비', '🍽️', 2), -- 지출
(1, '교통비', '🚗', 2), -- 지출
(1, '월급', '💰', 1), -- 수입
(1, '용돈', '💵', 1); -- 수입

-- Insert sample middle categories
INSERT INTO middle_category (user_id, major_category_id, label, emoji, type, created_date) VALUES
(1, 1, '점심', '🍱', 2), -- 식비 > 점심
(1, 1, '저녁', '🍜', 2), -- 식비 > 저녁
(1, 1, '간식', '🍪', 2), -- 식비 > 간식
(1, 2, '버스', '🚌', 2), -- 교통비 > 버스
(1, 2, '지하철', '🚇', 2), -- 교통비 > 지하철
(1, 3, '기본급', '💼', 1), -- 월급 > 기본급
(1, 4, '용돈', '💵', 1); -- 용돈 > 용돈

-- Insert sample transactions
INSERT INTO transaction (user_id, middle_category_id, major_category_id, price, type, registration_date, memo, created_date) VALUES
(1, 1, 1, 12000, 2, CURRENT_DATE, '점심 식사', CURRENT_DATE),
(1, 2, 1, 15000, 2, CURRENT_DATE, '저녁 식사', CURRENT_DATE),
(1, 4, 2, 1300, 2, CURRENT_DATE, '버스 요금', CURRENT_DATE),
(1, 6, 3, 3000000, 1, CURRENT_DATE, '월급 입금', CURRENT_DATE),
(1, 7, 4, 50000, 1, CURRENT_DATE, '용돈', CURRENT_DATE); 