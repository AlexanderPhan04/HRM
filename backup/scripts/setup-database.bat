@echo off
REM setup-database.bat - Script tự động tạo database và import dữ liệu
REM Chạy file này để setup database một cách nhanh chóng

echo ====================================
echo   HRM System - Database Setup
echo ====================================
echo.

REM Kiểm tra MySQL có chạy không
echo [1/4] Checking MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MySQL not found! Please install MySQL or XAMPP first.
    pause
    exit /b 1
)
echo [OK] MySQL found!
echo.

REM Tạo database
echo [2/4] Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo [ERROR] Failed to create database!
    pause
    exit /b 1
)
echo [OK] Database 'hrm_system' created!
echo.

REM Import schema và data
echo [3/4] Importing tables and data...
mysql -u root -p hrm_system < init.sql
if errorlevel 1 (
    echo [ERROR] Failed to import data!
    pause
    exit /b 1
)
echo [OK] Tables and sample data imported!
echo.

REM Verify
echo [4/4] Verifying installation...
mysql -u root -p hrm_system -e "SHOW TABLES;"
echo.

echo ====================================
echo   Setup completed successfully!
echo ====================================
echo.
echo Default credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Next steps:
echo   1. Start PHP server: php -S localhost:8000
echo   2. Open browser: http://localhost:8000/test-connection.php
echo   3. Test API: http://localhost:8000/api.php/employees
echo.
pause
