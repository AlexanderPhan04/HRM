<?php

/**
 * AttendanceController.php - Controller cho quản lý chấm công
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/AttendanceModel.php';

class AttendanceController extends BaseController
{
    private $attendanceModel;

    public function __construct()
    {
        $this->attendanceModel = new AttendanceModel();
    }

    /**
     * Get all attendance records
     * GET /api/attendance
     */
    public function index()
    {
        $records = $this->attendanceModel->getAll();
        $this->sendSuccess($records);
    }

    /**
     * Create attendance record
     * POST /api/attendance
     */
    public function create()
    {
        $data = $this->getJsonInput();

        $missing = $this->validateRequired($data, ['employee_id', 'date', 'check_in']);
        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        $data['check_out'] = $data['check_out'] ?? null;
        $data['hours_worked'] = $data['hours_worked'] ?? 0;
        $data['status'] = $data['status'] ?? 'present';
        $data['notes'] = $data['notes'] ?? '';

        $recordId = $this->attendanceModel->create($data);

        if ($recordId) {
            $this->sendSuccess(['id' => $recordId], 'Attendance recorded successfully');
        } else {
            $this->sendError('Failed to record attendance', 500);
        }
    }

    /**
     * Check in
     * POST /api/attendance/check-in
     */
    public function checkIn()
    {
        $data = $this->getJsonInput();

        if (!isset($data['employee_id'])) {
            $this->sendError('employee_id is required', 400);
        }

        $checkInTime = $data['check_in_time'] ?? null;
        $recordId = $this->attendanceModel->checkIn($data['employee_id'], $checkInTime);

        if ($recordId) {
            $this->sendSuccess(['id' => $recordId], 'Checked in successfully');
        } else {
            $this->sendError('Failed to check in', 500);
        }
    }

    /**
     * Check out
     * POST /api/attendance/check-out
     */
    public function checkOut()
    {
        $data = $this->getJsonInput();

        if (!isset($data['employee_id'])) {
            $this->sendError('employee_id is required', 400);
        }

        $checkOutTime = $data['check_out_time'] ?? null;
        $success = $this->attendanceModel->checkOut($data['employee_id'], $checkOutTime);

        if ($success) {
            $this->sendSuccess(null, 'Checked out successfully');
        } else {
            $this->sendError('Failed to check out or no check-in record found', 500);
        }
    }

    /**
     * Get attendance report
     * GET /api/attendance/report?employee_id=XXX&from=YYYY-MM-DD&to=YYYY-MM-DD
     */
    public function getReport()
    {
        $employeeId = $_GET['employee_id'] ?? null;
        $fromDate = $_GET['from'] ?? date('Y-m-01');
        $toDate = $_GET['to'] ?? date('Y-m-d');

        if (!$employeeId) {
            $this->sendError('employee_id is required', 400);
        }

        $report = $this->attendanceModel->getReport($employeeId, $fromDate, $toDate);
        $this->sendSuccess($report);
    }

    /**
     * Get total hours
     * GET /api/attendance/total-hours?employee_id=XXX&month=YYYY-MM
     */
    public function getTotalHours()
    {
        $employeeId = $_GET['employee_id'] ?? null;
        $month = $_GET['month'] ?? date('Y-m');

        if (!$employeeId) {
            $this->sendError('employee_id is required', 400);
        }

        $totalHours = $this->attendanceModel->getTotalHours($employeeId, $month);
        $this->sendSuccess(['total_hours' => $totalHours]);
    }
}
