ASSIGNMENT REPORT

HỆ THỐNG QUẢN LÝ NHÂN SỰ (HRM SYSTEM)

Semester: Programming Fundamentals
Class: WD1113
Instructor: Cuong Nguyen Dinh
Members: Phan Nhat Quan (Alexander Phan)

Mục Lục

1. Giới Thiệu Dự Án
2. Triển Khai Module Frontend
3. Triển Khai Module Backend
4. Thách Thức Gặp Phải
5. Cách Kiểm Tra Hệ Thống
6. Kết Luận

## 1. Giới Thiệu Dự Án

Hệ Thống Quản Lý Nhân Sự (HRM System) là một ứng dụng web hoàn chỉnh được xây dựng theo kiến trúc MVC với frontend Vanilla JavaScript ES6+ và backend PHP 8.4+ kết nối MySQL. Hệ thống bao gồm 8 modules chính: Authentication, Employee, Department, Position, Salary, Attendance, Leave, và Performance.

## 2. Triển Khai Module Frontend

### 2.1 Cấu Trúc Module JavaScript

Mỗi module được triển khai như một ES6 class với các phương thức chính:

**EmployeeModule.js:**

```javascript
class EmployeeModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
  }

  async render() {
    const departments = await this.departmentModule.getAllDepartments();
    const positions = await this.positionModule.getAllPositions();
    // Render form với dropdown data
  }
}
```

### 2.2 Dependency Injection Pattern

- Mỗi module nhận dependencies thông qua constructor
- Sử dụng async/await cho API calls
- Cache busting với `?v=timestamp` để tránh browser cache

### 2.3 API Integration

- RESTful endpoints: `/api/employees`, `/api/departments`, `/api/positions`
- Error handling với try-catch blocks
- Response validation trước khi render

## 3. Triển Khai Module Backend

### 3.1 MVC Architecture

**Controller Layer:**

```php
class EmployeeController {
    public function getAll() {
        $model = new EmployeeModel();
        $employees = $model->getAllEmployees();
        return json_encode($employees);
    }
}
```

**Model Layer:**

```php
class EmployeeModel {
    public function getAllEmployees() {
        $sql = "SELECT * FROM employees";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
```

### 3.2 SPL Autoload Implementation

```php
spl_autoload_register(function ($class) {
    $candidates = [
        CONTROLLER_PATH . '/' . $class . '.php',
        MODEL_PATH . '/' . $class . '.php',
        CONFIG_PATH . '/' . $class . '.php',
    ];

    foreach ($candidates as $file) {
        if (is_file($file)) {
            require_once $file;
            return;
        }
    }
});
```

### 3.3 Database Connection

- PDO với prepared statements
- UTF8MB4 charset cho tiếng Việt
- Connection pooling và error handling

## 4. Thách Thức Gặp Phải

### 4.1 Kết Nối API

**Vấn đề:** Browser cache khiến JavaScript không load phiên bản mới
**Giải pháp:**

- Implement cache busting: `script.js?v=timestamp`
- Sử dụng `Cache-Control: no-cache` headers
- Hard refresh (Ctrl+F5) để test

### 4.2 Field Naming Convention

**Vấn đề:** Inconsistency giữa snake_case (backend) và camelCase (frontend)

- Backend: `department_id`, `hire_date`
- Frontend: `departmentId`, `hireDate`

**Giải pháp:**

- Mapping data trong API responses
- Consistent naming trong toàn bộ codebase
- Validation ở cả frontend và backend

### 4.3 OOP Implementation

**Vấn đề:** Dependency management và module communication
**Giải pháp:**

- Constructor injection pattern
- Async/await cho API calls
- Error boundaries cho graceful failures

### 4.4 Data Type Handling

**Vấn đề:** `NaN` values trong salary calculations
**Giải pháp:**

```javascript
calculateNetSalary(employee) {
    const baseSalary = parseFloat(employee.salary) || 0;
    const bonus = parseFloat(employee.bonus) || 0;
    const deduction = parseFloat(employee.deduction) || 0;
    const netSalary = baseSalary + bonus - deduction;
    return isNaN(netSalary) ? 0 : netSalary;
}
```

### 4.5 Date Handling

**Vấn đề:** "Invalid Date" display
**Giải pháp:**

- Consistent date format (YYYY-MM-DD)
- Proper Date object creation
- Locale-specific formatting

## 5. Cách Kiểm Tra Hệ Thống

### 5.1 Manual Testing

**Frontend Testing:**

1. Mở Developer Tools (F12)
2. Check Console cho JavaScript errors
3. Verify API calls trong Network tab
4. Test responsive design trên mobile

**Backend Testing:**

```php
// Test API endpoint
$response = file_get_contents('http://localhost/HRM/public/api.php/employees');
$data = json_decode($response, true);
var_dump($data);
```

### 5.2 Database Testing

```sql
-- Kiểm tra data integrity
SELECT COUNT(*) FROM employees;
SELECT * FROM employees WHERE department_id IS NULL;
SELECT * FROM departments WHERE manager_id IS NULL;
```

### 5.3 Integration Testing

**Test Cases:**

1. **Login Flow:** Username/password → Session creation
2. **CRUD Operations:** Create → Read → Update → Delete
3. **Data Validation:** Invalid input → Error messages
4. **API Responses:** Status codes, JSON format
5. **Cross-browser:** Chrome, Firefox, Edge

### 5.4 Performance Testing

- Page load time < 3 seconds
- API response time < 500ms
- Database query optimization
- Memory usage monitoring

## 6. Kết Luận

Dự án HRM System đã được triển khai thành công với 8 modules hoàn chỉnh. Các thách thức chính về API integration, OOP design, và data handling đã được giải quyết thông qua best practices như dependency injection, error handling, và consistent naming conventions. Hệ thống đã được test kỹ lưỡng và sẵn sàng cho production deployment.
