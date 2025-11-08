<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực Email - HRM System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }

        .icon {
            font-size: 80px;
            margin-bottom: 20px;
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }

        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .loading {
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .success {
            color: #4caf50;
        }

        .error {
            color: #f44336;
        }

        .info-box {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
            text-align: left;
        }
    </style>
</head>

<body>
    <div class="container" id="container">
        <div class="loading"></div>
        <h1>Đang xác thực...</h1>
        <p>Vui lòng chờ trong giây lát</p>
    </div>

    <script>
        // Lấy token từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            showError('Token không hợp lệ', 'Vui lòng kiểm tra lại link xác thực trong email.');
        } else {
            verifyEmail(token);
        }

        async function verifyEmail(token) {
            try {
                const response = await fetch(`./api.php/auth/verify/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    showSuccess(data.message, data.data);
                } else {
                    showError('Xác thực thất bại', data.message || 'Token không hợp lệ hoặc đã hết hạn.');
                }
            } catch (error) {
                console.error('Verification error:', error);
                showError('Lỗi kết nối', 'Không thể kết nối đến server. Vui lòng thử lại sau.');
            }
        }

        function showSuccess(message, userData) {
            const container = document.getElementById('container');
            container.innerHTML = `
                <div class="icon">✅</div>
                <h1 class="success">Xác thực thành công!</h1>
                <p>${message}</p>
                ${userData ? `
                    <div class="info-box">
                        <p><strong>Username:</strong> ${userData.username}</p>
                        <p><strong>Email:</strong> ${userData.email}</p>
                    </div>
                ` : ''}
                <p>Bạn có thể đăng nhập vào hệ thống ngay bây giờ.</p>
                <a href="index.html" class="button">🚀 Đăng nhập ngay</a>
            `;
        }

        function showError(title, message) {
            const container = document.getElementById('container');
            container.innerHTML = `
                <div class="icon">❌</div>
                <h1 class="error">${title}</h1>
                <p>${message}</p>
                <div class="info-box">
                    <p><strong>Có thể do:</strong></p>
                    <ul style="text-align: left; margin-left: 20px;">
                        <li>Token đã hết hạn (>24 giờ)</li>
                        <li>Token không đúng</li>
                        <li>Tài khoản đã được xác thực trước đó</li>
                    </ul>
                </div>
                <a href="index.html" class="button">🏠 Về trang chủ</a>
            `;
        }
    </script>
</body>

</html>