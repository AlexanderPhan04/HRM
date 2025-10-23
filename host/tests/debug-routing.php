<?php
/**
 * debug-routing.php - Debug API routing chi tiết
 */

echo "<h2>🔧 API Routing Debug</h2>";

// Test 1: Server variables
echo "<h3>📋 Server Variables:</h3>";
echo "<p>REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "</p>";
echo "<p>SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? 'N/A') . "</p>";
echo "<p>PATH_INFO: " . ($_SERVER['PATH_INFO'] ?? 'N/A') . "</p>";
echo "<p>QUERY_STRING: " . ($_SERVER['QUERY_STRING'] ?? 'N/A') . "</p>";
echo "<p>GET endpoint: " . ($_GET['endpoint'] ?? 'N/A') . "</p>";

// Test 2: Path calculation
echo "<h3>📁 Path Calculation:</h3>";
$uri = $_SERVER['REQUEST_URI'] ?? '';
$uri = strtok($uri, '?');
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
$path = str_replace($scriptName, '', $uri);
$path = trim($path, '/');

echo "<p>URI: $uri</p>";
echo "<p>Script Name: $scriptName</p>";
echo "<p>Calculated Path: '$path'</p>";

// Test 3: Simulate API call
echo "<h3>📡 Simulate API Call:</h3>";

try {
    // Set up environment
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_GET['endpoint'] = 'employees';
    
    // Include api.php
    ob_start();
    include 'api.php';
    $output = ob_get_clean();
    
    echo "<p>API Output:</p>";
    echo "<pre>" . htmlspecialchars($output) . "</pre>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ API Error: " . $e->getMessage() . "</p>";
}

// Test 4: Direct controller test
echo "<h3>🏗️ Direct Controller Test:</h3>";

try {
    require_once 'app/Config/Database.php';
    require_once 'app/Controllers/EmployeeController.php';
    
    $controller = new EmployeeController();
    $result = $controller->getAll();
    
    echo "<p style='color: green;'>✅ Controller works!</p>";
    echo "<pre>" . json_encode($result, JSON_PRETTY_PRINT) . "</pre>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Controller Error: " . $e->getMessage() . "</p>";
}

// Test 5: Check file structure
echo "<h3>📁 File Structure:</h3>";
echo "<p>app/Config/Database.php: " . (file_exists('app/Config/Database.php') ? '✅' : '❌') . "</p>";
echo "<p>app/Controllers/EmployeeController.php: " . (file_exists('app/Controllers/EmployeeController.php') ? '✅' : '❌') . "</p>";
echo "<p>app/Models/EmployeeModel.php: " . (file_exists('app/Models/EmployeeModel.php') ? '✅' : '❌') . "</p>";
?>