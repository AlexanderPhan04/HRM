<?php

/**
 * EmailService.php - Service để gửi email qua SMTP
 * Sử dụng PHPMailer hoặc native PHP mail với SMTP
 */

require_once CONFIG_PATH . '/Email.php';

class EmailService
{
    private $config;

    public function __construct()
    {
        $emailConfig = new EmailConfig();
        $this->config = $emailConfig->getConfig();
    }

    /**
     * Gửi email xác thực đăng ký
     * @param string $to Email người nhận
     * @param string $fullname Tên người nhận
     * @param string $verificationToken Token xác thực
     * @return bool
     */
    public function sendVerificationEmail($to, $fullname, $verificationToken)
    {
        $subject = "Xác thực tài khoản HRM System";

        // Tạo link xác thực (điều chỉnh domain cho phù hợp)
        $verificationLink = "https://alexstudio.id.vn/verify.php?token=" . $verificationToken;

        $body = $this->getVerificationEmailTemplate($fullname, $verificationLink);

        return $this->sendEmail($to, $subject, $body);
    }

    /**
     * Gửi email thông báo tài khoản mới (cho admin tạo)
     * @param string $to Email người nhận
     * @param string $fullname Tên người nhận
     * @param string $username Username
     * @param string $tempPassword Mật khẩu tạm (nếu có)
     * @return bool
     */
    public function sendNewAccountEmail($to, $fullname, $username, $tempPassword = null)
    {
        $subject = "Tài khoản HRM System của bạn";
        $body = $this->getNewAccountEmailTemplate($fullname, $username, $tempPassword);
        return $this->sendEmail($to, $subject, $body);
    }

    /**
     * Gửi email thông báo đã được thêm vào hệ thống
     * @param string $to Email người nhận
     * @param string $fullname Tên người nhận
     * @param string $employeeId Mã nhân viên
     * @return bool
     */
    public function sendEmployeeAddedEmail($to, $fullname, $employeeId)
    {
        $subject = "Bạn đã được thêm vào HRM System";
        $body = $this->getEmployeeAddedEmailTemplate($fullname, $employeeId);
        return $this->sendEmail($to, $subject, $body);
    }

    /**
     * Core function để gửi email qua SMTP
     * @param string $to Email người nhận
     * @param string $subject Tiêu đề
     * @param string $body Nội dung HTML
     * @return bool
     */
    private function sendEmail($to, $subject, $body)
    {
        try {
            // Headers cho email HTML
            $headers = [
                'MIME-Version: 1.0',
                'Content-type: text/html; charset=' . $this->config['charset'],
                'From: ' . $this->config['from_name'] . ' <' . $this->config['from_email'] . '>',
                'Reply-To: ' . $this->config['from_email'],
                'X-Mailer: PHP/' . phpversion()
            ];

            // Sử dụng stream_socket_client để gửi qua SMTP
            return $this->sendViaSMTP($to, $subject, $body);
        } catch (Exception $e) {
            error_log("Email Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Gửi email qua SMTP socket (không cần PHPMailer)
     * @param string $to
     * @param string $subject
     * @param string $body
     * @return bool
     */
    private function sendViaSMTP($to, $subject, $body)
    {
        $config = $this->config;

        // Kết nối SMTP
        $smtpConnect = $config['secure'] === 'tls'
            ? "tcp://{$config['host']}:{$config['port']}"
            : "ssl://{$config['host']}:{$config['port']}";

        $smtp = stream_socket_client(
            $smtpConnect,
            $errno,
            $errstr,
            30,
            STREAM_CLIENT_CONNECT
        );

        if (!$smtp) {
            error_log("SMTP Connection Error: $errstr ($errno)");
            return false;
        }

        // Đọc response ban đầu
        $this->getResponse($smtp);

        // SMTP conversation
        $commands = [
            "EHLO {$config['host']}\r\n",
            "STARTTLS\r\n" // Chỉ dùng nếu TLS
        ];

        foreach ($commands as $command) {
            if ($config['secure'] !== 'tls' && strpos($command, 'STARTTLS') !== false) {
                continue; // Skip STARTTLS nếu dùng SSL
            }

            fwrite($smtp, $command);
            $response = $this->getResponse($smtp);

            // Nâng cấp lên TLS sau STARTTLS
            if (strpos($command, 'STARTTLS') !== false) {
                stream_socket_enable_crypto($smtp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                fwrite($smtp, "EHLO {$config['host']}\r\n");
                $this->getResponse($smtp);
            }
        }

        // Authentication
        fwrite($smtp, "AUTH LOGIN\r\n");
        $this->getResponse($smtp);

        fwrite($smtp, base64_encode($config['username']) . "\r\n");
        $this->getResponse($smtp);

        fwrite($smtp, base64_encode($config['password']) . "\r\n");
        $this->getResponse($smtp);

        // Gửi email
        fwrite($smtp, "MAIL FROM: <{$config['from_email']}>\r\n");
        $this->getResponse($smtp);

        fwrite($smtp, "RCPT TO: <$to>\r\n");
        $this->getResponse($smtp);

        fwrite($smtp, "DATA\r\n");
        $this->getResponse($smtp);

        // Email headers và body
        $emailContent = "From: {$config['from_name']} <{$config['from_email']}>\r\n";
        $emailContent .= "To: $to\r\n";
        $emailContent .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        $emailContent .= "MIME-Version: 1.0\r\n";
        $emailContent .= "Content-Type: text/html; charset=UTF-8\r\n";
        $emailContent .= "\r\n";
        $emailContent .= $body;
        $emailContent .= "\r\n.\r\n";

        fwrite($smtp, $emailContent);
        $this->getResponse($smtp);

        // Đóng kết nối
        fwrite($smtp, "QUIT\r\n");
        fclose($smtp);

        return true;
    }

    /**
     * Đọc response từ SMTP server
     * @param resource $smtp
     * @return string
     */
    private function getResponse($smtp)
    {
        $response = '';
        while ($line = fgets($smtp, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        return $response;
    }

    /**
     * Template email xác thực đăng ký
     */
    private function getVerificationEmailTemplate($fullname, $verificationLink)
    {
        return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Xác thực tài khoản</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>' . htmlspecialchars($fullname) . '</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>HRM System</strong>!</p>
            <p>Để hoàn tất quá trình đăng ký, vui lòng nhấn vào nút bên dưới để xác thực email của bạn:</p>
            <p style="text-align: center;">
                <a href="' . $verificationLink . '" class="button">✅ Xác thực tài khoản</a>
            </p>
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="background: #fff; padding: 10px; border-left: 4px solid #667eea; word-break: break-all;">
                ' . $verificationLink . '
            </p>
            <p><strong>Lưu ý:</strong> Link xác thực có hiệu lực trong <strong>24 giờ</strong>.</p>
            <p>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
            <p>© 2025 HRM System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>';
    }

    /**
     * Template email tài khoản mới (admin tạo)
     */
    private function getNewAccountEmailTemplate($fullname, $username, $tempPassword)
    {
        $passwordSection = $tempPassword
            ? '<p>Mật khẩu tạm thời: <strong style="background: #ffe6e6; padding: 5px 10px;">' . htmlspecialchars($tempPassword) . '</strong></p>
               <p><strong>⚠️ Quan trọng:</strong> Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu!</p>'
            : '<p>Vui lòng liên hệ quản trị viên để nhận mật khẩu.</p>';

        return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Tài khoản HRM System</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>' . htmlspecialchars($fullname) . '</strong>,</p>
            <p>Quản trị viên đã tạo tài khoản cho bạn tại <strong>HRM System</strong>.</p>
            <div class="info-box">
                <p><strong>Thông tin đăng nhập:</strong></p>
                <p>👤 Username: <strong>' . htmlspecialchars($username) . '</strong></p>
                ' . $passwordSection . '
            </div>
            <p style="text-align: center;">
                <a href="https://alexstudio.id.vn/" class="button">🚀 Đăng nhập ngay</a>
            </p>
            <p><strong>Hướng dẫn:</strong></p>
            <ol>
                <li>Truy cập website HRM System</li>
                <li>Đăng nhập bằng username và mật khẩu trên</li>
                <li>Đổi mật khẩu mới để bảo mật</li>
            </ol>
        </div>
        <div class="footer">
            <p>© 2025 HRM System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>';
    }

    /**
     * Template email thông báo được thêm vào hệ thống
     */
    private function getEmployeeAddedEmailTemplate($fullname, $employeeId)
    {
        return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4caf50; }
        .button { display: inline-block; padding: 15px 30px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎊 Chào mừng bạn!</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>' . htmlspecialchars($fullname) . '</strong>,</p>
            <p>Bạn đã được thêm vào hệ thống quản lý nhân sự <strong>HRM System</strong>!</p>
            <div class="info-box">
                <p><strong>Thông tin của bạn:</strong></p>
                <p>🆔 Mã nhân viên: <strong>' . htmlspecialchars($employeeId) . '</strong></p>
                <p>📧 Email liên hệ: Email này</p>
            </div>
            <p>Nếu bạn chưa có tài khoản đăng nhập, vui lòng liên hệ quản trị viên để:</p>
            <ul>
                <li>Nhận thông tin đăng nhập</li>
                <li>Hoặc đăng ký tài khoản mới</li>
            </ul>
            <p style="text-align: center;">
                <a href="https://alexstudio.id.vn/" class="button">🌐 Truy cập hệ thống</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2025 HRM System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>';
    }
}
