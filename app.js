// app.js - File chính của ứng dụng HRM
// Import tất cả các module
import { AuthModule } from "./authModule.js";
import { EmployeeDbModule } from "./employeeDbModule.js";
import { AddEmployeeModule } from "./addEmployeeModule.js";
import { EditEmployeeModule } from "./editEmployeeModule.js";
import { DeleteEmployeeModule } from "./deleteEmployeeModule.js";
import { SearchEmployeeModule } from "./searchEmployeeModule.js";
import { DepartmentModule } from "./departmentModule.js";
import { PositionModule } from "./positionModule.js";
import { SalaryModule } from "./salaryModule.js";
import { AttendanceModule } from "./attendanceModule.js";
import { LeaveModule } from "./leaveModule.js";
import { PerformanceModule } from "./performanceModule.js";

class HRMApp {
  constructor() {
    // ============ Khởi tạo các module cơ bản (không có dependencies) ============

    // Module xác thực người dùng (login/register/logout)
    this.authModule = new AuthModule();
    // Module quản lý database nhân viên (CRUD operations)
    this.employeeDb = new EmployeeDbModule();
    // Module quản lý phòng ban
    this.departmentModule = new DepartmentModule();
    // Module quản lý vị trí công việc
    this.positionModule = new PositionModule();

    // ============ Khởi tạo các module phụ thuộc (Dependency Injection) ============

    // Module thêm nhân viên - cần employeeDb, department, position
    this.addEmployeeModule = new AddEmployeeModule(
      this.employeeDb,
      this.departmentModule,
      this.positionModule
    );
    // Module sửa nhân viên - cần employeeDb, department, position
    this.editEmployeeModule = new EditEmployeeModule(
      this.employeeDb,
      this.departmentModule,
      this.positionModule
    );
    // Module xóa nhân viên - cần employeeDb, department, position
    this.deleteEmployeeModule = new DeleteEmployeeModule(
      this.employeeDb,
      this.departmentModule,
      this.positionModule
    );
    // Module tìm kiếm nhân viên - cần employeeDb, department, position
    this.searchEmployeeModule = new SearchEmployeeModule(
      this.employeeDb,
      this.departmentModule,
      this.positionModule
    );
    // Module quản lý lương - cần employeeDb, department, position
    this.salaryModule = new SalaryModule(
      this.employeeDb,
      this.departmentModule,
      this.positionModule
    );
    // Module chấm công - chỉ cần employeeDb
    this.attendanceModule = new AttendanceModule(this.employeeDb);
    // Module nghỉ phép - chỉ cần employeeDb
    this.leaveModule = new LeaveModule(this.employeeDb);
    // Module đánh giá hiệu suất - cần employeeDb, department, position
    this.performanceModule = new PerformanceModule(
      this.employeeDb,
      this.departmentModule,
      this.positionModule
    );

    // ============ Thiết lập callbacks cho authentication module ============

    // Arrow function để giữ context của 'this'
    // Khi login thành công, gọi method showDashboard()
    this.authModule.onLoginSuccess = () => this.showDashboard();
    // Khi logout, gọi method showAuthScreen()
    this.authModule.onLogout = () => this.showAuthScreen();

    // ============ Biến lưu trạng thái ============

    // Lưu tên module hiện tại đang hiển thị
    this.currentModule = null;

    // ============ Expose modules globally ============
    // Để có thể gọi từ inline onclick handlers trong HTML
    // Ví dụ: onclick="departmentModule.confirmDelete(...)"

    window.departmentModule = this.departmentModule;
    window.positionModule = this.positionModule;
    window.editEmployeeModule = this.editEmployeeModule;
    window.deleteEmployeeModule = this.deleteEmployeeModule;
    window.searchEmployeeModule = this.searchEmployeeModule;
    window.salaryModule = this.salaryModule;
    window.attendanceModule = this.attendanceModule;
    window.leaveModule = this.leaveModule;
    window.performanceModule = this.performanceModule;
    window.currentEmployeeDb = this.employeeDb;

    // ============ Khởi tạo ứng dụng ============
    this.init();
  }

  // Khởi tạo ứng dụng (check authentication và show tương ứng)
  init() {
    // Kiểm tra user đã đăng nhập chưa
    if (this.authModule.isAuthenticated()) {
      // Nếu đã đăng nhập: hiển thị dashboard
      this.showDashboard();
    } else {
      // Nếu chưa đăng nhập: hiển thị màn hình login
      this.showAuthScreen();
    }
  }

  // Hiển thị màn hình đăng nhập
  showAuthScreen() {
    // Remove class "hidden" để hiển thị auth screen
    document.getElementById("auth-screen").classList.remove("hidden");
    // Add class "hidden" để ẩn dashboard screen
    document.getElementById("dashboard-screen").classList.add("hidden");
    // Render login form vào auth screen
    this.authModule.renderLoginForm();
  }

  // Hiển thị dashboard (sau khi đăng nhập thành công)
  showDashboard() {
    // Ẩn auth screen
    document.getElementById("auth-screen").classList.add("hidden");
    // Hiển thị dashboard screen
    document.getElementById("dashboard-screen").classList.remove("hidden");

    // ============ Hiển thị thông tin người dùng ============
    const user = this.authModule.getCurrentUser();
    // Update text content với tên user (template literals)
    document.getElementById(
      "user-info"
    ).textContent = `Xin chào, ${user.fullname}`;

    // ============ Gắn event listeners ============
    // Gắn event cho menu items
    this.attachMenuListeners();

    // ============ Mobile menu toggle ============
    this.setupMobileMenu();

    // Gắn event cho nút logout
    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault(); // Ngăn link reload trang
      // Confirm dialog trước khi logout
      if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        this.authModule.logout(); // Thực hiện logout
      }
    });

    // ============ Load module mặc định ============
    // Load danh sách nhân viên khi vào dashboard
    this.loadModule("employee-list");
  }

  // Gắn event listeners cho menu (sử dụng querySelectorAll và forEach)
  attachMenuListeners() {
    // Select tất cả menu items có attribute data-module
    const menuItems = document.querySelectorAll(".nav-menu a[data-module]");

    // Loop qua từng menu item (forEach - higher-order function)
    menuItems.forEach((item) => {
      // Gắn click event cho mỗi menu item
      item.addEventListener("click", (e) => {
        e.preventDefault(); // Ngăn link navigate

        // Lấy tên module từ attribute data-module
        const moduleName = e.target.getAttribute("data-module");
        // Load module tương ứng
        this.loadModule(moduleName);

        // ============ Highlight active menu ============
        // Remove class "active" từ tất cả menu items
        menuItems.forEach((mi) => mi.parentElement.classList.remove("active"));
        // Add class "active" cho menu item vừa click
        e.target.parentElement.classList.add("active");

        // ============ Đóng mobile menu sau khi chọn ============
        this.closeMobileMenu();
      });
    });
  }

  // Thiết lập mobile menu toggle (responsive behavior)
  setupMobileMenu() {
    // Lấy các elements cần thiết
    const mobileMenuOpenBtn = document.getElementById("mobile-menu-open");
    const mobileMenuCloseBtn = document.getElementById("mobile-menu-close");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    // Event: Click nút hamburger (☰) để MỞ menu
    if (mobileMenuOpenBtn) {
      mobileMenuOpenBtn.addEventListener("click", () => {
        this.openMobileMenu();
      });
    }

    // Event: Click nút close (✕) trong sidebar để ĐÓNG menu
    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener("click", () => {
        this.closeMobileMenu();
      });
    }

    // Event: Click overlay để đóng menu
    if (overlay) {
      overlay.addEventListener("click", () => {
        this.closeMobileMenu();
      });
    }
  }

  // Mở mobile menu
  openMobileMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    // Add class "active" để show sidebar và overlay
    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  // Toggle mobile menu (mở/đóng)
  toggleMobileMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    // Toggle class "active" để show/hide sidebar
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  // Đóng mobile menu
  closeMobileMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    // Remove class "active" để ẩn sidebar và overlay
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  } // Load module theo tên
  loadModule(moduleName) {
    const contentArea = document.getElementById("content-area");
    this.currentModule = moduleName;

    switch (moduleName) {
      case "employee-list":
        this.renderEmployeeList();
        break;

      case "add-employee":
        contentArea.innerHTML = this.addEmployeeModule.render();
        this.addEmployeeModule.attachEventListeners();
        break;

      case "edit-employee":
        contentArea.innerHTML = this.editEmployeeModule.render();
        this.editEmployeeModule.attachEventListeners();
        break;

      case "delete-employee":
        contentArea.innerHTML = this.deleteEmployeeModule.render();
        this.deleteEmployeeModule.attachEventListeners();
        break;

      case "search-employee":
        contentArea.innerHTML = this.searchEmployeeModule.render();
        this.searchEmployeeModule.attachEventListeners();
        break;

      case "departments":
        contentArea.innerHTML = this.departmentModule.render(this.employeeDb);
        this.departmentModule.attachEventListeners(this.employeeDb);
        break;

      case "positions":
        contentArea.innerHTML = this.positionModule.render(this.employeeDb);
        this.positionModule.attachEventListeners(this.employeeDb);
        break;

      case "salary":
        contentArea.innerHTML = this.salaryModule.render();
        this.salaryModule.attachEventListeners();
        break;

      case "attendance":
        contentArea.innerHTML = this.attendanceModule.render();
        this.attendanceModule.attachEventListeners();
        break;

      case "leave":
        contentArea.innerHTML = this.leaveModule.render();
        this.leaveModule.attachEventListeners();
        break;

      case "performance":
        contentArea.innerHTML = this.performanceModule.render();
        this.performanceModule.attachEventListeners();
        break;

      default:
        contentArea.innerHTML = "<h2>Module không tồn tại</h2>";
    }
  }

  // Render danh sách nhân viên
  renderEmployeeList() {
    const employees = this.employeeDb.getAllEmployees();
    const departments = this.departmentModule.getAllDepartments();
    const positions = this.positionModule.getAllPositions();

    // Tính thống kê
    const stats = {
      totalEmployees: employees.length,
      totalDepartments: departments.length,
      totalPositions: positions.length,
      totalSalary: this.employeeDb.getTotalSalary(),
    };

    const content = `
            <div class="module-header">
                <h2>Danh Sách Nhân Viên</h2>
                <p>Tổng quan về nhân sự trong công ty</p>
            </div>

            <!-- Thống kê -->
            <div class="stats-container">
                <div class="stat-card">
                    <h3>${stats.totalEmployees}</h3>
                    <p>Tổng Nhân Viên</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.totalDepartments}</h3>
                    <p>Phòng Ban</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.totalPositions}</h3>
                    <p>Vị Trí</p>
                </div>
                <div class="stat-card">
                    <h3>${this.formatCurrency(stats.totalSalary)}</h3>
                    <p>Tổng Lương</p>
                </div>
            </div>

            <!-- Danh sách nhân viên -->
            <div class="card">
                <h3>Danh Sách Nhân Viên (${employees.length})</h3>
                ${
                  employees.length === 0
                    ? `
                    <div class="empty-state">
                        <h3>Chưa có nhân viên nào</h3>
                        <p>Hãy thêm nhân viên mới để bắt đầu</p>
                    </div>
                `
                    : `
                    <table>
                        <thead>
                            <tr>
                                <th>Mã NV</th>
                                <th>Họ tên</th>
                                <th>Phòng ban</th>
                                <th>Vị trí</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Lương</th>
                                <th>Ngày vào làm</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees
                              .map((emp) => {
                                const dept = departments.find(
                                  (d) => d.id === emp.departmentId
                                );
                                const pos = positions.find(
                                  (p) => p.id === emp.positionId
                                );
                                return `
                                    <tr>
                                        <td>${emp.id}</td>
                                        <td>${emp.name}</td>
                                        <td>${dept ? dept.name : "N/A"}</td>
                                        <td>${pos ? pos.title : "N/A"}</td>
                                        <td>${emp.email}</td>
                                        <td>${emp.phone}</td>
                                        <td>${this.formatCurrency(
                                          emp.salary
                                        )}</td>
                                        <td>${this.formatDate(
                                          emp.hireDate
                                        )}</td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                `
                }
            </div>
        `;

    document.getElementById("content-area").innerHTML = content;
  }

  // Format tiền tệ
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  // Format ngày
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  }
}

// Khởi tạo ứng dụng khi DOM đã load
document.addEventListener("DOMContentLoaded", () => {
  const app = new HRMApp();

  // Expose app globally cho debugging
  window.hrmApp = app;

  console.log("✅ HRM Application initialized successfully!");
});
