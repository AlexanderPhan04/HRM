<?php

/**
 * BaseController.php - Abstract base class cho tất cả controllers
 * Áp dụng OOP và các helper methods chung
 */

abstract class BaseController
{
    /**
     * Send JSON response
     * @param mixed $data
     * @param int $statusCode
     */
    protected function sendResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Send success response
     * @param mixed $data
     * @param string $message
     */
    protected function sendSuccess($data = null, $message = 'Success')
    {
        $this->sendResponse([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], 200);
    }

    /**
     * Send error response
     * @param string $message
     * @param int $statusCode
     */
    protected function sendError($message, $statusCode = 400)
    {
        $this->sendResponse([
            'success' => false,
            'message' => $message,
            'data' => null
        ], $statusCode);
    }

    /**
     * Get JSON input từ request body
     * @return array|null
     */
    protected function getJsonInput()
    {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }

    /**
     * Validate required fields
     * @param array $data
     * @param array $requiredFields
     * @return array|null - Array of missing fields hoặc null nếu ok
     */
    protected function validateRequired($data, $requiredFields)
    {
        $missing = [];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                $missing[] = $field;
            }
        }

        return empty($missing) ? null : $missing;
    }

    /**
     * Sanitize string input
     * @param string $input
     * @return string
     */
    protected function sanitize($input)
    {
        return htmlspecialchars(strip_tags(trim($input)));
    }
}
