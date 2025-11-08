-- Migration: Thêm email verification cho users table
-- File: 002_add_email_verification.sql

USE hrm_system;

-- Thêm cột email
ALTER TABLE users ADD COLUMN email VARCHAR(255) DEFAULT NULL AFTER fullname;

-- Thêm cột email_verified
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email;

-- Thêm cột verification_token
ALTER TABLE users ADD COLUMN verification_token VARCHAR(64) DEFAULT NULL AFTER email_verified;

-- Thêm cột token_expires_at
ALTER TABLE users ADD COLUMN token_expires_at DATETIME DEFAULT NULL AFTER verification_token;

-- NOTE: Bỏ qua created_at và updated_at vì đã có sẵn trong bảng users

-- Tạo index cho email
CREATE INDEX idx_email ON users(email);

-- Tạo index cho verification_token
CREATE INDEX idx_verification_token ON users(verification_token);

-- Cập nhật user admin hiện tại (nếu chưa có email)
UPDATE users 
SET email = 'admin@hrm.com', 
    email_verified = TRUE
WHERE username = 'admin';

-- Hiển thị kết quả
SELECT 'Email verification columns added successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
DESCRIBE users;

