<?php
/**
 * db-debug.php - Debug database connection chi tiết
 */

echo "<h2>🔧 Database Debug</h2>";

// Test 1: PHP Info
echo "<h3>📋 PHP Info:</h3>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>PDO Available: " . (extension_loaded('pdo') ? '✅ Yes' : '❌ No') . "</p>";
echo "<p>PDO MySQL Available: " . (extension_loaded('pdo_mysql') ? '✅ Yes' : '❌ No') . "</p>";

// Test 2: File paths
echo "<h3>📁 File Paths:</h3>";
echo "<p>Current directory: " . getcwd() . "</p>";
echo "<p>Database.php exists: " . (file_exists('app/Config/Database.php') ? '✅ Yes' : '❌ No') . "</p>";
echo "<p>Database.php path: " . realpath('app/Config/Database.php') . "</p>";

// Test 3: Database connection
echo "<h3>🗄️ Database Connection:</h3>";

try {
    // Test direct connection first
    $host = "localhost";
    $dbname = "qeuvbmow_hrm_system";
    $username = "qeuvbmow_hrm_system";
    $password = "ZdvtMh4aYDnvPbu8N4WU";
    
    echo "<p>Testing connection to: $host</p>";
    echo "<p>Database: $dbname</p>";
    echo "<p>Username: $username</p>";
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    
    echo "<p style='color: green;'>✅ Direct PDO connection SUCCESS!</p>";
    
    // Test tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Tables found: " . count($tables) . "</p>";
    echo "<p>Table list: " . implode(', ', $tables) . "</p>";
    
    // Test data
    if (in_array('users', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $result = $stmt->fetch();
        echo "<p>Users count: " . $result['total'] . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database Error: " . $e->getMessage() . "</p>";
    echo "<p>Error Code: " . $e->getCode() . "</p>";
}

// Test 4: Database class
echo "<h3>🏗️ Database Class Test:</h3>";

try {
    require_once 'app/Config/Database.php';
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "<p style='color: green;'>✅ Database class connection SUCCESS!</p>";
    } else {
        echo "<p style='color: red;'>❌ Database class connection FAILED!</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database class error: " . $e->getMessage() . "</p>";
}

echo "<h3>🌐 Test API:</h3>";
echo "<p><a href='api.php/employees' target='_blank'>Test: /api/employees</a></p>";
echo "<p><a href='api.php/departments' target='_blank'>Test: /api/departments</a></p>";
?>
