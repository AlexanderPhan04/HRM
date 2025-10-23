<?php

/**
 * PerformanceModel.php - Model cho quản lý đánh giá hiệu suất
 */

require_once MODEL_PATH . '/BaseModel.php';

class PerformanceModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
        $this->table = 'performance_reviews';
    }

    /**
     * Create performance review
     * @param array $data
     * @return int|bool
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (employee_id, review_date, rating, feedback, reviewer_id) 
                     VALUES 
                     (:employee_id, :review_date, :rating, :feedback, :reviewer_id)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $data['employee_id']);
            $stmt->bindParam(':review_date', $data['review_date']);
            $stmt->bindParam(':rating', $data['rating']);
            $stmt->bindParam(':feedback', $data['feedback']);
            $stmt->bindParam(':reviewer_id', $data['reviewer_id']);

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
     * Get average rating của một nhân viên
     * @param string $employeeId
     * @return float
     */
    public function getAverageRating($employeeId)
    {
        try {
            $query = "SELECT AVG(rating) as average 
                     FROM " . $this->table . " 
                     WHERE employee_id = :employee_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $employeeId);
            $stmt->execute();

            $result = $stmt->fetch();
            return round((float) ($result['average'] ?? 0), 2);
        } catch (PDOException $e) {
            error_log("Error in getAverageRating(): " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get top performers (nhân viên có rating cao nhất)
     * @param int $limit
     * @return array
     */
    public function getTopPerformers($limit = 10)
    {
        try {
            $query = "SELECT 
                        e.id,
                        e.name,
                        e.department_id,
                        d.name as department_name,
                        AVG(pr.rating) as average_rating,
                        COUNT(pr.id) as total_reviews
                     FROM employees e
                     JOIN " . $this->table . " pr ON e.id = pr.employee_id
                     LEFT JOIN departments d ON e.department_id = d.id
                     GROUP BY e.id, e.name, e.department_id, d.name
                     ORDER BY average_rating DESC, total_reviews DESC
                     LIMIT :limit";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getTopPerformers(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get reviews của một nhân viên
     * @param string $employeeId
     * @return array
     */
    public function getByEmployee($employeeId)
    {
        try {
            $query = "SELECT pr.*, 
                            e.name as employee_name,
                            u.fullname as reviewer_name
                     FROM " . $this->table . " pr
                     JOIN employees e ON pr.employee_id = e.id
                     LEFT JOIN users u ON pr.reviewer_id = u.id
                     WHERE pr.employee_id = :employee_id
                     ORDER BY pr.review_date DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $employeeId);
            $stmt->execute();

            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getByEmployee(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get all reviews với employee và reviewer info
     * @return array
     */
    public function getAllWithDetails()
    {
        try {
            $query = "SELECT pr.*, 
                            e.name as employee_name,
                            u.fullname as reviewer_name
                     FROM " . $this->table . " pr
                     JOIN employees e ON pr.employee_id = e.id
                     LEFT JOIN users u ON pr.reviewer_id = u.id
                     ORDER BY pr.review_date DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getAllWithDetails(): " . $e->getMessage());
            return [];
        }
    }
}
