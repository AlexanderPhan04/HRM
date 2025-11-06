<?php

/**
 * EmployeeController.php - Controller cho quản lý nhân viên
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/EmployeeModel.php';

class EmployeeController extends BaseController
{
    private $employeeModel;

    public function __construct()
    {
        $this->employeeModel = new EmployeeModel();
    }

    /**
     * Get all employees
     * GET /api/employees
     */
    public function index()
    {
        $employees = $this->employeeModel->getAll();
        $this->sendSuccess($employees);
    }

    /**
     * Get single employee by ID
     * GET /api/employees/:id
     */
    public function show($id)
    {
        $employee = $this->employeeModel->getById($id);

        if ($employee) {
            $this->sendSuccess($employee);
        } else {
            $this->sendError('Employee not found', 404);
        }
    }

    /**
     * Create new employee
     * POST /api/employees
     */
    public function create()
    {
        $data = $this->getJsonInput();

        // Validate required fields
        $required = ['name', 'department_id', 'position_id', 'salary', 'hire_date', 'email', 'phone'];
        $missing = $this->validateRequired($data, $required);

        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        // Generate new ID
        $data['id'] = $this->employeeModel->generateId();

        // Set defaults
        $data['bonus'] = $data['bonus'] ?? 0;
        $data['deduction'] = $data['deduction'] ?? 0;
        $data['address'] = $data['address'] ?? '';

        // Sanitize inputs
        $data['name'] = $this->sanitize($data['name']);
        $data['email'] = $this->sanitize($data['email']);
        $data['phone'] = $this->sanitize($data['phone']);
        $data['address'] = $this->sanitize($data['address']);

        $employeeId = $this->employeeModel->create($data);

        if ($employeeId) {
            $this->sendSuccess(['id' => $employeeId], 'Employee created successfully');
        } else {
            $this->sendError('Failed to create employee', 500);
        }
    }

    /**
     * Update employee
     * PUT /api/employees/:id
     */
    public function update($id)
    {
        $data = $this->getJsonInput();

        // Check if employee exists
        $existing = $this->employeeModel->getById($id);
        if (!$existing) {
            $this->sendError('Employee not found', 404);
        }

        // Sanitize inputs
        if (isset($data['name'])) $data['name'] = $this->sanitize($data['name']);
        if (isset($data['email'])) $data['email'] = $this->sanitize($data['email']);
        if (isset($data['phone'])) $data['phone'] = $this->sanitize($data['phone']);
        if (isset($data['address'])) $data['address'] = $this->sanitize($data['address']);

        $success = $this->employeeModel->update($id, $data);

        if ($success) {
            $this->sendSuccess(null, 'Employee updated successfully');
        } else {
            $this->sendError('Failed to update employee', 500);
        }
    }

    /**
     * Delete employee
     * DELETE /api/employees/:id
     */
    public function delete($id)
    {
        // Check if employee exists
        $existing = $this->employeeModel->getById($id);
        if (!$existing) {
            $this->sendError('Employee not found', 404);
        }

        $success = $this->employeeModel->delete($id);

        if ($success) {
            $this->sendSuccess(null, 'Employee deleted successfully');
        } else {
            $this->sendError('Failed to delete employee', 500);
        }
    }

    /**
     * Search employees
     * POST /api/employees/search
     */
    public function search()
    {
        $filters = $this->getJsonInput();
        $results = $this->employeeModel->search($filters);
        $this->sendSuccess($results);
    }

    /**
     * Get employees by department
     * GET /api/employees/department/:departmentId
     */
    public function getByDepartment($departmentId)
    {
        $employees = $this->employeeModel->getByDepartment($departmentId);
        $this->sendSuccess($employees);
    }

    /**
     * Get total salary
     * GET /api/employees/total-salary
     */
    public function getTotalSalary()
    {
        $total = $this->employeeModel->getTotalSalary();
        $this->sendSuccess(['total' => $total]);
    }
}
