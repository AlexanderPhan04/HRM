-- Migration: Thêm email verification cho users table (SAFE VERSION)
-- File: 002_add_email_verification_safe.sql
-- Kiểm tra và chỉ thêm cột nếu chưa tồn tại

USE hrm_system;

-- Kiểm tra cấu trúc hiện tại
SELECT 'Checking current users table structure...' as status;
DESCRIBE users;

-- Thêm cột email (nếu chưa có)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'email';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN email VARCHAR(255) DEFAULT NULL AFTER fullname', 
    'SELECT "Column email already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm cột email_verified (nếu chưa có)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'email_verified';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email', 
    'SELECT "Column email_verified already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm cột verification_token (nếu chưa có)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'verification_token';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN verification_token VARCHAR(64) DEFAULT NULL AFTER email_verified', 
    'SELECT "Column verification_token already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm cột token_expires_at (nếu chưa có)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'token_expires_at';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN token_expires_at DATETIME DEFAULT NULL AFTER verification_token', 
    'SELECT "Column token_expires_at already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm cột created_at (nếu chưa có)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'created_at';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER token_expires_at', 
    'SELECT "Column created_at already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm cột updated_at (nếu chưa có)
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'updated_at';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at', 
    'SELECT "Column updated_at already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Tạo index cho email (nếu chưa có)
SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND INDEX_NAME = 'idx_email';

SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_email ON users(email)', 
    'SELECT "Index idx_email already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Tạo index cho verification_token (nếu chưa có)
SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users' 
AND INDEX_NAME = 'idx_verification_token';

SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_verification_token ON users(verification_token)', 
    'SELECT "Index idx_verification_token already exists" as status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cập nhật user admin (nếu chưa có email)
UPDATE users 
SET email = 'admin@hrm.com', 
    email_verified = TRUE,
    updated_at = NOW()
WHERE username = 'admin' 
AND (email IS NULL OR email = '');

-- Hiển thị kết quả cuối cùng
SELECT 'Migration completed successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
DESCRIBE users;
