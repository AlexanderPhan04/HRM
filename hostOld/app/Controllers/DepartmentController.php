<?php

/**
 * DepartmentController.php - Controller cho quản lý phòng ban
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/DepartmentModel.php';

class DepartmentController extends BaseController
{
    private $departmentModel;

    public function __construct()
    {
        $this->departmentModel = new DepartmentModel();
    }

    /**
     * Get all departments
     * GET /api/departments
     */
    public function index()
    {
        $departments = $this->departmentModel->getAll();
        $this->sendSuccess($departments);
    }

    /**
     * Get single department by ID
     * GET /api/departments/:id
     */
    public function show($id)
    {
        $department = $this->departmentModel->getById($id);

        if ($department) {
            $this->sendSuccess($department);
        } else {
            $this->sendError('Department not found', 404);
        }
    }

    /**
     * Create new department
     * POST /api/departments
     */
    public function create()
    {
        $data = $this->getJsonInput();

        // Validate required fields
        $missing = $this->validateRequired($data, ['name']);
        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        // Generate new ID
        $data['id'] = $this->departmentModel->generateId();
        $data['description'] = $data['description'] ?? '';
        $data['manager_id'] = $data['manager_id'] ?? null;

        // Sanitize
        $data['name'] = $this->sanitize($data['name']);
        $data['description'] = $this->sanitize($data['description']);

        $departmentId = $this->departmentModel->create($data);

        if ($departmentId) {
            $this->sendSuccess(['id' => $departmentId], 'Department created successfully');
        } else {
            $this->sendError('Failed to create department', 500);
        }
    }

    /**
     * Update department
     * PUT /api/departments/:id
     */
    public function update($id)
    {
        $data = $this->getJsonInput();

        $existing = $this->departmentModel->getById($id);
        if (!$existing) {
            $this->sendError('Department not found', 404);
        }

        if (isset($data['name'])) $data['name'] = $this->sanitize($data['name']);
        if (isset($data['description'])) $data['description'] = $this->sanitize($data['description']);

        $success = $this->departmentModel->update($id, $data);

        if ($success) {
            $this->sendSuccess(null, 'Department updated successfully');
        } else {
            $this->sendError('Failed to update department', 500);
        }
    }

    /**
     * Delete department
     * DELETE /api/departments/:id
     */
    public function delete($id)
    {
        $existing = $this->departmentModel->getById($id);
        if (!$existing) {
            $this->sendError('Department not found', 404);
        }

        $success = $this->departmentModel->delete($id);

        if ($success) {
            $this->sendSuccess(null, 'Department deleted successfully');
        } else {
            $this->sendError('Failed to delete department', 500);
        }
    }
}
