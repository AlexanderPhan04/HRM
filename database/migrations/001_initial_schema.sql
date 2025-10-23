-- init.sql - Script khởi tạo database và dữ liệu mẫu cho HRM System
-- Chạy script này để tạo database, bảng và dữ liệu mẫu

-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE hrm_system;

-- ==================================================
-- Bảng users: Lưu thông tin người dùng (admin, HR manager)
-- ==================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã hash',
    fullname VARCHAR(100) NOT NULL,
    role ENUM('admin', 'hr_manager', 'employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- Bảng departments: Quản lý phòng ban
-- ==================================================
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- Bảng positions: Quản lý vị trí công việc
-- ==================================================
CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    salary_base DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- Bảng employees: Quản lý nhân viên
-- ==================================================
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id VARCHAR(20),
    position_id VARCHAR(20),
    salary DECIMAL(12, 2) DEFAULT 0,
    bonus DECIMAL(12, 2) DEFAULT 0,
    deduction DECIMAL(12, 2) DEFAULT 0,
    hire_date DATE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- Bảng attendance: Theo dõi chấm công
-- ==================================================
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    hours_worked DECIMAL(5, 2) DEFAULT 0,
    status ENUM('present', 'absent', 'late') DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_date (employee_id, date),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- Bảng leaves: Quản lý nghỉ phép
-- ==================================================
CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type ENUM('annual', 'sick', 'unpaid') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reason TEXT,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- Bảng performance_reviews: Đánh giá hiệu suất
-- ==================================================
CREATE TABLE IF NOT EXISTS performance_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    review_date DATE NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    reviewer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- DỮ LIỆU MẪU (Sample Data)
-- ==================================================

-- Insert users (mật khẩu đã hash với password_hash())
-- Password cho tất cả: admin123
-- Hash được tạo bằng: password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO users (username, password, fullname, role) VALUES
('admin', '$2y$12$kq1T7P6rwEQFKl.xMxeyCOxAtIjFCbvjHfXBvUKi2LCiviI7Trxdm', 'Administrator', 'admin'),
('hr_manager', '$2y$12$kq1T7P6rwEQFKl.xMxeyCOxAtIjFCbvjHfXBvUKi2LCiviI7Trxdm', 'HR Manager', 'hr_manager');

-- Insert departments
INSERT INTO departments (id, name, description, manager_id) VALUES
('DEP001', 'Phòng Kinh doanh', 'Phòng kinh doanh và bán hàng', 'EMP001'),
('DEP002', 'Phòng Kỹ thuật', 'Phòng phát triển sản phẩm', 'EMP002'),
('DEP003', 'Phòng Nhân sự', 'Phòng quản lý nhân sự', NULL),
('DEP004', 'Phòng Kế toán', 'Phòng tài chính kế toán', NULL);

-- Insert positions
INSERT INTO positions (id, title, description, salary_base) VALUES
('POS001', 'Giám đốc', 'Giám đốc công ty', 30000000),
('POS002', 'Trưởng phòng', 'Quản lý phòng ban', 20000000),
('POS003', 'Nhân viên chính thức', 'Nhân viên full-time', 12000000),
('POS004', 'Nhân viên thử việc', 'Nhân viên đang thử việc', 8000000),
('POS005', 'Thực tập sinh', 'Sinh viên thực tập', 5000000);

-- Insert employees
INSERT INTO employees (id, name, department_id, position_id, salary, bonus, deduction, hire_date, email, phone, address) VALUES
('EMP001', 'Nguyễn Văn An', 'DEP001', 'POS001', 15000000, 0, 0, '2020-01-15', 'an.nguyen@company.com', '0912345678', 'Hà Nội'),
('EMP002', 'Trần Thị Bình', 'DEP002', 'POS002', 12000000, 0, 0, '2020-03-20', 'binh.tran@company.com', '0923456789', 'Hồ Chí Minh'),
('EMP003', 'Lê Văn Cường', 'DEP001', 'POS003', 10000000, 0, 0, '2021-06-10', 'cuong.le@company.com', '0934567890', 'Đà Nẵng'),
('EMP004', 'Phạm Thị Dung', 'DEP003', 'POS003', 9000000, 0, 0, '2021-08-25', 'dung.pham@company.com', '0945678901', 'Hải Phòng'),
('EMP005', 'Hoàng Văn Em', 'DEP002', 'POS004', 7000000, 0, 0, '2022-01-12', 'em.hoang@company.com', '0956789012', 'Cần Thơ');

-- Insert sample attendance records
INSERT INTO attendance (employee_id, date, check_in, check_out, hours_worked, status) VALUES
('EMP001', '2025-10-20', '08:00:00', '17:00:00', 8.00, 'present'),
('EMP002', '2025-10-20', '08:15:00', '17:30:00', 8.25, 'late'),
('EMP003', '2025-10-20', '08:00:00', '17:00:00', 8.00, 'present'),
('EMP001', '2025-10-21', '08:00:00', '17:00:00', 8.00, 'present'),
('EMP002', '2025-10-21', '08:00:00', '17:00:00', 8.00, 'present');

-- Insert sample leave requests
INSERT INTO leaves (employee_id, start_date, end_date, type, status, reason) VALUES
('EMP003', '2025-10-25', '2025-10-27', 'annual', 'pending', 'Nghỉ phép năm'),
('EMP004', '2025-10-22', '2025-10-22', 'sick', 'approved', 'Đau đầu');

-- Insert sample performance reviews
INSERT INTO performance_reviews (employee_id, review_date, rating, feedback, reviewer_id) VALUES
('EMP001', '2025-09-01', 5, 'Xuất sắc, hoàn thành vượt mục tiêu', 1),
('EMP002', '2025-09-01', 4, 'Tốt, cần cải thiện kỹ năng giao tiếp', 1),
('EMP003', '2025-09-01', 3, 'Trung bình, cần nỗ lực hơn', 2);

-- ==================================================
-- Hoàn thành khởi tạo database
-- ==================================================
SELECT 'Database and tables created successfully!' AS Message;
