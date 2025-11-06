<?php

/**
 * LeaveModel.php - Model cho quản lý nghỉ phép
 */

require_once MODEL_PATH . '/BaseModel.php';

class LeaveModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
        $this->table = 'leaves';
    }

    /**
     * Create leave request
     * @param array $data
     * @return int|bool
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (employee_id, start_date, end_date, type, status, reason) 
                     VALUES 
                     (:employee_id, :start_date, :end_date, :type, :status, :reason)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $data['employee_id']);
            $stmt->bindParam(':start_date', $data['start_date']);
            $stmt->bindParam(':end_date', $data['end_date']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':status', $data['status']);
            $stmt->bindParam(':reason', $data['reason']);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in create(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Approve hoặc reject leave request
     * @param int $leaveId
     * @param string $status - 'approved' hoặc 'rejected'
     * @param int $approvedBy - User ID
     * @return bool
     */
    public function updateStatus($leaveId, $status, $approvedBy)
    {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET status = :status,
                         approved_by = :approved_by,
                         approved_at = CURRENT_TIMESTAMP
                     WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':approved_by', $approvedBy);
            $stmt->bindParam(':id', $leaveId);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in updateStatus(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get leave balance của nhân viên
     * @param string $employeeId
     * @param int $year
     * @return array
     */
    public function getLeaveBalance($employeeId, $year = null)
    {
        try {
            $year = $year ?? date('Y');

            $query = "SELECT 
                        type,
                        COUNT(*) as total_requests,
                        SUM(DATEDIFF(end_date, start_date) + 1) as total_days
                     FROM " . $this->table . "
                     WHERE employee_id = :employee_id
                     AND status = 'approved'
                     AND YEAR(start_date) = :year
                     GROUP BY type";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $employeeId);
            $stmt->bindParam(':year', $year);
            $stmt->execute();

            $results = $stmt->fetchAll();

            // Tính toán balance (giả sử mỗi nhân viên có 20 ngày annual leave)
            $balance = [
                'annual' => ['total' => 20, 'used' => 0, 'remaining' => 20],
                'sick' => ['total' => 12, 'used' => 0, 'remaining' => 12],
                'unpaid' => ['total' => 0, 'used' => 0, 'remaining' => 0]
            ];

            foreach ($results as $row) {
                $type = $row['type'];
                $used = (int) $row['total_days'];

                if (isset($balance[$type])) {
                    $balance[$type]['used'] = $used;
                    $balance[$type]['remaining'] = $balance[$type]['total'] - $used;
                }
            }

            return $balance;
        } catch (PDOException $e) {
            error_log("Error in getLeaveBalance(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get all leaves với filters
     * @param array $filters
     * @return array
     */
    public function getWithFilters($filters = [])
    {
        try {
            $query = "SELECT l.*, 
                            e.name as employee_name,
                            u.fullname as approved_by_name
                     FROM " . $this->table . " l
                     JOIN employees e ON l.employee_id = e.id
                     LEFT JOIN users u ON l.approved_by = u.id
                     WHERE 1=1";

            $params = [];

            if (!empty($filters['employee_id'])) {
                $query .= " AND l.employee_id = :employee_id";
                $params[':employee_id'] = $filters['employee_id'];
            }

            if (!empty($filters['status'])) {
                $query .= " AND l.status = :status";
                $params[':status'] = $filters['status'];
            }

            if (!empty($filters['type'])) {
                $query .= " AND l.type = :type";
                $params[':type'] = $filters['type'];
            }

            $query .= " ORDER BY l.created_at DESC";

            $stmt = $this->conn->prepare($query);

            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getWithFilters(): " . $e->getMessage());
            return [];
        }
    }
}
