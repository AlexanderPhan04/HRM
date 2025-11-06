<?php
/**
 * simple-test.php - Test cơ bản PHP và database
 */

echo "<h2>🔧 PHP Test</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";

echo "<h2>🗄️ Database Test</h2>";

try {
    // Test kết nối database trực tiếp
    $host = "localhost";
    $dbname = "qeuvbmow_hrm_system";
    $username = "qeuvbmow_hrm_system";
    $password = "ZdvtMh4aYDnvPbu8N4WU";
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    
    echo "<p style='color: green;'>✅ Database connection SUCCESS!</p>";
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
    $result = $stmt->fetch();
    echo "<p>Total users: " . $result['total'] . "</p>";
    
    // Test tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Tables: " . implode(', ', $tables) . "</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database Error: " . $e->getMessage() . "</p>";
}

echo "<h2>📁 File Test</h2>";
echo "<p>Current directory: " . getcwd() . "</p>";
echo "<p>Files in directory:</p>";
echo "<ul>";
$files = scandir('.');
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        echo "<li>" . $file . "</li>";
    }
}
echo "</ul>";
?>
