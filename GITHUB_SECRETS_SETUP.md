# 🔐 GitHub Secrets Setup - FTP Auto Deploy

## Bước 1: Thêm Secrets vào GitHub Repository

1. **Vào repository GitHub:**

   ```
   https://github.com/AlexanderPhan04/HRM
   ```

2. **Click:** `Settings` → `Secrets and variables` → `Actions`

3. **Click:** `New repository secret`

4. **Thêm 4 secrets sau:**

### Secret 1: FTP_SERVER

```
Name: FTP_SERVER
Value: free02.123host.vn
```

### Secret 2: FTP_USERNAME

```
Name: FTP_USERNAME
Value: myweb@alexstudio.id.vn
```

### Secret 3: FTP_PASSWORD

```
Name: FTP_PASSWORD
Value: CEsAL4gY6g
```

### Secret 4: FTP_REMOTE_PATH

```
Name: FTP_REMOTE_PATH
Value: /home/qeuvbmow/domains/alexstudio.id.vn
```

---

## Bước 2: Test Auto Deploy

1. **Commit và push code lên GitHub:**

   ```bash
   git add .
   git commit -m "feat: Add auto FTP deployment"
   git push origin main
   ```

2. **Xem quá trình deploy:**
   - Vào GitHub → Actions tab
   - Click vào workflow đang chạy
   - Xem log của job "Deploy to Production (FTP)"

---

## Bước 3: Sau khi Deploy thành công

### ⚠️ CÁC BƯỚC PHẢI LÀM THỦ CÔNG:

1. **Import database vào hosting:**

   - Vào phpMyAdmin trên hosting
   - Tạo database: `hrm_system`
   - Import file: `database/migrations/001_initial_schema.sql`

2. **Cập nhật Database config:**

   - Edit file: `/home/qeuvbmow/domains/alexstudio.id.vn/app/Config/Database.php`
   - Thay đổi thông tin kết nối database của hosting

3. **Test website:**

   ```
   https://alexstudio.id.vn
   ```

   Login với:

   - Username: `admin`
   - Password: `admin123`

---

## Cấu trúc sau khi Deploy

```
/home/qeuvbmow/domains/alexstudio.id.vn/
├── app/                          # Backend MVC (bảo mật - ngoài public_html)
│   ├── Config/
│   ├── Controllers/
│   ├── Models/
│   └── Core/
├── database/                     # SQL migrations (bảo mật)
│   └── migrations/
├── .htaccess                     # Chặn truy cập root
└── public_html/                  # Web root
    ├── api.php                   # API entry point (đã sửa paths)
    ├── index.html
    └── assets/
        ├── css/
        └── js/
```

---

## Kiểm tra Secrets đã thêm đúng chưa

Vào GitHub repository:

```
Settings → Secrets and variables → Actions → Repository secrets
```

Phải thấy 4 secrets:

- ✅ FTP_SERVER
- ✅ FTP_USERNAME
- ✅ FTP_PASSWORD
- ✅ FTP_REMOTE_PATH

---

## Lưu ý bảo mật

- ⚠️ **KHÔNG BAO GIỜ** commit file `FTPHostAccout.md` lên GitHub
- ⚠️ Đã thêm vào `.gitignore`: `FTPHostAccout.md`
- ⚠️ Chỉ dùng GitHub Secrets để lưu thông tin nhạy cảm
- ✅ Secrets được mã hóa và không hiển thị trong logs

---

## Workflow tự động

Mỗi khi push lên branch `main`:

1. ✅ Run tests (PHP, Database, Security)
2. ✅ Build deployment package
3. ✅ Auto deploy lên hosting qua FTP
4. ✅ Cấu trúc files được sắp xếp đúng (public_html vs root)

---

## Troubleshooting

### Lỗi: FTP connection failed

```
→ Kiểm tra FTP_SERVER và credentials trong Secrets
→ Test FTP bằng FileZilla trước
```

### Lỗi: Files uploaded sai vị trí

```
→ Kiểm tra FTP_REMOTE_PATH đúng chưa
→ Phải là: /home/qeuvbmow/domains/alexstudio.id.vn
```

### Lỗi: API không hoạt động sau deploy

```
→ Kiểm tra file api.php trong public_html/
→ Đảm bảo paths trỏ đúng: dirname(__DIR__) để lên 1 cấp
→ Kiểm tra Database.php có thông tin kết nối đúng không
```
