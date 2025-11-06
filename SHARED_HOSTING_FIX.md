# 🔧 FIX: Shared Hosting Deployment (Tất cả trong public_html/)

## ❌ SAI LẦM TRƯỚC ĐÂY:

Cố gắng đặt `app/` và `database/` **NGOÀI** `public_html/`.

**VẤN ĐỀ:** Shared hosting **KHÔNG CHO PHÉP** truy cập ngoài `public_html/`!

---

## ✅ GIẢI PHÁP ĐÚNG:

### **Tất cả files PHẢI TRONG public_html/**

```
/home/qeuvbmow/domains/alexstudio.id.vn/public_html/
├── index.html           ✅ Frontend
├── api.php              ✅ API entry (ROOT_PATH = __DIR__)
├── assets/              ✅ Public files
│   ├── css/
│   └── js/
├── app/                 ✅ Backend (BẢO VỆ bằng .htaccess)
│   ├── .htaccess        🔒 Deny from all
│   ├── Config/
│   ├── Controllers/
│   ├── Models/
│   └── Core/
└── database/            ✅ SQL files (BẢO VỆ bằng .htaccess)
    ├── .htaccess        🔒 Deny from all
    └── migrations/
```

---

## 🔒 BẢO MẬT:

### **File: `public_html/app/.htaccess`**

```apache
# Chặn truy cập trực tiếp vào backend code
Order Deny,Allow
Deny from all
```

**Kết quả:**

- ❌ `https://alexstudio.id.vn/app/Config/Database.php` → 403 Forbidden
- ✅ `api.php` vẫn `require_once` được file

### **File: `public_html/database/.htaccess`**

```apache
# Chặn truy cập trực tiếp vào database files
Order Deny,Allow
Deny from all
```

**Kết quả:**

- ❌ `https://alexstudio.id.vn/database/migrations/001_initial_schema.sql` → 403 Forbidden

---

## 📝 THAY ĐỔI TRONG CI/CD:

### **1. Đường dẫn trong api.php:**

**TRƯỚC (SAI):**

```php
define('ROOT_PATH', dirname(__DIR__)); // Lên 1 cấp - SAI!
define('APP_PATH', ROOT_PATH . '/app');
```

**SAU (ĐÚNG):**

```php
define('ROOT_PATH', __DIR__); // public_html/
define('APP_PATH', ROOT_PATH . '/app'); // public_html/app/
```

---

### **2. FTP Upload path:**

**TRƯỚC (SAI):**

```yaml
server-dir: /home/qeuvbmow/domains/alexstudio.id.vn/
local-dir: ./deploy/
# Kết quả: app/ nằm ngoài public_html/ → Không truy cập được!
```

**SAU (ĐÚNG):**

```yaml
server-dir: /home/qeuvbmow/domains/alexstudio.id.vn/public_html/
local-dir: ./deploy/
# Kết quả: Tất cả vào public_html/
```

---

### **3. Cấu trúc deploy:**

**TRƯỚC:**

```
deploy/
├── public_html/    ← Upload vào public_html/
├── app/            ← Upload vào root (SAI!)
└── database/       ← Upload vào root (SAI!)
```

**SAU:**

```
deploy/
├── index.html
├── api.php
├── assets/
├── app/            ← Tất cả cùng cấp
│   └── .htaccess   ← Bảo vệ
└── database/
    └── .htaccess   ← Bảo vệ
```

Upload toàn bộ `deploy/` vào `public_html/` → XONG!

---

## 🧪 TEST BẢO MẬT:

### **1. Test truy cập trực tiếp (phải bị chặn):**

```bash
# Phải trả về 403 Forbidden
curl https://alexstudio.id.vn/app/Config/Database.php
curl https://alexstudio.id.vn/database/migrations/001_initial_schema.sql
curl https://alexstudio.id.vn/app/Controllers/EmployeeController.php
```

### **2. Test API (phải hoạt động):**

```bash
# Phải trả về JSON
curl https://alexstudio.id.vn/api.php/employees
```

---

## 🚀 DEPLOY LẠI:

### **Bước 1: Xóa files cũ trên hosting**

Vào File Manager, xóa toàn bộ trong `public_html/`:

- ❌ Xóa folder `home/`
- ❌ Xóa folder `hostOld/`
- ❌ Xóa folder `cgi-bin/`
- ❌ Xóa tất cả files/folders khác

### **Bước 2: Push code mới**

```bash
git add .
git commit -m "fix: Deploy all files to public_html/ for shared hosting"
git push origin main
```

### **Bước 3: Kiểm tra kết quả**

1. **Xem GitHub Actions** → Đợi deploy xong
2. **Vào File Manager** → Kiểm tra cấu trúc:

   ```
   public_html/
   ├── index.html        ✅
   ├── api.php           ✅
   ├── assets/           ✅
   ├── app/              ✅ (có .htaccess)
   └── database/         ✅ (có .htaccess)
   ```

3. **Test website:**
   ```
   https://alexstudio.id.vn
   ```

---

## ⚠️ SAU KHI DEPLOY:

### **1. Import database:**

- Vào phpMyAdmin
- Import: `database/migrations/001_initial_schema.sql`

### **2. Cấu hình Database.php:**

Edit file trên hosting:

```
public_html/app/Config/Database.php
```

Sửa thành thông tin database của hosting.

### **3. Test bảo mật:**

```bash
# PHẢI LỖI 403:
curl https://alexstudio.id.vn/app/Config/Database.php
# Kết quả: 403 Forbidden ✅

# PHẢI HOẠT ĐỘNG:
curl https://alexstudio.id.vn/api.php/employees
# Kết quả: JSON data ✅
```

---

## 📊 SO SÁNH:

| Trường hợp                        | VPS/Dedicated                  | Shared Hosting                    |
| --------------------------------- | ------------------------------ | --------------------------------- |
| Có quyền truy cập ngoài web root? | ✅ CÓ                          | ❌ KHÔNG                          |
| Backend code đặt ở đâu?           | `/var/www/app/` (ngoài public) | `public_html/app/` (trong public) |
| Bảo mật backend?                  | Nằm ngoài web root             | `.htaccess` chặn truy cập         |
| Đường dẫn trong code?             | `dirname(__DIR__)`             | `__DIR__`                         |

---

## ✅ KẾT LUẬN:

**SHARED HOSTING = TẤT CẢ TRONG public_html/**

- ✅ Frontend: `public_html/index.html`
- ✅ API: `public_html/api.php`
- ✅ Assets: `public_html/assets/`
- ✅ Backend: `public_html/app/` (có `.htaccess` bảo vệ)
- ✅ Database: `public_html/database/` (có `.htaccess` bảo vệ)

**KHÔNG thể đặt files ngoài `public_html/` như VPS!**

---

**🎉 Bây giờ deploy đúng rồi!**
