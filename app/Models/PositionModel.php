<?php

/**
 * PositionModel.php - Model cho quản lý vị trí công việc
 */

require_once MODEL_PATH . '/BaseModel.php';

class PositionModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
        $this->table = 'positions';
    }

    /**
     * Create new position
     * @param array $data
     * @return string|bool
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (id, title, description, salary_base) 
                     VALUES 
                     (:id, :title, :description, :salary_base)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $data['id']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':salary_base', $data['salary_base']);

            if ($stmt->execute()) {
                return $data['id'];
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in create(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update position
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data)
    {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET title = :title,
                         description = :description,
                         salary_base = :salary_base,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':salary_base', $data['salary_base']);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in update(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Generate new position ID
     * @return string
     */
    public function generateId()
    {
        try {
            $query = "SELECT id FROM " . $this->table . " 
                     WHERE id LIKE 'POS%' 
                     ORDER BY id DESC LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $result = $stmt->fetch();

            if ($result) {
                $lastNumber = (int) substr($result['id'], 3);
                $newNumber = $lastNumber + 1;
                return 'POS' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
            }

            return 'POS001';
        } catch (PDOException $e) {
            return 'POS001';
        }
    }
}
