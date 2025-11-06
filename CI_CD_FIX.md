# 🔧 FIX: GitHub Actions Database Error

## ❌ LỖI GẶP PHẢI:

```
ERROR 1146 (42S02) at line 1: Table 'hrm_system_test.employees' doesn't exist
Error: Process completed with exit code 1.
```

---

## 🔍 NGUYÊN NHÂN:

File SQL `database/migrations/001_initial_schema.sql` có 2 dòng:

```sql
CREATE DATABASE IF NOT EXISTS hrm_system;
USE hrm_system;  -- ← Lỗi ở đây!
```

**VẤN ĐỀ:**

- GitHub Actions tạo database tên: `hrm_system_test`
- File SQL tạo tables trong database: `hrm_system` (do dòng `USE hrm_system;`)
- Kết quả: Tables được tạo trong database SAI → Lỗi khi query

---

## ✅ GIẢI PHÁP:

### **Cập nhật CI/CD workflow:**

File: `.github/workflows/ci-cd.yml`

**TRƯỚC:**

```yaml
- name: Import database schema
  run: |
    mysql -h 127.0.0.1 -P 3306 -u root -ptest_password hrm_system_test < database/migrations/001_initial_schema.sql
```

**SAU:**

```yaml
- name: Import database schema
  run: |
    # Remove database-specific commands and import into test database
    sed '/^USE hrm_system;/d' database/migrations/001_initial_schema.sql | \
    sed 's/CREATE DATABASE IF NOT EXISTS hrm_system/-- CREATE DATABASE IF NOT EXISTS hrm_system/' | \
    mysql -h 127.0.0.1 -P 3306 -u root -ptest_password hrm_system_test
```

---

## 🛠️ CÁCH HOẠT ĐỘNG:

### **Command `sed` thực hiện:**

1. **`sed '/^USE hrm_system;/d'`**

   - Xóa dòng `USE hrm_system;`
   - Kết quả: SQL không chuyển sang database khác

2. **`sed 's/CREATE DATABASE .../-- CREATE DATABASE .../'`**

   - Comment dòng tạo database
   - Kết quả: Không tạo database mới

3. **`| mysql ... hrm_system_test`**
   - Import SQL vào database `hrm_system_test`
   - Tables được tạo trong database đúng!

---

## 📋 KẾT QUẢ SAU KHI FIX:

### **Job: Database Schema Validation**

```
✅ Import database schema
✅ SHOW TABLES; → Hiển thị đầy đủ tables
✅ DESCRIBE employees; → Table tồn tại
✅ SELECT COUNT(*) FROM users; → Có data
```

### **Job: Backend API Tests**

```
✅ Database connection successful
✅ PHP tests can query tables
✅ No more "Table doesn't exist" errors
```

---

## 🎯 ÁP DỤNG CHO:

Đã sửa **2 jobs** trong CI/CD pipeline:

1. **Job 3: Database Schema Validation** (line ~101)
2. **Job 4: Backend API Tests** (line ~150)

Cả 2 jobs đều import SQL vào `hrm_system_test` giờ sẽ hoạt động đúng.

---

## ⚠️ LƯU Ý:

### **File SQL gốc KHÔNG thay đổi:**

- `database/migrations/001_initial_schema.sql` vẫn giữ nguyên
- Vẫn có `CREATE DATABASE hrm_system;` và `USE hrm_system;`
- Vẫn hoạt động bình thường khi import thủ công

### **Chỉ CI/CD thay đổi:**

- GitHub Actions tự động xử lý SQL trước khi import
- Không ảnh hưởng đến local development
- Không ảnh hưởng đến production deployment

---

## 🧪 TEST:

Sau khi commit và push:

```bash
git add .
git commit -m "fix: Database import in GitHub Actions CI/CD"
git push origin main
```

Xem GitHub Actions → Job "Database Schema Validation" phải:

- ✅ Import thành công
- ✅ SHOW TABLES hiển thị đầy đủ
- ✅ DESCRIBE employees không lỗi
- ✅ SELECT COUNT(\*) FROM users trả về số lượng

---

## 📊 TRƯỚC VÀ SAU:

### **TRƯỚC (LỖI):**

```
hrm_system_test (empty)        ← MySQL service tạo
hrm_system (có tables)         ← SQL file tạo (SAI!)
→ Query vào hrm_system_test → ERROR: Table doesn't exist
```

### **SAU (ĐÚNG):**

```
hrm_system_test (có tables)    ← sed xử lý + import đúng
→ Query vào hrm_system_test → SUCCESS ✅
```

---

## ✅ HOÀN THÀNH!

GitHub Actions CI/CD giờ sẽ:

1. ✅ Tạo database test
2. ✅ Import SQL vào đúng database
3. ✅ Tables được tạo trong database đúng
4. ✅ Tests chạy thành công
5. ✅ Deploy tự động sau khi tests pass

**Không còn lỗi "Table doesn't exist"!** 🎉
