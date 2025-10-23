<?php
// Test database schema
require_once '../app/Config/Database.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    echo "<h2>Database Schema Test</h2>";
    
    // Check departments table structure
    $stmt = $conn->query("DESCRIBE departments");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Departments Table Structure:</h3>";
    echo "<table border='1'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    foreach ($columns as $column) {
        echo "<tr>";
        echo "<td>" . $column['Field'] . "</td>";
        echo "<td>" . $column['Type'] . "</td>";
        echo "<td>" . $column['Null'] . "</td>";
        echo "<td>" . $column['Key'] . "</td>";
        echo "<td>" . $column['Default'] . "</td>";
        echo "<td>" . $column['Extra'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Check if manager_id column exists
    $managerIdExists = false;
    foreach ($columns as $column) {
        if ($column['Field'] === 'manager_id') {
            $managerIdExists = true;
            break;
        }
    }
    
    if ($managerIdExists) {
        echo "<p style='color: green;'>✓ manager_id column exists</p>";
    } else {
        echo "<p style='color: red;'>✗ manager_id column does NOT exist</p>";
    }
    
    // Test insert with manager_id
    echo "<h3>Testing Insert with manager_id:</h3>";
    $testData = [
        'id' => 'DEP007',
        'name' => 'Test Department 2',
        'description' => 'Test Description 2',
        'manager_id' => 'EMP001'
    ];
    
    $query = "INSERT INTO departments (id, name, description, manager_id) VALUES (:id, :name, :description, :manager_id)";
    $stmt = $conn->prepare($query);
    $result = $stmt->execute($testData);
    
    if ($result) {
        echo "<p style='color: green;'>✓ Insert successful</p>";
        
        // Check what was actually inserted
        $stmt = $conn->prepare("SELECT * FROM departments WHERE id = ?");
        $stmt->execute(['DEP007']);
        $inserted = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<h4>Inserted Data:</h4>";
        echo "<pre>" . print_r($inserted, true) . "</pre>";
        
        // Clean up
        $stmt = $conn->prepare("DELETE FROM departments WHERE id = ?");
        $stmt->execute(['DEP007']);
        echo "<p>Test record cleaned up</p>";
    } else {
        echo "<p style='color: red;'>✗ Insert failed</p>";
        echo "<p>Error: " . print_r($stmt->errorInfo(), true) . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}
?>
