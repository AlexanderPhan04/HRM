<?php

/**
 * AuthController.php - Controller cho authentication (MVC Structure)
 */

require_once CONTROLLER_PATH . '/BaseController.php';
require_once MODEL_PATH . '/UserModel.php';

// Định nghĩa SERVICES_PATH nếu chưa có
if (!defined('SERVICES_PATH')) {
    define('SERVICES_PATH', APP_PATH . '/Services');
}
require_once SERVICES_PATH . '/EmailService.php';

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
            // Kiểm tra email đã được verify chưa (nếu có email)
            if (isset($user['email']) && !empty($user['email']) && !$user['email_verified']) {
                $this->sendError('Please verify your email before logging in. Check your inbox.', 403);
            }

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
     * Handle register request WITH EMAIL VERIFICATION
     * POST /api/auth/register
     */
    public function register()
    {
        $data = $this->getJsonInput();

        // Validate required fields (bao gồm email)
        $missing = $this->validateRequired($data, ['username', 'password', 'fullname', 'email']);
        if ($missing) {
            $this->sendError('Missing fields: ' . implode(', ', $missing), 400);
        }

        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendError('Invalid email format', 400);
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

        // Check if email exists
        $existingEmail = $this->userModel->findByEmail($data['email']);
        if ($existingEmail) {
            $this->sendError('Email already exists', 409);
        }

        // Create new user
        $userData = [
            'username' => $this->sanitize($data['username']),
            'password' => $data['password'],
            'fullname' => $this->sanitize($data['fullname']),
            'email' => $this->sanitize($data['email']),
            'role' => $data['role'] ?? 'employee'
        ];

        $result = $this->userModel->create($userData);

        if ($result && isset($result['user_id'])) {
            // Gửi email xác thực
            try {
                $emailService = new EmailService();
                $emailSent = $emailService->sendVerificationEmail(
                    $userData['email'],
                    $userData['fullname'],
                    $result['verification_token']
                );

                $message = $emailSent
                    ? 'Registration successful! Please check your email to verify your account.'
                    : 'Registration successful but email sending failed. Please contact admin.';

                $this->sendSuccess([
                    'user_id' => $result['user_id'],
                    'email_sent' => $emailSent
                ], $message);
            } catch (Exception $e) {
                error_log("Email sending error: " . $e->getMessage());
                $this->sendSuccess([
                    'user_id' => $result['user_id'],
                    'email_sent' => false
                ], 'Registration successful but email sending failed. Please contact admin.');
            }
        } else {
            $this->sendError('Registration failed', 500);
        }
    }

    /**
     * Verify email address
     * GET /api/auth/verify/:token
     */
    public function verifyEmail($token)
    {
        if (empty($token)) {
            $this->sendError('Verification token is required', 400);
        }

        // Tìm user với token này
        $user = $this->userModel->findByVerificationToken($token);

        if (!$user) {
            $this->sendError('Invalid or expired verification token', 400);
        }

        // Verify email
        $verified = $this->userModel->verifyEmail($token);

        if ($verified) {
            $this->sendSuccess([
                'username' => $user['username'],
                'email' => $user['email']
            ], 'Email verified successfully! You can now login.');
        } else {
            $this->sendError('Email verification failed', 500);
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
