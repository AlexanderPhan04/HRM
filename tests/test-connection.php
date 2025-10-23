<?php

/**
 * test-connection.php - Test database connection và basic functionality (MVC Structure)
 */

// Định nghĩa đường dẫn
define('ROOT_PATH', dirname(__DIR__));
define('CONFIG_PATH', ROOT_PATH . '/app/Config');

require_once CONFIG_PATH . '/Database.php';

echo "<!DOCTYPE html>
<html>
<head>
    <title>HRM Backend Test - MVC Structure</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
        pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>HRM System Backend - Connection Test</h1>";

// Test 1: Database Connection
echo "<div class='section'>";
echo "<h2>Test 1: Database Connection</h2>";
try {
    $db = new Database();
    $conn = $db->getConnection();

    if ($conn) {
        echo "<p class='success'>✓ Database connection successful!</p>";
        echo "<p>Database: hrm_system</p>";
    } else {
        echo "<p class='error'>✗ Database connection failed!</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Error: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Test 2: Check Tables
echo "<div class='section'>";
echo "<h2>Test 2: Check Database Tables</h2>";
try {
    if ($conn) {
        $query = "SHOW TABLES";
        $stmt = $conn->query($query);
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (count($tables) > 0) {
            echo "<p class='success'>✓ Found " . count($tables) . " tables:</p>";
            echo "<ul>";
            foreach ($tables as $table) {
                echo "<li>$table</li>";
            }
            echo "</ul>";
        } else {
            echo "<p class='error'>✗ No tables found. Please run init.sql first!</p>";
        }
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Error: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Test 3: Count Records
echo "<div class='section'>";
echo "<h2>Test 3: Count Records in Tables</h2>";
try {
    if ($conn) {
        $tables = ['users', 'employees', 'departments', 'positions', 'attendance', 'leaves', 'performance_reviews'];

        foreach ($tables as $table) {
            $query = "SELECT COUNT(*) as count FROM $table";
            $stmt = $conn->query($query);
            $result = $stmt->fetch();

            $count = $result['count'];
            $status = $count > 0 ? 'success' : 'error';
            echo "<p class='$status'>Table '$table': $count records</p>";
        }
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Error: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Test 4: Sample User Data
echo "<div class='section'>";
echo "<h2>Test 4: Sample Users</h2>";
try {
    if ($conn) {
        $query = "SELECT id, username, fullname, role FROM users";
        $stmt = $conn->query($query);
        $users = $stmt->fetchAll();

        if (count($users) > 0) {
            echo "<p class='success'>✓ Found " . count($users) . " users:</p>";
            echo "<pre>" . json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
            echo "<p><strong>Default credentials:</strong></p>";
            echo "<ul>";
            echo "<li>Username: admin, Password: admin123 (Role: admin)</li>";
            echo "<li>Username: hr_manager, Password: admin123 (Role: hr_manager)</li>";
            echo "</ul>";
        } else {
            echo "<p class='error'>✗ No users found!</p>";
        }
    }
} catch (Exception $e) {
    echo "<p class='error'>✗ Error: " . $e->getMessage() . "</p>";
}
echo "</div>";

// Test 5: API Endpoint Info
echo "<div class='section'>";
echo "<h2>Test 5: API Endpoint Information</h2>";
echo "<p>API Base URL: <code>" . "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/api.php" . "</code></p>";
echo "<p><strong>Test API with cURL:</strong></p>";
echo "<pre>curl http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/api.php/auth/login \\
  -X POST \\
  -H 'Content-Type: application/json' \\
  -d '{\"username\":\"admin\",\"password\":\"admin123\"}'</pre>";
echo "</div>";

// Test 6: PHP Info
echo "<div class='section'>";
echo "<h2>Test 6: PHP Environment</h2>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>PDO Available:</strong> " . (extension_loaded('pdo') ? '✓ Yes' : '✗ No') . "</p>";
echo "<p><strong>PDO MySQL Available:</strong> " . (extension_loaded('pdo_mysql') ? '✓ Yes' : '✗ No') . "</p>";
echo "<p><strong>Session Support:</strong> " . (function_exists('session_start') ? '✓ Yes' : '✗ No') . "</p>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>Next Steps</h2>";
echo "<ol>";
echo "<li>If all tests passed, your backend is ready!</li>";
echo "<li>Test API endpoints using cURL or Postman</li>";
echo "<li>Check <a href='README.md'>README.md</a> for API documentation</li>";
echo "<li>Update frontend JavaScript modules to use fetch() with these APIs</li>";
echo "</ol>";
echo "</div>";

echo "</body></html>";
