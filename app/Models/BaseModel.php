<?php

/**
 * BaseModel.php - Abstract base class cho tất cả models (MVC Structure)
 * Áp dụng OOP: Inheritance, Encapsulation
 */

require_once CONFIG_PATH . '/Database.php';

abstract class BaseModel
{
    // Protected properties - chỉ truy cập từ class này và class con
    protected $conn;
    protected $table;

    /**
     * Constructor - Khởi tạo database connection
     */
    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all records từ table
     * @return array
     */
    public function getAll()
    {
        try {
            // Prepare SQL query
            $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            // Fetch all results as associative array
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getAll(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get one record by ID
     * @param string|int $id
     * @return array|null
     */
    public function getById($id)
    {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Fetch single result
            $result = $stmt->fetch();
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error in getById(): " . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete record by ID
     * @param string|int $id
     * @return bool
     */
    public function delete($id)
    {
        try {
            $query = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in delete(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Count total records
     * @return int
     */
    public function count()
    {
        try {
            $query = "SELECT COUNT(*) as total FROM " . $this->table;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $result = $stmt->fetch();
            return (int) $result['total'];
        } catch (PDOException $e) {
            error_log("Error in count(): " . $e->getMessage());
            return 0;
        }
    }
}
