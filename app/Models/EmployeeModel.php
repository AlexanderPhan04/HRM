<?php

/**
 * EmployeeModel.php - Model cho quản lý nhân viên
 * Extends BaseModel để tận dụng các method chung
 */

require_once MODEL_PATH . '/BaseModel.php';

class EmployeeModel extends BaseModel
{
    /**
     * Constructor - Set table name
     */
    public function __construct()
    {
        parent::__construct(); // Gọi constructor của BaseModel
        $this->table = 'employees';
    }

    /**
     * Create new employee
     * @param array $data
     * @return string|bool - ID của employee mới hoặc false
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (id, name, department_id, position_id, salary, bonus, deduction, 
                      hire_date, email, phone, address) 
                     VALUES 
                     (:id, :name, :department_id, :position_id, :salary, :bonus, :deduction,
                      :hire_date, :email, :phone, :address)";

            $stmt = $this->conn->prepare($query);

            // Bind parameters để tránh SQL injection
            $stmt->bindParam(':id', $data['id']);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':department_id', $data['department_id']);
            $stmt->bindParam(':position_id', $data['position_id']);
            $stmt->bindParam(':salary', $data['salary']);
            $stmt->bindParam(':bonus', $data['bonus']);
            $stmt->bindParam(':deduction', $data['deduction']);
            $stmt->bindParam(':hire_date', $data['hire_date']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':address', $data['address']);

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
     * Update employee
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update($id, $data)
    {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET name = :name,
                         department_id = :department_id,
                         position_id = :position_id,
                         salary = :salary,
                         bonus = :bonus,
                         deduction = :deduction,
                         hire_date = :hire_date,
                         email = :email,
                         phone = :phone,
                         address = :address,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':department_id', $data['department_id']);
            $stmt->bindParam(':position_id', $data['position_id']);
            $stmt->bindParam(':salary', $data['salary']);
            $stmt->bindParam(':bonus', $data['bonus']);
            $stmt->bindParam(':deduction', $data['deduction']);
            $stmt->bindParam(':hire_date', $data['hire_date']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':address', $data['address']);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in update(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Search employees với filters động
     * @param array $filters - ['name' => 'keyword', 'department_id' => 'DEP001', ...]
     * @return array
     */
    public function search($filters = [])
    {
        try {
            $query = "SELECT e.*, 
                            d.name as department_name,
                            p.title as position_title
                     FROM " . $this->table . " e
                     LEFT JOIN departments d ON e.department_id = d.id
                     LEFT JOIN positions p ON e.position_id = p.id
                     WHERE 1=1";

            $params = [];

            // Dynamic WHERE conditions
            if (!empty($filters['name'])) {
                $query .= " AND e.name LIKE :name";
                $params[':name'] = '%' . $filters['name'] . '%';
            }

            if (!empty($filters['department_id'])) {
                $query .= " AND e.department_id = :department_id";
                $params[':department_id'] = $filters['department_id'];
            }

            if (!empty($filters['position_id'])) {
                $query .= " AND e.position_id = :position_id";
                $params[':position_id'] = $filters['position_id'];
            }

            if (isset($filters['min_salary'])) {
                $query .= " AND e.salary >= :min_salary";
                $params[':min_salary'] = $filters['min_salary'];
            }

            if (isset($filters['max_salary'])) {
                $query .= " AND e.salary <= :max_salary";
                $params[':max_salary'] = $filters['max_salary'];
            }

            $query .= " ORDER BY e.created_at DESC";

            $stmt = $this->conn->prepare($query);

            // Bind all parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in search(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get employees by department
     * @param string $departmentId
     * @return array
     */
    public function getByDepartment($departmentId)
    {
        return $this->search(['department_id' => $departmentId]);
    }

    /**
     * Generate new employee ID (EMP + số)
     * @return string
     */
    public function generateId()
    {
        try {
            $query = "SELECT id FROM " . $this->table . " 
                     WHERE id LIKE 'EMP%' 
                     ORDER BY id DESC LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $result = $stmt->fetch();

            if ($result) {
                // Extract số từ ID (EMP001 -> 001)
                $lastNumber = (int) substr($result['id'], 3);
                $newNumber = $lastNumber + 1;
                return 'EMP' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
            }

            return 'EMP001';
        } catch (PDOException $e) {
            error_log("Error in generateId(): " . $e->getMessage());
            return 'EMP001';
        }
    }

    /**
     * Get total salary của tất cả nhân viên
     * @return float
     */
    public function getTotalSalary()
    {
        try {
            $query = "SELECT SUM(salary) as total FROM " . $this->table;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $result = $stmt->fetch();
            return (float) ($result['total'] ?? 0);
        } catch (PDOException $e) {
            error_log("Error in getTotalSalary(): " . $e->getMessage());
            return 0;
        }
    }
}
