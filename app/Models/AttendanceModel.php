<?php

/**
 * AttendanceModel.php - Model cho quản lý chấm công
 */

require_once MODEL_PATH . '/BaseModel.php';

class AttendanceModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
        $this->table = 'attendance';
    }

    /**
     * Create attendance record
     * @param array $data
     * @return int|bool
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (employee_id, date, check_in, check_out, hours_worked, status, notes) 
                     VALUES 
                     (:employee_id, :date, :check_in, :check_out, :hours_worked, :status, :notes)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $data['employee_id']);
            $stmt->bindParam(':date', $data['date']);
            $stmt->bindParam(':check_in', $data['check_in']);
            $stmt->bindParam(':check_out', $data['check_out']);
            $stmt->bindParam(':hours_worked', $data['hours_worked']);
            $stmt->bindParam(':status', $data['status']);
            $stmt->bindParam(':notes', $data['notes']);

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
     * Check in cho nhân viên
     * @param string $employeeId
     * @param string $checkInTime
     * @return int|bool
     */
    public function checkIn($employeeId, $checkInTime = null)
    {
        $today = date('Y-m-d');
        $time = $checkInTime ?? date('H:i:s');

        $data = [
            'employee_id' => $employeeId,
            'date' => $today,
            'check_in' => $time,
            'check_out' => null,
            'hours_worked' => 0,
            'status' => 'present',
            'notes' => ''
        ];

        return $this->create($data);
    }

    /**
     * Check out cho nhân viên
     * @param string $employeeId
     * @param string $checkOutTime
     * @return bool
     */
    public function checkOut($employeeId, $checkOutTime = null)
    {
        try {
            $today = date('Y-m-d');
            $time = $checkOutTime ?? date('H:i:s');

            // Tìm attendance record của hôm nay
            $query = "SELECT * FROM " . $this->table . " 
                     WHERE employee_id = :employee_id AND date = :date LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $employeeId);
            $stmt->bindParam(':date', $today);
            $stmt->execute();

            $record = $stmt->fetch();

            if (!$record) {
                return false;
            }

            // Tính hours worked
            $checkIn = new DateTime($record['check_in']);
            $checkOut = new DateTime($time);
            $interval = $checkIn->diff($checkOut);
            $hoursWorked = $interval->h + ($interval->i / 60);

            // Update record
            $updateQuery = "UPDATE " . $this->table . " 
                           SET check_out = :check_out,
                               hours_worked = :hours_worked
                           WHERE id = :id";
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bindParam(':check_out', $time);
            $updateStmt->bindParam(':hours_worked', $hoursWorked);
            $updateStmt->bindParam(':id', $record['id']);

            return $updateStmt->execute();
        } catch (PDOException $e) {
            error_log("Error in checkOut(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get attendance report của một nhân viên trong khoảng thời gian
     * @param string $employeeId
     * @param string $fromDate
     * @param string $toDate
     * @return array
     */
    public function getReport($employeeId, $fromDate, $toDate)
    {
        try {
            $query = "SELECT a.*, e.name as employee_name
                     FROM " . $this->table . " a
                     JOIN employees e ON a.employee_id = e.id
                     WHERE a.employee_id = :employee_id
                     AND a.date BETWEEN :from_date AND :to_date
                     ORDER BY a.date DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $employeeId);
            $stmt->bindParam(':from_date', $fromDate);
            $stmt->bindParam(':to_date', $toDate);
            $stmt->execute();

            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getReport(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get total hours worked của một nhân viên
     * @param string $employeeId
     * @param string $month - Format: YYYY-MM
     * @return float
     */
    public function getTotalHours($employeeId, $month)
    {
        try {
            $query = "SELECT SUM(hours_worked) as total 
                     FROM " . $this->table . " 
                     WHERE employee_id = :employee_id
                     AND DATE_FORMAT(date, '%Y-%m') = :month";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $employeeId);
            $stmt->bindParam(':month', $month);
            $stmt->execute();

            $result = $stmt->fetch();
            return (float) ($result['total'] ?? 0);
        } catch (PDOException $e) {
            error_log("Error in getTotalHours(): " . $e->getMessage());
            return 0;
        }
    }
}
