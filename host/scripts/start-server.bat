@echo off
REM start-server.bat - Script khởi động PHP development server
REM Chạy file này để start backend server

echo ====================================
echo   HRM System - Starting Server
echo ====================================
echo.

REM Kiểm tra PHP
echo Checking PHP installation...
php --version
if errorlevel 1 (
    echo [ERROR] PHP not found!
    pause
    exit /b 1
)
echo.

REM Kiểm tra database đã setup chưa
echo Checking database...
mysql -u root -p hrm_system -e "SELECT COUNT(*) FROM employees;" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Database not found or not setup!
    echo Please run setup-database.bat first.
    echo.
    choice /C YN /M "Do you want to continue anyway?"
    if errorlevel 2 exit /b 0
)
echo.

echo Starting PHP development server...
echo Server URL: http://localhost:8000
echo Test page: http://localhost:8000/test-connection.php
echo API endpoint: http://localhost:8000/api.php
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start server
php -S localhost:8000

pause
