<?php

/**
 * UserModel.php - Model cho quản lý người dùng và authentication (MVC Structure)
 */

require_once MODEL_PATH . '/BaseModel.php';

class UserModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
        $this->table = 'users';
    }

    /**
     * Create new user with email verification
     * @param array $data
     * @return int|bool - ID của user mới hoặc false
     */
    public function create($data)
    {
        try {
            // Tạo verification token nếu có email
            $verificationToken = null;
            $tokenExpiresAt = null;
            $emailVerified = false;

            if (isset($data['email']) && !empty($data['email'])) {
                $verificationToken = bin2hex(random_bytes(32)); // 64 ký tự
                $tokenExpiresAt = date('Y-m-d H:i:s', strtotime('+24 hours')); // Hết hạn sau 24h
            }

            $query = "INSERT INTO " . $this->table . " 
                     (username, password, fullname, role, email, email_verified, verification_token, token_expires_at) 
                     VALUES 
                     (:username, :password, :fullname, :role, :email, :email_verified, :verification_token, :token_expires_at)";

            $stmt = $this->conn->prepare($query);

            // Hash password trước khi lưu
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':fullname', $data['fullname']);
            $stmt->bindParam(':role', $data['role']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':email_verified', $emailVerified, PDO::PARAM_BOOL);
            $stmt->bindParam(':verification_token', $verificationToken);
            $stmt->bindParam(':token_expires_at', $tokenExpiresAt);

            if ($stmt->execute()) {
                $userId = $this->conn->lastInsertId();

                // Trả về kèm verification token để gửi email
                return [
                    'user_id' => $userId,
                    'verification_token' => $verificationToken
                ];
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in create(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Find user by username
     * @param string $username
     * @return array|null
     */
    public function findByUsername($username)
    {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE username = :username LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();

            $result = $stmt->fetch();
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error in findByUsername(): " . $e->getMessage());
            return null;
        }
    }

    /**
     * Verify login credentials
     * @param string $username
     * @param string $password
     * @return array|bool - User data nếu thành công, false nếu thất bại
     */
    public function verifyLogin($username, $password)
    {
        $user = $this->findByUsername($username);

        if ($user && password_verify($password, $user['password'])) {
            // Remove password từ kết quả trả về (security best practice)
            unset($user['password']);
            return $user;
        }

        return false;
    }

    /**
     * Update user password
     * @param int $id
     * @param string $newPassword
     * @return bool
     */
    public function updatePassword($id, $newPassword)
    {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET password = :password 
                     WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':id', $id);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in updatePassword(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Find user by email
     * @param string $email
     * @return array|null
     */
    public function findByEmail($email)
    {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE email = :email LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $result = $stmt->fetch();
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error in findByEmail(): " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by verification token
     * @param string $token
     * @return array|null
     */
    public function findByVerificationToken($token)
    {
        try {
            $query = "SELECT * FROM " . $this->table . " 
                     WHERE verification_token = :token 
                     AND token_expires_at > NOW() 
                     LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            $result = $stmt->fetch();
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error in findByVerificationToken(): " . $e->getMessage());
            return null;
        }
    }

    /**
     * Verify email (kích hoạt tài khoản)
     * @param string $token
     * @return bool
     */
    public function verifyEmail($token)
    {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET email_verified = TRUE, 
                         verification_token = NULL,
                         token_expires_at = NULL,
                         updated_at = NOW()
                     WHERE verification_token = :token 
                     AND token_expires_at > NOW()";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);

            if ($stmt->execute() && $stmt->rowCount() > 0) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in verifyEmail(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if email is verified
     * @param int $userId
     * @return bool
     */
    public function isEmailVerified($userId)
    {
        try {
            $query = "SELECT email_verified FROM " . $this->table . " WHERE id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $userId);
            $stmt->execute();

            $result = $stmt->fetch();
            return $result && $result['email_verified'];
        } catch (PDOException $e) {
            error_log("Error in isEmailVerified(): " . $e->getMessage());
            return false;
        }
    }
}
