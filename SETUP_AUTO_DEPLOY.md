# 🚀 HƯỚNG DẪN SETUP AUTO DEPLOY - TIẾNG VIỆT

## Bước 1: Thêm GitHub Secrets (BẮT BUỘC)

### Vào GitHub repository:

```
https://github.com/AlexanderPhan04/HRM
```

### Click theo thứ tự:

1. `Settings` (góc phải trên)
2. `Secrets and variables` (menu bên trái)
3. `Actions`
4. `New repository secret` (nút xanh)

### Thêm 4 secrets sau (copy y nguyên):

#### Secret 1:

```
Name: FTP_SERVER
Secret: free02.123host.vn
```

Click `Add secret`

#### Secret 2:

```
Name: FTP_USERNAME
Secret: myweb@alexstudio.id.vn
```

Click `Add secret`

#### Secret 3:

```
Name: FTP_PASSWORD
Secret: CEsAL4gY6g
```

Click `Add secret`

#### Secret 4:

```
Name: FTP_REMOTE_PATH
Secret: /home/qeuvbmow/domains/alexstudio.id.vn
```

Click `Add secret`

✅ **XONG!** Giờ mỗi lần push code lên GitHub sẽ tự động deploy lên hosting.

---

## Bước 2: Setup Database trên Hosting (Chỉ làm 1 lần)

### 2.1. Vào phpMyAdmin

- Login vào hosting panel
- Mở phpMyAdmin

### 2.2. Tạo database

- Click `New` (bên trái)
- Tên database: `qeuvbmow_hrm` hoặc tên khác
- Collation: `utf8mb4_unicode_ci`
- Click `Create`

### 2.3. Import SQL

- Click vào database vừa tạo
- Tab `Import`
- Click `Choose File`
- Chọn file: `database/migrations/001_initial_schema.sql`
- Click `Go`
- Đợi import xong

✅ **XONG!** Database đã sẵn sàng.

---

## Bước 3: Cấu hình kết nối Database (Chỉ làm 1 lần)

### 3.1. Mở File Manager trên hosting

### 3.2. Vào folder:

```
/home/qeuvbmow/domains/alexstudio.id.vn/app/Config/
```

### 3.3. Edit file `Database.php`

Tìm dòng:

```php
private $host = "localhost";
private $db_name = "hrm_system";
private $username = "root";
private $password = "";
```

Sửa thành (thay bằng thông tin hosting của bạn):

```php
private $host = "localhost";              // Thường là localhost
private $db_name = "qeuvbmow_hrm";        // Tên database vừa tạo
private $username = "qeuvbmow_hrm";       // Username database
private $password = "password_cua_ban";   // Password database
```

**Lưu lại!**

✅ **XONG!** Website đã kết nối được database.

---

## Bước 4: Test Auto Deploy

### 4.1. Commit và push code:

```bash
git add .
git commit -m "feat: Setup auto deployment"
git push origin main
```

### 4.2. Xem quá trình deploy:

1. Vào: https://github.com/AlexanderPhan04/HRM
2. Click tab `Actions`
3. Click vào workflow đang chạy (dòng đầu tiên)
4. Xem log từng bước

### 4.3. Đợi deploy xong (khoảng 2-3 phút)

Khi thấy:

```
✅ PRODUCTION DEPLOYMENT SUCCESSFUL
```

Nghĩa là đã deploy thành công!

---

## Bước 5: Kiểm tra Website

### 5.1. Mở trình duyệt:

```
https://alexstudio.id.vn
```

### 5.2. Đăng nhập test:

- Username: `admin`
- Password: `admin123`

✅ **XONG!** Nếu login được nghĩa là mọi thứ hoạt động!

---

## 🎯 Từ giờ trở đi

### Mỗi lần muốn deploy code mới:

1. Sửa code trên local
2. Test trên Laragon
3. Commit:
   ```bash
   git add .
   git commit -m "mô tả thay đổi"
   git push origin main
   ```
4. **TỰ ĐỘNG DEPLOY!** Không cần làm gì thêm.
5. Đợi 2-3 phút rồi refresh website

---

## ❌ Gặp lỗi?

### Lỗi 1: GitHub Actions failed

**Xem log:** GitHub → Actions → Click vào workflow failed → Xem dòng lỗi

**Thường gặp:**

- Sai FTP credentials → Kiểm tra lại Secrets
- FTP server down → Thử lại sau vài phút

### Lỗi 2: Website bị lỗi sau deploy

**Kiểm tra:**

1. Database connection: Xem lại `app/Config/Database.php`
2. File permissions: Phải 755 cho folders, 644 cho files
3. Hosting logs: File Manager → logs/error_log

### Lỗi 3: API không hoạt động

**Kiểm tra file:**

```
public_html/api.php
```

Phải có dòng:

```php
define('ROOT_PATH', dirname(__DIR__));
```

Nếu sai, GitHub Actions sẽ tự sửa ở lần deploy tiếp theo.

---

## 📁 Cấu trúc Files sau Deploy

```
alexstudio.id.vn/
├── app/              ← Backend (ẨN - an toàn)
├── database/         ← SQL files (ẨN - an toàn)
└── public_html/      ← Website (CÔNG KHAI)
    ├── api.php
    ├── index.html
    └── assets/
```

---

## 🔐 Bảo mật

**✅ AN TOÀN:**

- FTP credentials chỉ lưu trong GitHub Secrets (mã hóa)
- Folder `app/` và `database/` nằm ngoài `public_html/`
- File `FTPHostAccout.md` KHÔNG được commit lên GitHub

**❌ NGUY HIỂM:**

- ĐỪNG commit passwords lên GitHub
- ĐỪNG share file `FTPHostAccout.md`
- ĐỪNG để `app/Config/Database.php` có passwords thật trên local

---

## 📞 Cần giúp?

1. Xem file `DEPLOYMENT_README.md` (chi tiết hơn)
2. Xem file `GITHUB_SECRETS_SETUP.md` (hướng dẫn Secrets)
3. Check GitHub Actions logs
4. Check hosting error logs

---

**🎉 CHÚC BẠN DEPLOY THÀNH CÔNG!**

Giờ chỉ cần `git push` là code tự động lên hosting!
