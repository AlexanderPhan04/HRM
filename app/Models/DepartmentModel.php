<?php

/**
 * DepartmentModel.php - Model cho quản lý phòng ban
 */

require_once MODEL_PATH . '/BaseModel.php';

class DepartmentModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
        $this->table = 'departments';
    }

    /**
     * Create new department
     * @param array $data
     * @return string|bool
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (id, name, description, manager_id) 
                     VALUES 
                     (:id, :name, :description, :manager_id)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $data['id']);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':manager_id', $data['manager_id']);

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
     * Update department
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data)
    {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET name = :name,
                         description = :description,
                         manager_id = :manager_id,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':manager_id', $data['manager_id']);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in update(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Generate new department ID
     * @return string
     */
    public function generateId()
    {
        try {
            $query = "SELECT id FROM " . $this->table . " 
                     WHERE id LIKE 'DEP%' 
                     ORDER BY id DESC LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $result = $stmt->fetch();

            if ($result) {
                $lastNumber = (int) substr($result['id'], 3);
                $newNumber = $lastNumber + 1;
                return 'DEP' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
            }

            return 'DEP001';
        } catch (PDOException $e) {
            return 'DEP001';
        }
    }
}
