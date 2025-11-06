# ⚡ Hướng dẫn Incremental Deployment

## 🎯 **CÁCH HOẠT ĐỘNG**

### **Trước đây (Full Deployment):**

```
Mỗi lần deploy → Upload TẤT CẢ files
⏱️ Thời gian: 5-10 phút
📊 Bandwidth: 50-100 MB mỗi lần
```

### **Bây giờ (Incremental Deployment):**

```
Mỗi lần deploy → Chỉ upload files ĐÃ THAY ĐỔI
⏱️ Thời gian: 30 giây - 2 phút
📊 Bandwidth: 1-5 MB (tiết kiệm 90%+)
```

## 🔧 **CÔNG NGHỆ**

FTP-Deploy-Action sử dụng file **`.ftp-deploy-sync-state.json`** để:

1. **Lưu trạng thái** của lần deploy trước (hash của từng file)
2. **So sánh** với commit hiện tại
3. **Chỉ upload** files có hash khác (đã thay đổi)
4. **Tự động xóa** files đã xóa trong Git (nếu cấu hình)

## 📋 **CẤU HÌNH HIỆN TẠI**

```yaml
state-name: .ftp-deploy-sync-state.json # Lưu trạng thái
dry-run: false # Thực thi deploy (không phải test)
dangerous-clean-slate: false # KHÔNG xóa toàn bộ server
```

### **Ý nghĩa các tham số:**

| Tham số                 | Giá trị                       | Ý nghĩa                                 |
| ----------------------- | ----------------------------- | --------------------------------------- |
| `state-name`            | `.ftp-deploy-sync-state.json` | File lưu trạng thái (tự động tạo)       |
| `dry-run`               | `false`                       | `true` = Test, `false` = Deploy thật    |
| `dangerous-clean-slate` | `false`                       | `true` = Xóa TẤT CẢ trước khi deploy ⚠️ |

## 🚀 **VÍ DỤ THỰC TẾ**

### **Lần 1: Deploy đầu tiên (Full)**

```bash
git commit -m "Initial commit"
git push
```

**Kết quả:**

- Upload TẤT CẢ files (lần đầu)
- Tạo `.ftp-deploy-sync-state.json`
- Thời gian: ~5 phút

### **Lần 2: Sửa 1 file CSS**

```bash
# Sửa file assets/css/style.css
git add assets/css/style.css
git commit -m "fix: Update button color"
git push
```

**Kết quả:**

- ✅ Upload: `assets/css/style.css` (chỉ 1 file!)
- ⏭️ Bỏ qua: Tất cả files khác (không thay đổi)
- Thời gian: ~30 giây

### **Lần 3: Xóa file**

```bash
git rm tests/old-test.php
git commit -m "chore: Remove old test"
git push
```

**Kết quả:**

- 🗑️ Xóa: `tests/old-test.php` trên server
- Thời gian: ~20 giây

### **Lần 4: Sửa nhiều file**

```bash
# Sửa: api.php, app/Controllers/EmployeeController.php
# Thêm: assets/js/new-module.js
git add .
git commit -m "feat: Add new employee module"
git push
```

**Kết quả:**

- ✅ Upload: 3 files (api.php, EmployeeController.php, new-module.js)
- ⏭️ Bỏ qua: ~100+ files khác
- Thời gian: ~1 phút

## 🔍 **KIỂM TRA QUÁ TRÌNH**

### **Xem log trong GitHub Actions:**

1. Vào **GitHub Repository** → **Actions**
2. Click vào workflow run mới nhất
3. Mở job **"Deploy to Production (FTP)"**
4. Xem section **"Deploy to Shared Hosting via FTP"**

**Log mẫu (Incremental):**

```
📁 Scanning local files...
✓ Found 150 files
📊 Comparing with previous deployment...
⚡ Changed: 3 files
⏭️  Unchanged: 147 files
📤 Uploading...
   ✓ api.php (2.5 KB)
   ✓ app/Controllers/EmployeeController.php (8.1 KB)
   ✓ assets/js/new-module.js (4.2 KB)
✅ Deployment complete in 45 seconds
```

**Log mẫu (Full - lần đầu):**

```
📁 Scanning local files...
✓ Found 150 files
⚠️  No previous deployment state found
📤 Uploading all files...
   ✓ index.html
   ✓ api.php
   ✓ app/Config/Database.php
   ... (150 files)
✅ Deployment complete in 4 minutes 32 seconds
💾 Saved deployment state
```

## ⚙️ **TÙY CHỈNH NÂNG CAO**

### **1. Test trước khi deploy (Dry Run)**

Nếu muốn **test** xem file nào sẽ được upload TRƯỚC KHI deploy thật:

```yaml
dry-run: true # Chỉ hiển thị, không upload
```

Sau khi kiểm tra OK, đổi lại:

```yaml
dry-run: false # Deploy thật
```

### **2. Xóa toàn bộ server trước khi deploy (Nguy hiểm! ⚠️)**

```yaml
dangerous-clean-slate: true # XÓA TẤT CẢ files trên server trước khi upload
```

**⚠️ CẢNH BÁO:**

- Sẽ **XÓA HẾT** files trên server (kể cả files không có trong Git!)
- Chỉ dùng khi:
  - Lần deploy đầu tiên
  - Server có files rác cần dọn dẹp
  - Đã backup database trước

### **3. Tăng log chi tiết**

```yaml
log-level: verbose # Hiển thị chi tiết hơn (mặc định: standard)
```

Các mức log:

- `minimal` - Chỉ hiển thị kết quả
- `standard` - Mức bình thường (khuyến nghị)
- `verbose` - Chi tiết (debug)

## 🎯 **KẾT QUẢ MONG ĐỢI**

### **✅ THÀNH CÔNG:**

Sau mỗi lần deploy, bạn sẽ thấy:

1. **GitHub Actions** → Status: ✅ Success (màu xanh)
2. **Thời gian:** Giảm từ 5 phút xuống 30 giây - 2 phút
3. **Log:** Chỉ hiển thị files thay đổi
4. **Website:** https://alexstudio.id.vn cập nhật tức thì

### **❌ LỖI THƯỜNG GẶP:**

#### **1. "No state file found - deploying all files"**

```
Nguyên nhân: Lần deploy đầu tiên (bình thường)
Giải pháp: Không cần làm gì, lần sau sẽ incremental
```

#### **2. "FTP connection timeout"**

```
Nguyên nhân: Hosting FTP chậm hoặc bận
Giải pháp: Chờ 5-10 phút rồi push lại
```

#### **3. "Permission denied"**

```
Nguyên nhân: Sai FTP credentials
Giải pháp: Kiểm tra lại GitHub Secrets (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
```

## 📊 **SO SÁNH HIỆU SUẤT**

| Loại thay đổi  | Full Deploy | Incremental | Tiết kiệm |
| -------------- | ----------- | ----------- | --------- |
| Sửa 1 file CSS | 5 phút      | 30 giây     | **90%**   |
| Sửa 3-5 files  | 5 phút      | 1 phút      | **80%**   |
| Sửa 20+ files  | 5 phút      | 2 phút      | **60%**   |
| Lần đầu (all)  | 5 phút      | 5 phút      | 0%        |

## 🔐 **BẢO MẬT**

File `.ftp-deploy-sync-state.json` chứa:

- ✅ Hash (MD5) của từng file
- ✅ Đường dẫn file
- ❌ KHÔNG chứa: Code, passwords, credentials

**An toàn:** File này được lưu trong GitHub Actions cache, không public.

## 🎓 **TÓM TẮT**

### **Workflow mới:**

1. Bạn sửa code local
2. `git add . && git commit -m "..." && git push`
3. GitHub Actions tự động:
   - So sánh với lần deploy trước
   - Chỉ upload files thay đổi
   - Xóa files đã xóa (nếu có)
4. Website cập nhật trong 30 giây - 2 phút ⚡

### **Lợi ích:**

- ⚡ **Nhanh hơn 5-10 lần**
- 💾 **Tiết kiệm bandwidth 80-90%**
- 🎯 **Chính xác hơn** (chỉ deploy thay đổi)
- 🔄 **Tự động sync** (xóa files cũ)

---

**Tạo bởi:** GitHub Copilot  
**Ngày:** 2025-11-06  
**Công nghệ:** FTP-Deploy-Action v4.3.5
