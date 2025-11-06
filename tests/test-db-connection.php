<?php
/**
 * test-db-connection.php - Test database connection
 * File này để test kết nối database trên hosting
 */

// Include database config
require_once '../app/Config/Database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "<h2>✅ Database Connection SUCCESS!</h2>";
        echo "<p>Connected to database successfully.</p>";
        
        // Test query
        $stmt = $conn->query("SELECT COUNT(*) as total FROM users");
        $result = $stmt->fetch();
        echo "<p>Total users in database: " . $result['total'] . "</p>";
        
        // Test tables
        $stmt = $conn->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "<h3>Tables in database:</h3>";
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li>" . $table . "</li>";
        }
        echo "</ul>";
        
    } else {
        echo "<h2>❌ Database Connection FAILED!</h2>";
        echo "<p>Could not connect to database.</p>";
    }
    
} catch (Exception $e) {
    echo "<h2>❌ Database Error!</h2>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
}
?>
