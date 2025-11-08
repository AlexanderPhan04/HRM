# 📧 Hướng dẫn Email Verification System

## 🎯 **TỔNG QUAN**

Hệ thống HRM đã được tích hợp tính năng xác thực email với các chức năng:

1. ✅ **Đăng ký với email verification** - Người dùng phải xác thực email trước khi đăng nhập
2. ✅ **Gửi email tự động khi admin thêm nhân viên**
3. ✅ **Tạo tài khoản tự động cho nhân viên mới**

---

## 📋 **CÁC FILE ĐÃ TẠO/SỬA**

### **Mới tạo:**

- `app/Config/Email.php` - Cấu hình SMTP Gmail
- `app/Services/EmailService.php` - Service gửi email
- `database/migrations/002_add_email_verification.sql` - Migration database
- `verify.php` - Trang xác thực email
- `docAccout/SMTP.md` - Thông tin SMTP credentials

### **Đã cập nhật:**

- `app/Models/UserModel.php` - Thêm methods cho email verification
- `app/Controllers/AuthController.php` - Đăng ký + login với email verification
- `app/Controllers/EmployeeController.php` - Gửi email khi thêm nhân viên
- `api.php` - Thêm route `/api/auth/verify/:token`

---

## ⚙️ **CẤU HÌNH**

### **1. Cập nhật Email Config**

Sửa file `app/Config/Email.php`:

```php
private $smtp_username = "your-email@gmail.com"; // ← Thay email của bạn
private $from_email = "your-email@gmail.com";    // ← Thay email của bạn
private $from_name = "HRM System";                // ← Tên hiển thị
```

**App Password đã có sẵn:** `aadv hohd xbhu lmdi`

### **2. Import Database Migration**

```bash
# Kết nối MySQL
mysql -u root -p

# Import migration
source database/migrations/002_add_email_verification.sql

# Hoặc dùng phpMyAdmin
# Copy nội dung file 002_add_email_verification.sql và chạy
```

**Migration sẽ thêm:**

- Column `email` (VARCHAR 255)
- Column `email_verified` (BOOLEAN)
- Column `verification_token` (VARCHAR 64)
- Column `token_expires_at` (DATETIME)
- Column `created_at` (TIMESTAMP)
- Column `updated_at` (TIMESTAMP)

---

## 🚀 **CÁCH SỬ DỤNG**

### **TÌNH HUỐNG 1: Người dùng tự đăng ký**

#### **Frontend - Form đăng ký:**

```javascript
// Thêm field email vào form đăng ký
const registerData = {
  username: "john_doe",
  password: "securepass123",
  fullname: "John Doe",
  email: "john@example.com", // ← REQUIRED
  role: "employee",
};

fetch("./api.php/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(registerData),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      alert("Đăng ký thành công! Kiểm tra email để xác thực.");
    }
  });
```

#### **Quy trình:**

1. User điền form đăng ký (username, password, fullname, **email**)
2. Click "Đăng ký"
3. Backend:
   - Tạo user trong DB với `email_verified = FALSE`
   - Tạo `verification_token` (64 ký tự random)
   - Set `token_expires_at` = 24 giờ từ bây giờ
   - Gửi email với link: `https://alexstudio.id.vn/verify.php?token=XXX`
4. User nhận email, click link xác thực
5. `verify.php` gọi API `/api/auth/verify/:token`
6. Backend set `email_verified = TRUE`, xóa token
7. User có thể đăng nhập

---

### **TÌNH HUỐNG 2: Admin thêm nhân viên (Đã có tài khoản)**

#### **Quy trình:**

1. Admin thêm nhân viên mới qua form "Thêm nhân viên"
2. Nhập email: `existing@example.com` (email đã đăng ký trước đó)
3. Backend:
   - Kiểm tra email đã tồn tại trong `users` table → Có
   - Tạo nhân viên trong `employees` table
   - Gửi email thông báo: "Bạn đã được thêm vào HRM System"
4. Nhân viên nhận email, đăng nhập bằng tài khoản hiện có

**Email template:**

- Subject: "Bạn đã được thêm vào HRM System"
- Body: Thông báo mã nhân viên, link đăng nhập

---

### **TÌNH HUỐNG 3: Admin thêm nhân viên (Chưa có tài khoản)**

#### **Quy trình:**

1. Admin thêm nhân viên mới
2. Nhập email: `newemployee@example.com` (chưa có trong `users` table)
3. Backend:
   - Kiểm tra email → Không tồn tại
   - **Tự động tạo tài khoản:**
     - Username: `newemployee` (từ email hoặc tên)
     - Password: Random 8 ký tự (ví dụ: `a3f7b9e2`)
     - Email: `newemployee@example.com`
     - `email_verified = FALSE` (nếu muốn verify) hoặc `TRUE` (nếu trust admin)
   - Tạo nhân viên trong `employees` table
   - Gửi email với thông tin đăng nhập
4. Nhân viên nhận email với:
   - Username
   - Mật khẩu tạm thời
   - Link đăng nhập
5. Nhân viên đăng nhập và đổi mật khẩu

**Email template:**

- Subject: "Tài khoản HRM System của bạn"
- Body: Username, password tạm, link đăng nhập

---

## 🔧 **API ENDPOINTS**

### **1. Register với Email**

```http
POST /api.php/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "password": "securepass123",
    "fullname": "John Doe",
    "email": "john@example.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "user_id": 5,
    "email_sent": true
  }
}
```

**Response (Email đã tồn tại):**

```json
{
  "success": false,
  "message": "Email already exists",
  "data": null
}
```

---

### **2. Verify Email**

```http
GET /api.php/auth/verify/:token
```

**Example:**

```http
GET /api.php/auth/verify/a1b2c3d4e5f6...
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Email verified successfully! You can now login.",
  "data": {
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Response (Token hết hạn):**

```json
{
  "success": false,
  "message": "Invalid or expired verification token",
  "data": null
}
```

---

### **3. Login (Kiểm tra email verified)**

```http
POST /api.php/auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "securepass123"
}
```

**Response (Email chưa verify):**

```json
{
  "success": false,
  "message": "Please verify your email before logging in. Check your inbox.",
  "data": null
}
```

**Response (Success):**

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": { ... },
        "token": "..."
    }
}
```

---

## 📧 **EMAIL TEMPLATES**

### **1. Email xác thực đăng ký**

**Gửi khi:** User đăng ký tài khoản mới

**Nội dung:**

- Tiêu đề: "🎉 Xác thực tài khoản"
- Nút CTA: "✅ Xác thực tài khoản"
- Link: `https://alexstudio.id.vn/verify.php?token=XXX`
- Thời gian hết hạn: 24 giờ

---

### **2. Email tài khoản mới (Admin tạo)**

**Gửi khi:** Admin thêm nhân viên chưa có tài khoản

**Nội dung:**

- Tiêu đề: "🔐 Tài khoản HRM System"
- Username: `john_doe`
- Password tạm: `a3f7b9e2`
- Cảnh báo: "Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu"

---

### **3. Email thông báo được thêm vào hệ thống**

**Gửi khi:** Admin thêm nhân viên đã có tài khoản

**Nội dung:**

- Tiêu đề: "🎊 Chào mừng bạn!"
- Mã nhân viên: `EMP005`
- Hướng dẫn: Đăng nhập bằng tài khoản hiện có

---

## 🧪 **TEST**

### **Test 1: Đăng ký với email**

```bash
curl -X POST http://localhost/api.php/auth/register \
-H "Content-Type: application/json" \
-d '{
    "username": "testuser",
    "password": "test123",
    "fullname": "Test User",
    "email": "test@example.com"
}'
```

**Kiểm tra:**

1. Check database: `email_verified` = 0, có `verification_token`
2. Check inbox: Có nhận email xác thực
3. Click link trong email → Redirect đến `verify.php`

---

### **Test 2: Xác thực email**

```bash
# Lấy token từ database
mysql> SELECT verification_token FROM users WHERE email = 'test@example.com';

# Test API
curl -X GET http://localhost/api.php/auth/verify/TOKEN_HERE
```

**Kiểm tra:**

1. Response: `"Email verified successfully!"`
2. Database: `email_verified` = 1, `verification_token` = NULL

---

### **Test 3: Login trước khi verify**

```bash
curl -X POST http://localhost/api.php/auth/login \
-H "Content-Type: application/json" \
-d '{
    "username": "testuser",
    "password": "test123"
}'
```

**Kết quả mong đợi:**

```json
{
  "success": false,
  "message": "Please verify your email before logging in. Check your inbox."
}
```

---

### **Test 4: Admin thêm nhân viên**

```bash
curl -X POST http://localhost/api.php/employees \
-H "Content-Type: application/json" \
-d '{
    "name": "New Employee",
    "email": "newemployee@example.com",
    "phone": "0123456789",
    "department_id": 1,
    "position_id": 2,
    "salary": 10000000,
    "hire_date": "2025-11-08"
}'
```

**Kiểm tra:**

1. Nhân viên được tạo trong `employees` table
2. Tài khoản được tạo trong `users` table (nếu email chưa tồn tại)
3. Email được gửi đến `newemployee@example.com`

---

## ⚠️ **LƯU Ý QUAN TRỌNG**

### **Gmail SMTP:**

1. **Bật 2-Step Verification** trong Google Account
2. **Tạo App Password:**

   - Google Account → Security → 2-Step Verification → App passwords
   - Chọn "Mail" và "Other (Custom name)"
   - Copy password (16 ký tự)
   - Paste vào `Email.php`

3. **Nếu gửi email thất bại:**
   - Check firewall: Allow port 587 (TLS)
   - Check Gmail quota: Max 500 emails/day
   - Check logs: `error_log()` trong EmailService

### **Token Security:**

- Token hết hạn sau 24 giờ
- Mỗi user chỉ có 1 token active
- Token bị xóa sau khi verify thành công

### **Production:**

- **QUAN TRỌNG:** Thay `your-email@gmail.com` trong `Email.php`
- Cập nhật domain trong email templates: `alexstudio.id.vn`
- Test gửi email trên hosting (một số hosting block port 587)

---

## 🐛 **TROUBLESHOOTING**

### **Email không gửi được:**

```php
// Check error log
tail -f /var/log/apache2/error.log  # Linux
# Hoặc check PHP error log
```

**Nguyên nhân thường gặp:**

1. Sai SMTP credentials
2. Port 587 bị block
3. Gmail block "less secure apps"
4. Hosting không allow fsockopen/stream_socket_client

**Giải pháp:**

```php
// Thử đổi sang SSL port 465
private $smtp_port = 465;
private $smtp_secure = "ssl";
```

---

### **Token expired:**

**Nguyên nhân:** Đã quá 24 giờ kể từ lúc đăng ký

**Giải pháp:** Tạo API resend verification email

---

### **Email vào Spam:**

**Giải pháp:**

1. Setup SPF record cho domain
2. Setup DKIM
3. Dùng email service chuyên nghiệp (SendGrid, Mailgun)

---

## 🎓 **KẾT LUẬN**

Hệ thống email verification đã hoàn chỉnh với:

- ✅ Đăng ký với xác thực email
- ✅ Gửi email tự động khi admin thêm nhân viên
- ✅ Tạo tài khoản tự động cho nhân viên mới
- ✅ Template email đẹp với HTML/CSS
- ✅ Security: Token expiration, password hashing

**Next steps:**

- Thêm "Resend verification email"
- Thêm "Forgot password" với email reset
- Thêm email notification cho attendance, leave, etc.

---

**Tạo bởi:** GitHub Copilot  
**Ngày:** 2025-11-08  
**SMTP:** Gmail App Password
