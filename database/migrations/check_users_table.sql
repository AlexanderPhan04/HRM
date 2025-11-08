-- Script kiểm tra cấu trúc bảng users hiện tại

USE hrm_system;

-- Xem tất cả cột trong bảng users
DESCRIBE users;

-- Hoặc dùng SHOW COLUMNS
SHOW COLUMNS FROM users;

-- Kiểm tra các cột đã tồn tại
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    EXTRA
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm_system' 
AND TABLE_NAME = 'users'
ORDER BY ORDINAL_POSITION;
