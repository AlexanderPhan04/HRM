<?php

/**
 * Config.php - Cấu hình kết nối MySQL bằng PDO
 * Sử dụng OOP để tạo singleton connection
 */

class Database
{
    // Thông tin kết nối database - CẬP NHẬT CHO HOSTING
    // private $host = "localhost"; // Thường là localhost trên shared hosting
    // private $db_name = "qeuvbmow_hrm_system"; // Tên database trên hosting
    // private $username = "qeuvbmow_hrm_system"; // Username từ hosting
    // private $password = "ZdvtMh4aYDnvPbu8N4WU"; // Password từ hosting
    // private $conn = null;

        // Thông tin kết nối database - CẬP NHẬT CHO Localhost
    private $host = "localhost"; // Thường là localhost trên shared hosting
    private $db_name = "hrm_system"; // Tên database trên hosting
    private $username = "root"; // Username từ hosting
    private $password = "quan2004"; // Password từ hosting
    private $conn = null;
    /**
     * Singleton pattern - Đảm bảo chỉ có 1 connection duy nhất
     * @return PDO|null
     */
    public function getConnection()
    {
        // Nếu đã có connection, trả về luôn (tránh tạo nhiều lần)
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            // Tạo DSN (Data Source Name) cho MySQL
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";

            // Khởi tạo PDO connection với options
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                // Set error mode: throw exceptions khi có lỗi
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                // Fetch mode mặc định: associative array
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                // Tắt emulated prepared statements để bảo mật tốt hơn
                PDO::ATTR_EMULATE_PREPARES => false
            ]);

            return $this->conn;
        } catch (PDOException $e) {
            // Bắt lỗi khi kết nối thất bại
            echo "Connection Error: " . $e->getMessage();
            return null;
        }
    }
}
