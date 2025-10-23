<?php

/**
 * Generate password hash cho admin123
 */

$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: $password\n";
echo "Hash: $hash\n\n";

// Test verify
$verify = password_verify($password, $hash);
echo "Verify test: " . ($verify ? 'OK' : 'FAILED') . "\n\n";

// Test với hash cũ trong database
$old_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
$verify_old = password_verify($password, $old_hash);
echo "Verify với hash cũ: " . ($verify_old ? 'OK' : 'FAILED') . "\n";

// SQL command để update
echo "\n--- SQL để update password ---\n";
echo "UPDATE users SET password = '$hash' WHERE username = 'admin';\n";
