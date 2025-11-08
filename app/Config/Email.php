<?php

/**
 * Email.php - Cấu hình SMTP cho gửi email
 * Sử dụng Gmail SMTP với App Password
 */

class EmailConfig
{
    // SMTP Configuration
    private $smtp_host = "smtp.gmail.com";
    private $smtp_port = 587; // TLS port (hoặc 465 cho SSL)
    private $smtp_secure = "tls"; // 'tls' hoặc 'ssl'

    // Gmail credentials
    private $smtp_username = "quannnd2004@gmail.com"; // Email của bạn
    private $smtp_password = "aadv hohd xbhu lmdi"; // App password từ SMTP.md

    // Sender info
    private $from_email = "quannnd2004@gmail.com";
    private $from_name = "HRM System";

    // Email settings
    private $charset = "UTF-8";

    /**
     * Get SMTP configuration
     * @return array
     */
    public function getConfig()
    {
        return [
            'host' => $this->smtp_host,
            'port' => $this->smtp_port,
            'secure' => $this->smtp_secure,
            'username' => $this->smtp_username,
            'password' => $this->smtp_password,
            'from_email' => $this->from_email,
            'from_name' => $this->from_name,
            'charset' => $this->charset
        ];
    }
}
