# Hệ Thống Quản Lý Nhân Sự (HRM) - MVC Architecture

## Giới Thiệu

Đây là hệ thống quản lý nhân sự hoàn chỉnh được xây dựng theo kiến trúc **MVC (Model-View-Controller)** với:

- **Frontend**: Vanilla JavaScript ES6+ (không framework)
- **Backend**: PHP 8.4+ với MySQL
- **API**: RESTful JSON endpoints
- **Database**: MySQL với PDO

## Công Nghệ Sử Dụng

### Frontend

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

### Backend

- **PHP 8.4+**: Server-side logic với SPL Autoload
- **MySQL 8.0+**: Database management với UTF8MB4
- **PDO**: Database abstraction layer với prepared statements
- **MVC Architecture**: Controllers, Models, Config
- **RESTful API**: JSON endpoints với CORS support
- **Session Management**: PHP sessions cho authentication

## Cấu Trúc Dự Án

```
HRM/
├── public/                    # Web Root (Frontend + API)
│   ├── index.html            # Single Page Application
│   ├── api.php               # RESTful API Router
│   ├── .htaccess             # URL Rewriting & Security
│   └── assets/
│       ├── css/style.css     # Responsive CSS
│       └── js/
│           ├── app.js        # Main Application (MVC Router)
│           └── modules/      # JavaScript Modules (12 modules)
│               ├── authModule.js           # Authentication
│               ├── employeeDbModule.js     # Employee CRUD
│               ├── addEmployeeModule.js    # Add Employee
│               ├── editEmployeeModule.js   # Edit Employee
│               ├── deleteEmployeeModule.js # Delete Employee
│               ├── searchEmployeeModule.js # Search & Filter
│               ├── departmentModule.js     # Department Management
│               ├── positionModule.js       # Position Management
│               ├── salaryModule.js         # Salary Management
│               ├── attendanceModule.js     # Time Tracking
│               ├── leaveModule.js          # Leave Management
│               └── performanceModule.js    # Performance Reviews
├── app/                      # Backend (MVC)
│   ├── Controllers/          # API Controllers (7 controllers)
│   │   ├── BaseController.php
│   │   ├── AuthController.php
│   │   ├── EmployeeController.php
│   │   ├── DepartmentController.php
│   │   ├── PositionController.php
│   │   ├── AttendanceController.php
│   │   ├── LeaveController.php
│   │   └── PerformanceController.php
│   ├── Models/              # Database Models (8 models)
│   │   ├── BaseModel.php
│   │   ├── UserModel.php
│   │   ├── EmployeeModel.php
│   │   ├── DepartmentModel.php
│   │   ├── PositionModel.php
│   │   ├── AttendanceModel.php
│   │   ├── LeaveModel.php
│   │   └── PerformanceModel.php
│   └── Config/              # Configuration
│       └── Database.php      # Database Connection
├── database/                # Database Schema & Data
│   └── migrations/
│       └── 001_initial_schema.sql  # Complete DB Schema + Sample Data
└── README.md               # Documentation
```

## Tính Năng

### 1. Module Xác Thực (AuthModule)

- **Đăng nhập/Đăng xuất** với PHP sessions
- **Mã hóa mật khẩu** bằng `password_hash()` (PHP)
- **Quản lý phiên** với session storage
- **Tài khoản mặc định**: `admin` / `admin123`
- **Bảo mật**: CORS headers, input validation

### 2. Module Cơ Sở Dữ Liệu Nhân Viên (EmployeeDbModule)

- **API Integration**: Kết nối với PHP RESTful API
- **CRUD Operations**: Create, Read, Update, Delete
- **Data Validation**: Client-side và server-side validation
- **Error Handling**: Xử lý lỗi API và network
- **Cache Busting**: Version control cho JavaScript modules

### 3. Module Thêm Nhân Viên (AddEmployeeModule)

- **Dynamic Form**: Form thêm nhân viên với validation
- **Auto ID Generation**: Tự động tạo mã nhân viên (EMP001, EMP002...)
- **Real-time Validation**: Kiểm tra dữ liệu ngay khi nhập
- **Department/Position Integration**: Load danh sách từ API

### 4. Module Sửa Nhân Viên (EditEmployeeModule)

- **Search & Load**: Tìm kiếm và load dữ liệu nhân viên
- **Form Pre-population**: Điền sẵn thông tin hiện có
- **Update Confirmation**: Xác nhận trước khi cập nhật
- **Field Validation**: Validate từng field riêng biệt

### 5. Module Xóa Nhân Viên (DeleteEmployeeModule)

- **Search Interface**: Tìm kiếm nhân viên cần xóa
- **Confirmation Dialog**: Xác nhận trước khi xóa
- **Real-time Update**: Cập nhật danh sách ngay lập tức
- **Error Handling**: Xử lý lỗi khi xóa

### 6. Module Tìm Kiếm Nhân Viên (SearchEmployeeModule)

- **Advanced Search**: Tìm kiếm theo nhiều tiêu chí
- **Filter Options**: Lọc theo phòng ban, vị trí, lương
- **Sortable Results**: Sắp xếp theo cột (click header)
- **Real-time Search**: Tìm kiếm ngay khi nhập

### 7. Module Quản Lý Phòng Ban (DepartmentModule)

- **CRUD Operations**: Thêm, sửa, xóa phòng ban
- **Manager Assignment**: Gán trưởng phòng cho phòng ban
- **Constraint Checking**: Kiểm tra ràng buộc trước khi xóa
- **API Integration**: Kết nối với Department API

### 8. Module Quản Lý Vị Trí (PositionModule)

- **Position Management**: Quản lý các vị trí công việc
- **Salary Base**: Thiết lập lương cơ bản theo vị trí
- **Constraint Validation**: Kiểm tra ràng buộc với nhân viên
- **Dynamic Updates**: Cập nhật real-time

### 9. Module Quản Lý Lương (SalaryModule)

- **Net Salary Calculation**: Tính lương thực nhận (lương + thưởng - khấu trừ)
- **Payroll Report**: Báo cáo lương tổng hợp
- **Salary Updates**: Cập nhật lương, thưởng, khấu trừ
- **Data Validation**: Validate số liệu lương

### 10. Module Chấm Công (AttendanceModule)

- **Time Tracking**: Check-in/Check-out hàng ngày
- **Hours Calculation**: Tính tổng giờ làm việc
- **Attendance Reports**: Báo cáo chấm công theo thời gian
- **Status Management**: Quản lý trạng thái (present, absent, late)

### 11. Module Nghỉ Phép (LeaveModule)

- **Leave Requests**: Yêu cầu nghỉ phép (phép năm, ốm đau, cá nhân)
- **Approval System**: Phê duyệt/từ chối yêu cầu
- **Leave Balance**: Theo dõi số ngày phép còn lại (20 ngày/năm)
- **Leave History**: Lịch sử nghỉ phép chi tiết

### 12. Module Đánh Giá Hiệu Suất (PerformanceModule)

- **Performance Reviews**: Thêm đánh giá cho nhân viên (1-5 sao)
- **Average Rating**: Tính điểm trung bình sử dụng reduce
- **Top Performers**: Hiển thị nhân viên xuất sắc nhất
- **Review History**: Lịch sử đánh giá chi tiết

## Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Hệ Thống

- **PHP 8.4+** với PDO extension
- **MySQL 8.0+**
- **Web Server** (Apache/Nginx) hoặc **Laragon/XAMPP**
- **Trình duyệt hiện đại** (Chrome, Firefox, Edge, Safari)

### Hướng Dẫn Cài Đặt

#### Bước 1: Cài đặt Database

```sql
-- Tạo database
CREATE DATABASE hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Import schema và dữ liệu mẫu
mysql -u root -p hrm_system < database/migrations/001_initial_schema.sql
```

#### Bước 2: Cấu hình Database

Chỉnh sửa `app/Config/Database.php`:

```php
private $host = "localhost";
private $db_name = "hrm_system";
private $username = "root";
private $password = "your_password";
```

#### Bước 3: Chạy Ứng Dụng

**Với Laragon/XAMPP:**

1. Copy thư mục `HRM` vào `htdocs` (XAMPP) hoặc `www` (Laragon)
2. Truy cập: `http://localhost/HRM/public/`
3. Đăng nhập: `admin` / `admin123`

**Với Apache/Nginx:**

1. Cấu hình Virtual Host trỏ đến thư mục `public/`
2. Đảm bảo mod_rewrite được bật
3. Truy cập domain đã cấu hình

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

## Kiến Trúc & Lưu Trữ Dữ Liệu

### Database Schema (MySQL)

**7 bảng chính với đầy đủ relationships:**

- **`users`**: Quản lý người dùng (admin, hr_manager, employee)
- **`employees`**: Thông tin nhân viên (13 fields)
- **`departments`**: Phòng ban với trưởng phòng
- **`positions`**: Vị trí công việc với lương cơ bản
- **`attendance`**: Chấm công hàng ngày
- **`leaves`**: Quản lý nghỉ phép
- **`performance_reviews`**: Đánh giá hiệu suất

### API Architecture

**RESTful API với 7 controllers:**

- `AuthController`: Authentication & sessions
- `EmployeeController`: CRUD nhân viên
- `DepartmentController`: Quản lý phòng ban
- `PositionController`: Quản lý vị trí
- `AttendanceController`: Chấm công
- `LeaveController`: Nghỉ phép
- `PerformanceController`: Đánh giá

### Frontend Architecture

**12 JavaScript modules với ES6+ features:**

- Module system với import/export
- SPL Autoload cho PHP classes
- Cache busting cho JavaScript
- Responsive CSS với mobile support

## Thách Thức & Giải Pháp

### 1. Frontend-Backend Integration

**Thách thức**: Kết nối JavaScript với PHP API
**Giải pháp**: RESTful API với JSON responses, CORS headers

### 2. Field Naming Convention

**Thách thức**: Frontend dùng camelCase, Backend dùng snake_case
**Giải pháp**: Chuẩn hóa snake_case cho API, convert trong frontend

### 3. Data Validation

**Thách thức**: Validate dữ liệu ở cả client và server
**Giải pháp**: Client-side validation + Server-side validation với PDO

### 4. Error Handling

**Thách thức**: Xử lý lỗi API và network
**Giải pháp**: Try-catch blocks, error responses, user feedback

### 5. Cache Management

**Thách thức**: Browser cache JavaScript files cũ
**Giải pháp**: Cache busting với version parameters (?v=timestamp)

### 6. Database Relationships

**Thách thức**: Quản lý foreign keys và constraints
**Giải pháp**: Proper database design với foreign key constraints

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

## API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/check` - Kiểm tra session

### Employees

- `GET /api/employees` - Danh sách nhân viên
- `GET /api/employees/:id` - Chi tiết nhân viên
- `POST /api/employees` - Tạo nhân viên mới
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên
- `POST /api/employees/search` - Tìm kiếm nhân viên

### Departments

- `GET /api/departments` - Danh sách phòng ban
- `POST /api/departments` - Tạo phòng ban mới
- `PUT /api/departments/:id` - Cập nhật phòng ban
- `DELETE /api/departments/:id` - Xóa phòng ban

### Positions

- `GET /api/positions` - Danh sách vị trí
- `POST /api/positions` - Tạo vị trí mới
- `PUT /api/positions/:id` - Cập nhật vị trí
- `DELETE /api/positions/:id` - Xóa vị trí

### Leaves

- `GET /api/leaves` - Danh sách nghỉ phép
- `GET /api/leaves/balance` - Số ngày phép còn lại
- `POST /api/leaves` - Tạo yêu cầu nghỉ phép
- `PUT /api/leaves/:id/status` - Phê duyệt/từ chối

### Attendance

- `GET /api/attendance` - Danh sách chấm công
- `POST /api/attendance/check-in` - Check-in
- `POST /api/attendance/check-out` - Check-out

### Performance

- `GET /api/performance` - Danh sách đánh giá
- `POST /api/performance` - Tạo đánh giá mới
- `GET /api/performance/top` - Top performers

## Tính Năng Nổi Bật

### 🚀 **Kiến Trúc Hiện Đại**

- **MVC Pattern**: Tách biệt rõ ràng Model-View-Controller
- **RESTful API**: API chuẩn REST với JSON responses
- **SPL Autoload**: Tự động load PHP classes
- **ES6+ Modules**: JavaScript modules với import/export

### 🔒 **Bảo Mật**

- **Password Hashing**: Sử dụng `password_hash()` của PHP
- **SQL Injection Protection**: PDO prepared statements
- **CORS Headers**: Bảo mật cross-origin requests
- **Input Validation**: Validate ở cả client và server

### 📱 **Responsive Design**

- **Mobile-First**: Giao diện tối ưu cho mobile
- **Modern CSS**: Flexbox, Grid, CSS Variables
- **Progressive Enhancement**: Hoạt động tốt trên mọi thiết bị

### ⚡ **Performance**

- **Cache Busting**: Quản lý cache JavaScript
- **Lazy Loading**: Chỉ load module khi cần
- **Optimized Queries**: Database queries được tối ưu
- **Minimal Dependencies**: Không sử dụng framework nặng

## Tác Giả

Dự án được phát triển như một assignment học tập về **Full-Stack Development** với **Vanilla JavaScript** và **PHP MVC**.

## License

Dự án này được tạo ra cho mục đích học tập và tham khảo.

---

**🎯 Mục tiêu**: Chứng minh khả năng xây dựng ứng dụng web hoàn chỉnh chỉ với **Vanilla JavaScript** và **PHP thuần**, không cần framework phức tạp.

**📊 Thống kê**: 12 JavaScript modules, 7 PHP controllers, 8 database models, 7 database tables, 20+ API endpoints.

## 🎓 Kiến Thức Đã Học Được

### **Frontend Development (Vanilla JavaScript)**

#### **ES6+ Advanced Features**

- **Module System**: Import/export modules, dependency injection
- **Classes & Inheritance**: Object-oriented programming với JavaScript
- **Async/Await**: Xử lý bất đồng bộ với API calls
- **Template Literals**: Dynamic HTML generation
- **Destructuring**: Extract data từ objects và arrays
- **Spread/Rest Operators**: Merge objects, function parameters
- **Arrow Functions**: Concise function syntax cho callbacks

#### **Higher-Order Functions**

- **map()**: Transform data cho display (employees → HTML rows)
- **filter()**: Search và filter dữ liệu (theo department, position)
- **reduce()**: Tính toán tổng hợp (total salary, average rating)
- **sort()**: Sắp xếp dữ liệu (top performers, alphabetical)
- **find()**: Tìm kiếm theo điều kiện (employee by ID)

#### **DOM Manipulation & Events**

- **Dynamic Rendering**: Tạo HTML từ JavaScript data
- **Event Delegation**: Handle events cho dynamic content
- **Form Validation**: Real-time validation với RegExp
- **State Management**: Quản lý state với closures
- **Cache Busting**: Version control cho JavaScript files

#### **API Integration**

- **Fetch API**: HTTP requests với async/await
- **Error Handling**: Try-catch blocks cho API calls
- **JSON Processing**: Parse và stringify JSON data
- **CORS Handling**: Cross-origin requests
- **Response Validation**: Kiểm tra API responses

### **Backend Development (PHP)**

#### **MVC Architecture**

- **Model**: Database abstraction với PDO
- **View**: JSON responses cho API
- **Controller**: Business logic và request handling
- **Separation of Concerns**: Tách biệt rõ ràng các layer

#### **Database Design & Management**

- **MySQL Schema Design**: 7 tables với relationships
- **Foreign Key Constraints**: Data integrity
- **Indexing**: Performance optimization
- **UTF8MB4**: Unicode support cho tiếng Việt
- **Prepared Statements**: SQL injection prevention

#### **PHP Advanced Features**

- **SPL Autoload**: Automatic class loading
- **PDO**: Database abstraction layer
- **Sessions**: User authentication
- **Password Hashing**: Security với password_hash()
- **Error Handling**: Try-catch và error logging
- **JSON API**: RESTful API responses

#### **Security Best Practices**

- **Input Validation**: Sanitize user input
- **SQL Injection Prevention**: Prepared statements
- **Password Security**: Hashing với salt
- **CORS Headers**: Cross-origin security
- **Error Reporting**: Secure error handling

### **Full-Stack Integration**

#### **API Design**

- **RESTful Principles**: HTTP methods (GET, POST, PUT, DELETE)
- **URL Structure**: Resource-based URLs (/api/employees)
- **Status Codes**: Proper HTTP status codes
- **JSON Format**: Consistent response format
- **Error Responses**: Standardized error handling

#### **Data Flow**

- **Frontend → API**: JavaScript modules call PHP endpoints
- **API → Database**: Controllers interact với Models
- **Database → API**: Models return data to Controllers
- **API → Frontend**: JSON responses to JavaScript

#### **Field Naming Conventions**

- **Backend**: snake_case (department_id, hire_date)
- **Frontend**: camelCase (departmentId, hireDate)
- **Conversion**: Transform data between conventions
- **Consistency**: Maintain naming standards

### **Development Tools & Practices**

#### **Version Control**

- **Cache Busting**: ?v=timestamp cho JavaScript
- **File Organization**: Logical folder structure
- **Code Reusability**: Shared modules và functions
- **Documentation**: Comprehensive README

#### **Testing & Debugging**

- **Console Logging**: Debug JavaScript issues
- **API Testing**: Test endpoints với curl/Postman
- **Database Testing**: Verify data integrity
- **Error Tracking**: Monitor và fix issues

#### **Performance Optimization**

- **Lazy Loading**: Load modules only when needed
- **Database Queries**: Optimized SQL queries
- **Caching**: Browser cache management
- **Minimal Dependencies**: No heavy frameworks

### **Project Management**

#### **Architecture Decisions**

- **Technology Stack**: Vanilla JS + PHP + MySQL
- **No Frameworks**: Pure implementation
- **MVC Pattern**: Scalable architecture
- **API-First**: Backend serves frontend

#### **Code Organization**

- **Modular Design**: Separate concerns
- **Dependency Injection**: Loose coupling
- **Error Boundaries**: Graceful error handling
- **Consistent Naming**: Clear conventions

#### **Documentation**

- **Code Comments**: Explain complex logic
- **API Documentation**: Endpoint descriptions
- **Setup Instructions**: Step-by-step guide
- **Architecture Overview**: System design

### **Real-World Skills**

#### **Problem Solving**

- **Debugging**: Identify và fix issues
- **Performance**: Optimize slow operations
- **Compatibility**: Cross-browser support
- **Scalability**: Design for growth

#### **User Experience**

- **Responsive Design**: Mobile-first approach
- **Loading States**: User feedback
- **Error Messages**: Clear communication
- **Form Validation**: Prevent errors

#### **Security Awareness**

- **Data Protection**: Secure sensitive data
- **Input Sanitization**: Prevent attacks
- **Authentication**: User verification
- **Authorization**: Access control

### **Key Takeaways**

1. **Vanilla JavaScript is powerful**: Có thể xây dựng ứng dụng phức tạp mà không cần framework
2. **MVC Architecture works**: Tách biệt rõ ràng giúp code dễ maintain
3. **API Design matters**: RESTful API giúp frontend-backend communication hiệu quả
4. **Database design is crucial**: Schema tốt giúp ứng dụng stable và scalable
5. **Security is essential**: Phải consider security từ đầu, không phải sau
6. **Documentation saves time**: README tốt giúp người khác hiểu project
7. **Testing is important**: Manual testing giúp catch bugs sớm
8. **Performance matters**: Optimize từ đầu, không phải sau khi chậm
