<?php

/**
 * PositionController.php - Controller cho quản lý vị trí
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/PositionModel.php';

class PositionController extends BaseController
{
    private $positionModel;

    public function __construct()
    {
        $this->positionModel = new PositionModel();
    }

    /**
     * Get all positions
     * GET /api/positions
     */
    public function index()
    {
        $positions = $this->positionModel->getAll();
        $this->sendSuccess($positions);
    }

    /**
     * Get single position by ID
     * GET /api/positions/:id
     */
    public function show($id)
    {
        $position = $this->positionModel->getById($id);

        if ($position) {
            $this->sendSuccess($position);
        } else {
            $this->sendError('Position not found', 404);
        }
    }

    /**
     * Create new position
     * POST /api/positions
     */
    public function create()
    {
        $data = $this->getJsonInput();

        $missing = $this->validateRequired($data, ['title']);
        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        $data['id'] = $this->positionModel->generateId();
        $data['description'] = $data['description'] ?? '';
        $data['salary_base'] = $data['salary_base'] ?? 0;

        $data['title'] = $this->sanitize($data['title']);
        $data['description'] = $this->sanitize($data['description']);

        $positionId = $this->positionModel->create($data);

        if ($positionId) {
            $this->sendSuccess(['id' => $positionId], 'Position created successfully');
        } else {
            $this->sendError('Failed to create position', 500);
        }
    }

    /**
     * Update position
     * PUT /api/positions/:id
     */
    public function update($id)
    {
        $data = $this->getJsonInput();

        $existing = $this->positionModel->getById($id);
        if (!$existing) {
            $this->sendError('Position not found', 404);
        }

        if (isset($data['title'])) $data['title'] = $this->sanitize($data['title']);
        if (isset($data['description'])) $data['description'] = $this->sanitize($data['description']);
        
        // Validate and sanitize salary_base
        if (isset($data['salary_base'])) {
            $salary_base = floatval($data['salary_base']);
            if ($salary_base < 0) {
                $this->sendError('Salary base cannot be negative', 400);
            }
            $data['salary_base'] = $salary_base;
        }

        $success = $this->positionModel->update($id, $data);

        if ($success) {
            $this->sendSuccess(null, 'Position updated successfully');
        } else {
            $this->sendError('Failed to update position', 500);
        }
    }

    /**
     * Delete position
     * DELETE /api/positions/:id
     */
    public function delete($id)
    {
        $existing = $this->positionModel->getById($id);
        if (!$existing) {
            $this->sendError('Position not found', 404);
        }

        $success = $this->positionModel->delete($id);

        if ($success) {
            $this->sendSuccess(null, 'Position deleted successfully');
        } else {
            $this->sendError('Failed to delete position', 500);
        }
    }
}
