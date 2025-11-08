-- Migration: Thêm email verification (MANUAL - Chạy từng lệnh)
-- Chạy file này trong phpMyAdmin hoặc MySQL Workbench
-- Copy từng lệnh ALTER TABLE một và Execute

USE hrm_system;

-- BƯỚC 1: Kiểm tra cấu trúc hiện tại
-- DESCRIBE users;

-- BƯỚC 2: Chỉ chạy những lệnh ADD COLUMN mà cột CHƯA tồn tại
-- Nếu báo lỗi "Duplicate column", bỏ qua và chạy lệnh tiếp theo

-- Lệnh 1: Thêm email
ALTER TABLE users ADD COLUMN email VARCHAR(255) DEFAULT NULL AFTER fullname;

-- Lệnh 2: Thêm email_verified  
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email;

-- Lệnh 3: Thêm verification_token
ALTER TABLE users ADD COLUMN verification_token VARCHAR(64) DEFAULT NULL AFTER email_verified;

-- Lệnh 4: Thêm token_expires_at
ALTER TABLE users ADD COLUMN token_expires_at DATETIME DEFAULT NULL AFTER verification_token;

-- Lệnh 5: Thêm created_at (NẾU CHƯA CÓ - bỏ qua nếu báo lỗi)
-- ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER token_expires_at;

-- Lệnh 6: Thêm updated_at (NẾU CHƯA CÓ - bỏ qua nếu báo lỗi)
-- ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- BƯỚC 3: Tạo indexes
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_verification_token ON users(verification_token);

-- BƯỚC 4: Cập nhật admin user
UPDATE users 
SET email = 'admin@hrm.com', 
    email_verified = TRUE
WHERE username = 'admin';

-- BƯỚC 5: Kiểm tra kết quả
-- DESCRIBE users;
-- SELECT * FROM users;
