# Ứng Dụng Quản Lý Nhân Sự (HRM)

## Giới Thiệu

Đây là ứng dụng quản lý nhân sự hoàn chỉnh được xây dựng bằng **JavaScript thuần** (Vanilla JavaScript), không sử dụng bất kỳ framework hay thư viện bên ngoài nào.

## Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc trang web
- **CSS3**: Thiết kế giao diện (responsive)
- **JavaScript ES6+**: Logic nghiệp vụ
  - Arrow functions
  - Template literals
  - Destructuring
  - Spread/Rest operators
  - Classes & Modules (import/export)
  - Async/Await
  - Higher-order functions (map, filter, reduce, sort)
  - Closures
  - Regular Expressions

## Cấu Trúc Dự Án

```
HRM/
├── index.html                  # File HTML chính
├── style.css                   # CSS cho giao diện
├── app.js                      # File JavaScript chính
├── authModule.js              # Module xác thực
├── employeeDbModule.js        # Module CSDL nhân viên
├── addEmployeeModule.js       # Module thêm nhân viên
├── editEmployeeModule.js      # Module sửa nhân viên
├── deleteEmployeeModule.js    # Module xóa nhân viên
├── searchEmployeeModule.js    # Module tìm kiếm nhân viên
├── departmentModule.js        # Module quản lý phòng ban
├── positionModule.js          # Module quản lý vị trí
├── salaryModule.js            # Module quản lý lương
├── attendanceModule.js        # Module chấm công
├── leaveModule.js             # Module nghỉ phép
├── performanceModule.js       # Module đánh giá hiệu suất
└── README.md                  # File hướng dẫn
```

## Tính Năng

### 1. Module Xác Thực (AuthModule)

- Đăng ký và đăng nhập người dùng
- Quản lý phiên làm việc
- Mã hóa mật khẩu đơn giản sử dụng closure
- Tài khoản mặc định: `admin` / `admin123`

### 2. Module Cơ Sở Dữ Liệu Nhân Viên (EmployeeDbModule)

- Lưu trữ dữ liệu trong localStorage
- CRUD operations (Create, Read, Update, Delete)
- Higher-order functions để filter và sort
- Tự động khởi tạo 5 nhân viên mẫu

### 3. Module Thêm Nhân Viên (AddEmployeeModule)

- Form thêm nhân viên động
- Validate dữ liệu đầu vào real-time
- Tự động generate mã nhân viên

### 4. Module Sửa Nhân Viên (EditEmployeeModule)

- Tìm kiếm nhân viên theo mã hoặc tên
- Preload dữ liệu hiện có
- Xác nhận trước khi lưu
- Sử dụng closure để lưu trạng thái

### 5. Module Xóa Nhân Viên (DeleteEmployeeModule)

- Tìm kiếm và xác nhận trước khi xóa
- Cập nhật giao diện real-time

### 6. Module Tìm Kiếm Nhân Viên (SearchEmployeeModule)

- Tìm kiếm nâng cao với nhiều tiêu chí
- Hỗ trợ Regular Expression
- Sắp xếp kết quả (click vào header)
- Lọc theo khoảng lương

### 7. Module Quản Lý Phòng Ban (DepartmentModule)

- Thêm, sửa, xóa phòng ban
- Gán trưởng phòng
- Kiểm tra ràng buộc trước khi xóa

### 8. Module Quản Lý Vị Trí (PositionModule)

- Quản lý các vị trí công việc
- Lương cơ bản theo vị trí
- Kiểm tra ràng buộc với nhân viên

### 9. Module Quản Lý Lương (SalaryModule)

- Tính lương thực nhận (lương + thưởng - khấu trừ)
- Sử dụng map/reduce cho tính toán
- Bảng lương tổng hợp
- Cập nhật lương, thưởng, khấu trừ

### 10. Module Chấm Công (AttendanceModule)

- Check-in/Check-out hàng ngày
- Tính tổng giờ làm việc
- Báo cáo chấm công theo thời gian
- Sử dụng Date objects

### 11. Module Nghỉ Phép (LeaveModule)

- Yêu cầu nghỉ phép (phép năm, ốm đau, cá nhân)
- Phê duyệt/từ chối yêu cầu
- Theo dõi số ngày phép còn lại (mặc định 20 ngày/năm)
- Lịch sử nghỉ phép

### 12. Module Đánh Giá Hiệu Suất (PerformanceModule)

- Thêm đánh giá cho nhân viên (1-5 sao)
- Tính điểm trung bình sử dụng reduce
- Top performers (sắp xếp theo điểm)
- Lịch sử đánh giá chi tiết

## Cách Chạy Ứng Dụng

### Yêu Cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Local server (vì sử dụng ES6 modules)

### Cách 1: Sử dụng VS Code Live Server

1. Cài đặt extension "Live Server" trong VS Code
2. Mở thư mục dự án trong VS Code
3. Click phải vào file `index.html`
4. Chọn "Open with Live Server"
5. Ứng dụng sẽ mở tại `http://localhost:5500` (hoặc port khác)

### Cách 2: Sử dụng Python

```bash
# Python 3
python -m http.server 8000

# Sau đó mở trình duyệt: http://localhost:8000
```

### Cách 3: Sử dụng Node.js

```bash
npx http-server -p 8000
# Mở trình duyệt: http://localhost:8000
```

## Hướng Dẫn Sử Dụng

### Đăng Nhập

1. Mở ứng dụng
2. Sử dụng tài khoản mặc định:
   - Username: `admin`
   - Password: `admin123`
3. Hoặc đăng ký tài khoản mới

### Quản Lý Nhân Viên

1. **Xem danh sách**: Click "Danh sách Nhân viên" ở menu bên trái
2. **Thêm nhân viên**: Click "Thêm Nhân viên", điền form và submit
3. **Sửa nhân viên**: Click "Sửa Nhân viên", tìm kiếm và chỉnh sửa
4. **Xóa nhân viên**: Click "Xóa Nhân viên", tìm và xác nhận xóa
5. **Tìm kiếm**: Click "Tìm kiếm Nhân viên", sử dụng bộ lọc nâng cao

### Quản Lý Phòng Ban & Vị Trí

- Thêm, sửa, xóa phòng ban và vị trí
- Hệ thống tự kiểm tra ràng buộc (không xóa nếu còn nhân viên)

### Quản Lý Lương

- Xem bảng lương tổng hợp
- Cập nhật lương cơ bản, thưởng, khấu trừ
- Hệ thống tự tính lương thực nhận

### Chấm Công

- Check-in/Check-out cho nhân viên
- Xem báo cáo chấm công theo khoảng thời gian

### Nghỉ Phép

- Tạo yêu cầu nghỉ phép
- Phê duyệt/từ chối yêu cầu
- Theo dõi số ngày phép

### Đánh Giá Hiệu Suất

- Thêm đánh giá cho nhân viên
- Xem top performers
- Xem chi tiết đánh giá từng nhân viên

## Các Tính Năng JavaScript Nâng Cao Được Sử Dụng

### ES6+ Features

- **Arrow Functions**: Hầu hết callbacks và methods
- **Template Literals**: Render HTML động
- **Destructuring**: Xử lý objects và arrays
- **Spread/Rest Operators**: Merge objects, function parameters
- **Classes**: Tất cả modules sử dụng class
- **Modules**: Import/export giữa các files
- **Async/Await**: Giả lập async operations cho localStorage

### Higher-Order Functions

- **map()**: Transform data cho display
- **filter()**: Tìm kiếm và lọc dữ liệu
- **reduce()**: Tính tổng lương, điểm trung bình
- **sort()**: Sắp xếp kết quả tìm kiếm, top performers
- **find()**: Tìm kiếm theo ID

### Closures

- Hash password function trong AuthModule
- Lưu trạng thái edit trong EditEmployeeModule

### Regular Expressions

- Validate email, phone
- Tìm kiếm nhân viên theo pattern

### Date Objects

- Tính giờ làm việc
- Xử lý ngày nghỉ phép
- Format ngày tháng

### DOM Manipulation

- Dynamic rendering
- Event listeners
- Form validation

## Lưu Trữ Dữ Liệu

Tất cả dữ liệu được lưu trong **localStorage** với các keys:

- `hrm_users`: Danh sách người dùng
- `hrm_session`: Phiên đăng nhập
- `hrm_employees`: Danh sách nhân viên
- `hrm_departments`: Danh sách phòng ban
- `hrm_positions`: Danh sách vị trí
- `hrm_attendance`: Dữ liệu chấm công
- `hrm_leaves`: Dữ liệu nghỉ phép
- `hrm_performance`: Dữ liệu đánh giá

## Thách Thức & Giải Pháp

### 1. Module System

**Thách thức**: ES6 modules yêu cầu server
**Giải pháp**: Sử dụng Live Server hoặc local HTTP server

### 2. Quản Lý State

**Thách thức**: Không có state management library
**Giải pháp**: Sử dụng localStorage và closure để lưu trạng thái

### 3. Validation

**Thách thức**: Validate dữ liệu phức tạp
**Giải pháp**: Tạo hàm validate riêng với RegExp

### 4. UI Updates

**Thách thức**: Cập nhật UI sau CRUD operations
**Giải pháp**: Re-render module hoặc cập nhật DOM trực tiếp

### 5. Relationships

**Thách thức**: Quản lý quan hệ giữa entities (employee-department-position)
**Giải pháp**: Sử dụng ID references và kiểm tra ràng buộc

## Testing

### Manual Testing Checklist

- [ ] Đăng ký và đăng nhập
- [ ] Thêm nhân viên với dữ liệu hợp lệ
- [ ] Thêm nhân viên với dữ liệu không hợp lệ (kiểm tra validation)
- [ ] Sửa thông tin nhân viên
- [ ] Xóa nhân viên
- [ ] Tìm kiếm với các tiêu chí khác nhau
- [ ] Quản lý phòng ban và vị trí
- [ ] Cập nhật lương
- [ ] Check-in/Check-out
- [ ] Yêu cầu và duyệt nghỉ phép
- [ ] Thêm và xem đánh giá
- [ ] Đăng xuất

### Edge Cases

- Dữ liệu rỗng
- Input không hợp lệ
- Xóa entity có quan hệ
- Ngày không hợp lệ
- Số âm

## Tác Giả

Dự án được phát triển như một assignment học tập về JavaScript nâng cao.

## License

Dự án này được tạo ra cho mục đích học tập.

---

**Lưu ý**: Ứng dụng này sử dụng localStorage nên dữ liệu chỉ lưu trên trình duyệt local. Để triển khai thực tế cần backend API và database.
