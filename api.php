<?php

/**
 * api.php - Main API router (MVC Structure)
 * Xử lý tất cả API requests và route đến controller tương ứng
 */

// Enable error reporting cho development (tắt trong production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Định nghĩa đường dẫn root - SỬA CHO HOSTING
define('ROOT_PATH', __DIR__); // Trên hosting: public_html/
define('APP_PATH', ROOT_PATH . '/app');
define('CONFIG_PATH', APP_PATH . '/Config');
define('CONTROLLER_PATH', APP_PATH . '/Controllers');
define('MODEL_PATH', APP_PATH . '/Models');

// Set headers cho CORS và JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start session
session_start();

// SPL Autoload - Tự động load class khi cần thiết
spl_autoload_register(function ($class) {
    // Tìm file trong các thư mục chính
    $candidates = [
        CONTROLLER_PATH . '/' . $class . '.php',
        MODEL_PATH . '/' . $class . '.php',
        CONFIG_PATH . '/' . $class . '.php',
    ];

    foreach ($candidates as $file) {
        if (is_file($file)) {
            require_once $file;
            return;
        }
    }
});

// Get request method và URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Remove query string từ URI
$uri = strtok($uri, '?');

// Remove script name từ URI để lấy path
// Ví dụ: /HRM/public/api.php/auth/check -> auth/check
$scriptName = $_SERVER['SCRIPT_NAME']; // /HRM/public/api.php
$path = str_replace($scriptName, '', $uri);
$path = trim($path, '/');

// Nếu path rỗng, kiểm tra PATH_INFO
if (empty($path) && isset($_SERVER['PATH_INFO'])) {
    $path = trim($_SERVER['PATH_INFO'], '/');
}

// Nếu vẫn rỗng, kiểm tra endpoint parameter từ .htaccess
if (empty($path) && isset($_GET['endpoint'])) {
    $path = $_GET['endpoint'];
}

// Split path thành segments
$segments = explode('/', $path);

// Debug (tắt sau khi test xong)
// error_log("DEBUG API - URI: " . $uri);
// error_log("DEBUG API - SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME']);
// error_log("DEBUG API - PATH: " . $path);
// error_log("DEBUG API - SEGMENTS: " . print_r($segments, true));

// Response helper function
function sendError($message, $code = 404)
{
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Route theo segments[0] (resource type)
    $resource = $segments[0] ?? '';
    $id = $segments[1] ?? null;
    $action = $segments[2] ?? null;

    // ============================================
    // AUTH ROUTES
    // ============================================
    if ($resource === 'auth') {
        $controller = new AuthController();

        if ($id === 'login' && $method === 'POST') {
            $controller->login();
        } elseif ($id === 'register' && $method === 'POST') {
            $controller->register();
        } elseif ($id === 'verify' && $action && $method === 'GET') {
            // GET /api/auth/verify/:token
            $controller->verifyEmail($action);
        } elseif ($id === 'logout' && $method === 'POST') {
            $controller->logout();
        } elseif ($id === 'check' && $method === 'GET') {
            $controller->checkSession();
        } else {
            sendError('Auth endpoint not found');
        }
    }

    // ============================================
    // EMPLOYEE ROUTES
    // ============================================
    elseif ($resource === 'employees') {
        $controller = new EmployeeController();

        if ($method === 'GET' && !$id) {
            // GET /api/employees
            $controller->index();
        } elseif ($method === 'GET' && $id === 'total-salary') {
            // GET /api/employees/total-salary
            $controller->getTotalSalary();
        } elseif ($method === 'GET' && $id === 'department' && $action) {
            // GET /api/employees/department/:id
            $controller->getByDepartment($action);
        } elseif ($method === 'GET' && $id) {
            // GET /api/employees/:id
            $controller->show($id);
        } elseif ($method === 'POST' && $id === 'search') {
            // POST /api/employees/search
            $controller->search();
        } elseif ($method === 'POST' && !$id) {
            // POST /api/employees
            $controller->create();
        } elseif ($method === 'PUT' && $id) {
            // PUT /api/employees/:id
            $controller->update($id);
        } elseif ($method === 'DELETE' && $id) {
            // DELETE /api/employees/:id
            $controller->delete($id);
        } else {
            sendError('Employee endpoint not found');
        }
    }

    // ============================================
    // DEPARTMENT ROUTES
    // ============================================
    elseif ($resource === 'departments') {
        $controller = new DepartmentController();

        if ($method === 'GET' && !$id) {
            $controller->index();
        } elseif ($method === 'GET' && $id) {
            $controller->show($id);
        } elseif ($method === 'POST') {
            $controller->create();
        } elseif ($method === 'PUT' && $id) {
            $controller->update($id);
        } elseif ($method === 'DELETE' && $id) {
            $controller->delete($id);
        } else {
            sendError('Department endpoint not found');
        }
    }

    // ============================================
    // POSITION ROUTES
    // ============================================
    elseif ($resource === 'positions') {
        $controller = new PositionController();

        if ($method === 'GET' && !$id) {
            $controller->index();
        } elseif ($method === 'GET' && $id) {
            $controller->show($id);
        } elseif ($method === 'POST') {
            $controller->create();
        } elseif ($method === 'PUT' && $id) {
            $controller->update($id);
        } elseif ($method === 'DELETE' && $id) {
            $controller->delete($id);
        } else {
            sendError('Position endpoint not found');
        }
    }

    // ============================================
    // ATTENDANCE ROUTES
    // ============================================
    elseif ($resource === 'attendance') {
        $controller = new AttendanceController();

        if ($method === 'GET' && $id === 'report') {
            // GET /api/attendance/report
            $controller->getReport();
        } elseif ($method === 'GET' && $id === 'total-hours') {
            // GET /api/attendance/total-hours
            $controller->getTotalHours();
        } elseif ($method === 'GET' && !$id) {
            // GET /api/attendance
            $controller->index();
        } elseif ($method === 'POST' && $id === 'check-in') {
            // POST /api/attendance/check-in
            $controller->checkIn();
        } elseif ($method === 'POST' && $id === 'check-out') {
            // POST /api/attendance/check-out
            $controller->checkOut();
        } elseif ($method === 'POST' && !$id) {
            // POST /api/attendance
            $controller->create();
        } else {
            sendError('Attendance endpoint not found');
        }
    }

    // ============================================
    // LEAVE ROUTES
    // ============================================
    elseif ($resource === 'leaves') {
        $controller = new LeaveController();

        if ($method === 'GET' && $id === 'balance') {
            // GET /api/leaves/balance
            $controller->getBalance();
        } elseif ($method === 'GET' && !$id) {
            // GET /api/leaves
            $controller->index();
        } elseif ($method === 'GET' && $id) {
            // GET /api/leaves/:id
            $controller->show($id);
        } elseif ($method === 'POST' && !$id) {
            // POST /api/leaves
            $controller->create();
        } elseif ($method === 'PUT' && $id && $action === 'status') {
            // PUT /api/leaves/:id/status
            $controller->updateStatus($id);
        } elseif ($method === 'DELETE' && $id) {
            // DELETE /api/leaves/:id
            $controller->delete($id);
        } else {
            sendError('Leave endpoint not found');
        }
    }

    // ============================================
    // PERFORMANCE ROUTES
    // ============================================
    elseif ($resource === 'performance') {
        $controller = new PerformanceController();

        if ($method === 'GET' && $id === 'top') {
            // GET /api/performance/top
            $controller->getTopPerformers();
        } elseif ($method === 'GET' && $id === 'employee' && $action) {
            // GET /api/performance/employee/:id
            $controller->getByEmployee($action);
        } elseif ($method === 'GET' && $id === 'average' && $action) {
            // GET /api/performance/average/:id
            $controller->getAverageRating($action);
        } elseif ($method === 'GET' && !$id) {
            // GET /api/performance
            $controller->index();
        } elseif ($method === 'POST' && !$id) {
            // POST /api/performance
            $controller->create();
        } elseif ($method === 'DELETE' && $id) {
            // DELETE /api/performance/:id
            $controller->delete($id);
        } else {
            sendError('Performance endpoint not found');
        }
    }

    // ============================================
    // KHÔNG TÌM THẤY ROUTE
    // ============================================
    else {
        sendError('API endpoint not found: ' . $path, 404);
    }
} catch (Exception $e) {
    // Catch tất cả errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage(),
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
}
