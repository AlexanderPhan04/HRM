<?php

/**
 * PerformanceController.php - Controller cho quản lý đánh giá hiệu suất
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/PerformanceModel.php';

class PerformanceController extends BaseController
{
    private $performanceModel;

    public function __construct()
    {
        $this->performanceModel = new PerformanceModel();
    }

    /**
     * Get all performance reviews
     * GET /api/performance
     */
    public function index()
    {
        $reviews = $this->performanceModel->getAllWithDetails();
        $this->sendSuccess($reviews);
    }

    /**
     * Get reviews by employee
     * GET /api/performance/employee/:employeeId
     */
    public function getByEmployee($employeeId)
    {
        $reviews = $this->performanceModel->getByEmployee($employeeId);
        $this->sendSuccess($reviews);
    }

    /**
     * Create performance review
     * POST /api/performance
     */
    public function create()
    {
        $data = $this->getJsonInput();

        $required = ['employee_id', 'review_date', 'rating'];
        $missing = $this->validateRequired($data, $required);

        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        // Validate rating
        if ($data['rating'] < 1 || $data['rating'] > 5) {
            $this->sendError('Rating must be between 1 and 5', 400);
        }

        $data['feedback'] = $data['feedback'] ?? '';

        // Get reviewer from session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $data['reviewer_id'] = $_SESSION['user_id'] ?? 1;

        $reviewId = $this->performanceModel->create($data);

        if ($reviewId) {
            $this->sendSuccess(['id' => $reviewId], 'Performance review created successfully');
        } else {
            $this->sendError('Failed to create performance review', 500);
        }
    }

    /**
     * Get average rating
     * GET /api/performance/average/:employeeId
     */
    public function getAverageRating($employeeId)
    {
        $average = $this->performanceModel->getAverageRating($employeeId);
        $this->sendSuccess(['average_rating' => $average]);
    }

    /**
     * Get top performers
     * GET /api/performance/top?limit=10
     */
    public function getTopPerformers()
    {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $topPerformers = $this->performanceModel->getTopPerformers($limit);
        $this->sendSuccess($topPerformers);
    }

    /**
     * Delete performance review
     * DELETE /api/performance/:id
     */
    public function delete($id)
    {
        $existing = $this->performanceModel->getById($id);
        if (!$existing) {
            $this->sendError('Performance review not found', 404);
        }

        $success = $this->performanceModel->delete($id);

        if ($success) {
            $this->sendSuccess(null, 'Performance review deleted successfully');
        } else {
            $this->sendError('Failed to delete performance review', 500);
        }
    }
}
