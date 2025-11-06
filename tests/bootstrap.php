<?php

/**
 * PHPUnit Bootstrap File
 */

// Define constants
define('BASE_PATH', dirname(__DIR__));
define('APP_PATH', BASE_PATH . '/app');
define('CONFIG_PATH', APP_PATH . '/Config');
define('CONTROLLER_PATH', APP_PATH . '/Controllers');
define('MODEL_PATH', APP_PATH . '/Models');

// Autoload Composer dependencies
if (file_exists(BASE_PATH . '/vendor/autoload.php')) {
    require_once BASE_PATH . '/vendor/autoload.php';
}

// Load test configuration
if (file_exists(__DIR__ . '/test_config.php')) {
    require_once __DIR__ . '/test_config.php';
}

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Set timezone
date_default_timezone_set('Asia/Ho_Chi_Minh');

echo "PHPUnit Bootstrap Complete\n";
