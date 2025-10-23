<?php

/**
 * AuthController.php - Controller cho authentication (MVC Structure)
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/UserModel.php';

class AuthController extends BaseController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    /**
     * Handle login request
     * POST /api/auth/login
     */
    public function login()
    {
        $data = $this->getJsonInput();

        // Validate required fields
        $missing = $this->validateRequired($data, ['username', 'password']);
        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        $username = $this->sanitize($data['username']);
        $password = $data['password'];

        // Verify credentials
        $user = $this->userModel->verifyLogin($username, $password);

        if ($user) {
            // Tạo session token đơn giản (trong thực tế nên dùng JWT)
            $token = bin2hex(random_bytes(32));

            // Bắt đầu session để lưu user info
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['token'] = $token;

            $this->sendSuccess([
                'user' => $user,
                'token' => $token
            ], 'Login successful');
        } else {
            $this->sendError('Invalid username or password', 401);
        }
    }

    /**
     * Handle register request
     * POST /api/auth/register
     */
    public function register()
    {
        $data = $this->getJsonInput();

        // Validate required fields
        $missing = $this->validateRequired($data, ['username', 'password', 'fullname']);
        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        // Validate password length
        if (strlen($data['password']) < 6) {
            $this->sendError('Password must be at least 6 characters', 400);
        }

        // Check if username exists
        $existingUser = $this->userModel->findByUsername($data['username']);
        if ($existingUser) {
            $this->sendError('Username already exists', 409);
        }

        // Create new user
        $userData = [
            'username' => $this->sanitize($data['username']),
            'password' => $data['password'],
            'fullname' => $this->sanitize($data['fullname']),
            'role' => $data['role'] ?? 'employee'
        ];

        $userId = $this->userModel->create($userData);

        if ($userId) {
            $this->sendSuccess(['user_id' => $userId], 'Registration successful');
        } else {
            $this->sendError('Registration failed', 500);
        }
    }

    /**
     * Handle logout request
     * POST /api/auth/logout
     */
    public function logout()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Destroy session
        session_unset();
        session_destroy();

        $this->sendSuccess(null, 'Logout successful');
    }

    /**
     * Check current session
     * GET /api/auth/check
     */
    public function checkSession()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (isset($_SESSION['user_id'])) {
            $user = $this->userModel->getById($_SESSION['user_id']);

            if ($user) {
                unset($user['password']);
                $this->sendSuccess(['user' => $user], 'Session valid');
            }
        }

        $this->sendError('No active session', 401);
    }
}
