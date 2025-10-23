<?php

/**
 * LeaveController.php - Controller cho quản lý nghỉ phép
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/LeaveModel.php';

class LeaveController extends BaseController
{
    private $leaveModel;

    public function __construct()
    {
        $this->leaveModel = new LeaveModel();
    }

    /**
     * Get all leave requests
     * GET /api/leaves
     */
    public function index()
    {
        $filters = [];

        if (isset($_GET['employee_id'])) {
            $filters['employee_id'] = $_GET['employee_id'];
        }
        if (isset($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }
        if (isset($_GET['type'])) {
            $filters['type'] = $_GET['type'];
        }

        $leaves = empty($filters)
            ? $this->leaveModel->getAll()
            : $this->leaveModel->getWithFilters($filters);

        $this->sendSuccess($leaves);
    }

    /**
     * Get single leave request
     * GET /api/leaves/:id
     */
    public function show($id)
    {
        $leave = $this->leaveModel->getById($id);

        if ($leave) {
            $this->sendSuccess($leave);
        } else {
            $this->sendError('Leave request not found', 404);
        }
    }

    /**
     * Create leave request
     * POST /api/leaves
     */
    public function create()
    {
        $data = $this->getJsonInput();

        $required = ['employee_id', 'start_date', 'end_date', 'type'];
        $missing = $this->validateRequired($data, $required);

        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        $data['status'] = $data['status'] ?? 'pending';
        $data['reason'] = $data['reason'] ?? '';

        $leaveId = $this->leaveModel->create($data);

        if ($leaveId) {
            $this->sendSuccess(['id' => $leaveId], 'Leave request created successfully');
        } else {
            $this->sendError('Failed to create leave request', 500);
        }
    }

    /**
     * Approve or reject leave
     * PUT /api/leaves/:id/status
     */
    public function updateStatus($id)
    {
        $data = $this->getJsonInput();

        if (!isset($data['status']) || !in_array($data['status'], ['approved', 'rejected'])) {
            $this->sendError('Invalid status. Must be approved or rejected', 400);
        }

        // Get approver from session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $approverId = $_SESSION['user_id'] ?? 1; // Default to admin

        $success = $this->leaveModel->updateStatus($id, $data['status'], $approverId);

        if ($success) {
            $this->sendSuccess(null, 'Leave request ' . $data['status'] . ' successfully');
        } else {
            $this->sendError('Failed to update leave status', 500);
        }
    }

    /**
     * Get leave balance
     * GET /api/leaves/balance?employee_id=XXX&year=YYYY
     */
    public function getBalance()
    {
        $employeeId = $_GET['employee_id'] ?? null;
        $year = $_GET['year'] ?? null;

        if (!$employeeId) {
            $this->sendError('employee_id is required', 400);
        }

        $balance = $this->leaveModel->getLeaveBalance($employeeId, $year);
        $this->sendSuccess($balance);
    }

    /**
     * Delete leave request
     * DELETE /api/leaves/:id
     */
    public function delete($id)
    {
        $existing = $this->leaveModel->getById($id);
        if (!$existing) {
            $this->sendError('Leave request not found', 404);
        }

        $success = $this->leaveModel->delete($id);

        if ($success) {
            $this->sendSuccess(null, 'Leave request deleted successfully');
        } else {
            $this->sendError('Failed to delete leave request', 500);
        }
    }
}
