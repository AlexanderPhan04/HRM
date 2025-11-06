<?php

/**
 * index.php - Entry Point cho HRM System
 * Mô hình MVC - Front Controller Pattern
 */

// Định nghĩa các đường dẫn root
define('ROOT_PATH', __DIR__); // HRM/
define('APP_PATH', ROOT_PATH . '/app');
define('CONFIG_PATH', APP_PATH . '/Config');
define('VIEW_PATH', APP_PATH . '/Views');

// Bật báo lỗi trong môi trường development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: text/html; charset=utf-8');

// Nếu request là cho SPA (Single Page Application), serve index.html
if (!isset($_GET['route']) || $_GET['route'] === '') {
    // Load view chính
    require_once PUBLIC_PATH . '/index.html';
    exit;
}

// Nếu có route khác, xử lý routing (có thể mở rộng sau)
// Hiện tại API được xử lý riêng qua api.php
