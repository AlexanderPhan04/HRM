<?php
/**
 * api-test.php - Test API endpoints
 */

header('Content-Type: application/json');

echo "<h2>🔧 API Test</h2>";

// Test 1: Basic PHP
echo "<p>✅ PHP is working</p>";

// Test 2: Database connection
try {
    require_once __DIR__ . '/../app/Config/Database.php';
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "<p>✅ Database connection successful</p>";
        
        // Test 3: API endpoint
        echo "<h3>📡 Testing API endpoints:</h3>";
        
        // Test employees endpoint
        $stmt = $conn->query("SELECT COUNT(*) as total FROM users");
        $result = $stmt->fetch();
        echo "<p>✅ Users table: " . $result['total'] . " records</p>";
        
        // Test departments endpoint  
        $stmt = $conn->query("SELECT COUNT(*) as total FROM departments");
        $result = $stmt->fetch();
        echo "<p>✅ Departments table: " . $result['total'] . " records</p>";
        
        // Test positions endpoint
        $stmt = $conn->query("SELECT COUNT(*) as total FROM positions");
        $result = $stmt->fetch();
        echo "<p>✅ Positions table: " . $result['total'] . " records</p>";
        
    } else {
        echo "<p>❌ Database connection failed</p>";
    }
    
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<h3>🌐 Test API URLs:</h3>";
echo "<p><a href='api.php/employees' target='_blank'>Test: /api/employees</a></p>";
echo "<p><a href='api.php/departments' target='_blank'>Test: /api/departments</a></p>";
echo "<p><a href='api.php/positions' target='_blank'>Test: /api/positions</a></p>";
?>
