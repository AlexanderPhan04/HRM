# ✅ Email Verification Implementation Checklist

## 📋 **TRƯỚC KHI DEPLOY**

### **1. Cấu hình Gmail SMTP**

- [ ] Bật 2-Step Verification trong Google Account
- [ ] Tạo App Password (đã có: `aadv hohd xbhu lmdi`)
- [ ] Cập nhật email trong `app/Config/Email.php`:
  ```php
  private $smtp_username = "your-email@gmail.com"; // ← TODO
  private $from_email = "your-email@gmail.com";    // ← TODO
  ```

### **2. Import Database Migration**

- [ ] Connect MySQL: `mysql -u root -p`
- [ ] Run migration:
  ```sql
  USE hrm_system;
  source database/migrations/002_add_email_verification.sql;
  ```
- [ ] Verify columns added:
  ```sql
  DESCRIBE users;
  -- Phải có: email, email_verified, verification_token, token_expires_at
  ```

### **3. Test Local**

- [ ] Test đăng ký với email
- [ ] Check email đã nhận (inbox/spam)
- [ ] Click link verify → Check `verify.php` hoạt động
- [ ] Test login trước khi verify → Phải bị chặn
- [ ] Test login sau khi verify → Phải thành công

### **4. Test Admin thêm nhân viên**

- [ ] Thêm nhân viên mới (email chưa tồn tại)
- [ ] Check tài khoản tự động tạo
- [ ] Check email gửi đi (có username + password)
- [ ] Thêm nhân viên (email đã tồn tại)
- [ ] Check email thông báo gửi đi

---

## 🚀 **DEPLOY LÊN HOSTING**

### **1. Upload files**

- [ ] Upload `app/Config/Email.php` (đã sửa email)
- [ ] Upload `app/Services/EmailService.php`
- [ ] Upload `app/Models/UserModel.php` (updated)
- [ ] Upload `app/Controllers/AuthController.php` (updated)
- [ ] Upload `app/Controllers/EmployeeController.php` (updated)
- [ ] Upload `api.php` (updated với verify route)
- [ ] Upload `verify.php`
- [ ] Upload `database/migrations/002_add_email_verification.sql`

### **2. Cập nhật database production**

- [ ] Login phpMyAdmin hosting
- [ ] Select database `qeuvbmow_hrm_system`
- [ ] Import `002_add_email_verification.sql`
- [ ] Verify columns added

### **3. Test trên production**

- [ ] Test đăng ký: `https://alexstudio.id.vn/`
- [ ] Check email nhận được
- [ ] Test verify link
- [ ] Test login

### **4. Kiểm tra logs**

- [ ] Check PHP error log nếu email không gửi
- [ ] Check hosting có block port 587 không

---

## 🧪 **TEST CASES**

### **Test Case 1: Đăng ký thành công**

```
Input:
- Username: testuser
- Password: test123
- Email: test@example.com

Expected:
1. ✅ User created in DB với email_verified = FALSE
2. ✅ Email gửi đến test@example.com
3. ✅ Response: "Please check your email to verify your account"
```

### **Test Case 2: Email đã tồn tại**

```
Input:
- Email đã có trong DB

Expected:
❌ Response: "Email already exists"
```

### **Test Case 3: Verify email thành công**

```
Input:
- Click link trong email

Expected:
1. ✅ Redirect đến verify.php
2. ✅ Show "Xác thực thành công!"
3. ✅ DB: email_verified = TRUE, token = NULL
```

### **Test Case 4: Login trước khi verify**

```
Input:
- Username + password đúng
- Nhưng email_verified = FALSE

Expected:
❌ Response: "Please verify your email before logging in"
```

### **Test Case 5: Login sau khi verify**

```
Input:
- Username + password đúng
- email_verified = TRUE

Expected:
✅ Login thành công, nhận token
```

### **Test Case 6: Admin thêm nhân viên (chưa có account)**

```
Input:
- Admin thêm employee với email mới

Expected:
1. ✅ Employee created
2. ✅ User account auto-created
3. ✅ Email gửi với username + temp password
```

### **Test Case 7: Admin thêm nhân viên (đã có account)**

```
Input:
- Admin thêm employee với email đã tồn tại

Expected:
1. ✅ Employee created
2. ✅ Email thông báo gửi (không tạo account mới)
```

---

## ⚙️ **CẤU HÌNH NÂ CƯỜNG (OPTIONAL)**

### **1. Thay đổi thời gian hết hạn token**

File: `app/Models/UserModel.php` line 27

```php
$tokenExpiresAt = date('Y-m-d H:i:s', strtotime('+24 hours')); // ← Đổi thành +48 hours, +7 days, etc.
```

### **2. Thay đổi domain trong email**

File: `app/Services/EmailService.php` line 29

```php
$verificationLink = "https://YOUR-DOMAIN.com/verify.php?token=" . $verificationToken;
```

### **3. Thay đổi SMTP port (nếu 587 bị block)**

File: `app/Config/Email.php`

```php
private $smtp_port = 465; // SSL instead of TLS
private $smtp_secure = "ssl";
```

### **4. Disable email verification (cho testing)**

File: `app/Controllers/AuthController.php` line 42

```php
// Comment dòng này để bỏ qua kiểm tra email verified
// if (isset($user['email']) && !empty($user['email']) && !$user['email_verified']) {
//     $this->sendError('Please verify your email before logging in. Check your inbox.', 403);
// }
```

---

## 🐛 **TROUBLESHOOTING**

### **Email không gửi được:**

**Kiểm tra 1: SMTP credentials**

```php
// app/Config/Email.php
var_dump($this->smtp_username); // Phải là email Gmail của bạn
var_dump($this->smtp_password); // Phải là App Password (16 ký tự)
```

**Kiểm tra 2: Firewall/Port**

```bash
telnet smtp.gmail.com 587
# Nếu connect được → OK
# Nếu timeout → Port bị block
```

**Kiểm tra 3: PHP extension**

```php
<?php
phpinfo();
// Tìm: openssl, sockets
// Phải enabled
```

**Giải pháp:** Dùng PHPMailer thay vì native socket

```bash
composer require phpmailer/phpmailer
```

---

### **Token expired:**

**Tạo API resend verification:**

File: `app/Controllers/AuthController.php`

```php
public function resendVerification()
{
    $data = $this->getJsonInput();
    $email = $data['email'];

    $user = $this->userModel->findByEmail($email);

    if (!$user) {
        $this->sendError('Email not found', 404);
    }

    if ($user['email_verified']) {
        $this->sendError('Email already verified', 400);
    }

    // Tạo token mới
    $newToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

    // Update DB...
    // Send email...

    $this->sendSuccess(null, 'Verification email resent');
}
```

---

## 📊 **DATABASE SCHEMA (Sau migration)**

```sql
users table:
+--------------------+---------------+------+-----+---------+
| Field              | Type          | Null | Key | Default |
+--------------------+---------------+------+-----+---------+
| id                 | int           | NO   | PRI | NULL    |
| username           | varchar(50)   | NO   | UNI | NULL    |
| password           | varchar(255)  | NO   |     | NULL    |
| fullname           | varchar(100)  | NO   |     | NULL    |
| email              | varchar(255)  | YES  | MUL | NULL    |  ← NEW
| email_verified     | tinyint(1)    | YES  |     | 0       |  ← NEW
| verification_token | varchar(64)   | YES  | MUL | NULL    |  ← NEW
| token_expires_at   | datetime      | YES  |     | NULL    |  ← NEW
| role               | varchar(20)   | NO   |     | NULL    |
| created_at         | timestamp     | YES  |     | NOW()   |  ← NEW
| updated_at         | timestamp     | YES  |     | NOW()   |  ← NEW
+--------------------+---------------+------+-----+---------+
```

---

## 🎯 **KẾT QUẢ MONG ĐỢI**

Sau khi hoàn thành checklist:

✅ **Frontend:**

- Form đăng ký có trường Email
- Sau register, hiện message "Check your email"

✅ **Backend:**

- User được tạo với email_verified = FALSE
- Email gửi tự động đến inbox
- Verify API hoạt động
- Login check email verified

✅ **Email:**

- Template đẹp với HTML/CSS
- Link verify hoạt động
- Auto-send khi admin thêm employee

✅ **Security:**

- Token hết hạn sau 24h
- Password hashed
- Email validated

---

**Status:** ⏳ Pending implementation  
**Ước tính:** 30-45 phút để setup + test
