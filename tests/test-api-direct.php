<?php
/**
 * test-api-direct.php - Test API trực tiếp
 */

echo "<h2>🔧 Direct API Test</h2>";

// Test 1: Include api.php
echo "<h3>📡 Testing API directly:</h3>";

try {
    // Simulate API request
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['REQUEST_URI'] = '/api/employees';
    
    // Capture output
    ob_start();
    include 'api.php';
    $output = ob_get_clean();
    
    echo "<p>API Output:</p>";
    echo "<pre>" . htmlspecialchars($output) . "</pre>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ API Error: " . $e->getMessage() . "</p>";
}

// Test 2: Check .htaccess
echo "<h3>📁 File Check:</h3>";
echo "<p>.htaccess exists: " . (file_exists('.htaccess') ? '✅ Yes' : '❌ No') . "</p>";
echo "<p>api.php exists: " . (file_exists('api.php') ? '✅ Yes' : '❌ No') . "</p>";

// Test 3: Check mod_rewrite
echo "<h3>🔧 Server Check:</h3>";
echo "<p>mod_rewrite enabled: " . (function_exists('apache_get_modules') && in_array('mod_rewrite', apache_get_modules()) ? '✅ Yes' : '❓ Unknown') . "</p>";

// Test 4: Direct controller test
echo "<h3>🏗️ Direct Controller Test:</h3>";

try {
    require_once 'app/Config/Database.php';
    require_once 'app/Controllers/EmployeeController.php';
    
    $controller = new EmployeeController();
    $result = $controller->getAll();
    
    echo "<p style='color: green;'>✅ Controller works directly!</p>";
    echo "<pre>" . json_encode($result, JSON_PRETTY_PRINT) . "</pre>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Controller Error: " . $e->getMessage() . "</p>";
}
?>
