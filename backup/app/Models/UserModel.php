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
     * Create new user
     * @param array $data
     * @return int|bool - ID của user mới hoặc false
     */
    public function create($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (username, password, fullname, role) 
                     VALUES 
                     (:username, :password, :fullname, :role)";

            $stmt = $this->conn->prepare($query);

            // Hash password trước khi lưu
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':fullname', $data['fullname']);
            $stmt->bindParam(':role', $data['role']);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
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
}
