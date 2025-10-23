@echo off
REM setup-database-laragon.bat - Setup database cho Laragon (MVC Structure)
REM Chạy file này để tự động tạo database

echo ====================================
echo   HRM System - Laragon Database Setup
echo   MVC Structure
echo ====================================
echo.

echo [1/3] Đang tạo database...
echo CREATE DATABASE IF NOT EXISTS hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; USE hrm_system; | C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -u root

echo [2/3] Đang import tables và data...
C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -u root hrm_system < C:\laragon\www\HRM\database\migrations\001_initial_schema.sql

echo [3/3] Kiểm tra...
echo SHOW TABLES; | C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -u root hrm_system

echo.
echo ====================================
echo   Setup hoàn tất!
echo ====================================
echo.
echo Mở browser để test:
echo   http://localhost/HRM/public/
echo   hoặc http://hrm.test/public/
echo.
echo Test connection:
echo   http://localhost/HRM/tests/test-connection.php
echo.
echo Default login:
echo   Username: admin
echo   Password: admin123
echo.
pause
