// EmployeeDbModule.js - Module quản lý cơ sở dữ liệu nhân viên
export class EmployeeDbModule {
  constructor() {
    this.storageKey = "hrm_employees";
    this.init();
  }

  // Khởi tạo dữ liệu mặc định
  init() {
    if (!localStorage.getItem(this.storageKey)) {
      this.initDefaultData();
    }
  }

  // Tạo dữ liệu mẫu
  initDefaultData() {
    const defaultEmployees = [
      {
        id: "EMP001",
        name: "Nguyễn Văn An",
        departmentId: "DEP001",
        positionId: "POS001",
        salary: 15000000,
        bonus: 0,
        deduction: 0,
        hireDate: "2020-01-15",
        email: "an.nguyen@company.com",
        phone: "0912345678",
        address: "Hà Nội",
      },
      {
        id: "EMP002",
        name: "Trần Thị Bình",
        departmentId: "DEP002",
        positionId: "POS002",
        salary: 12000000,
        bonus: 0,
        deduction: 0,
        hireDate: "2020-03-20",
        email: "binh.tran@company.com",
        phone: "0923456789",
        address: "Hồ Chí Minh",
      },
      {
        id: "EMP003",
        name: "Lê Văn Cường",
        departmentId: "DEP001",
        positionId: "POS003",
        salary: 10000000,
        bonus: 0,
        deduction: 0,
        hireDate: "2021-05-10",
        email: "cuong.le@company.com",
        phone: "0934567890",
        address: "Đà Nẵng",
      },
      {
        id: "EMP004",
        name: "Phạm Thị Dung",
        departmentId: "DEP003",
        positionId: "POS004",
        salary: 9000000,
        bonus: 0,
        deduction: 0,
        hireDate: "2021-08-01",
        email: "dung.pham@company.com",
        phone: "0945678901",
        address: "Hà Nội",
      },
      {
        id: "EMP005",
        name: "Hoàng Văn Em",
        departmentId: "DEP002",
        positionId: "POS005",
        salary: 8000000,
        bonus: 0,
        deduction: 0,
        hireDate: "2022-02-14",
        email: "em.hoang@company.com",
        phone: "0956789012",
        address: "Hải Phòng",
      },
    ];
    this.saveEmployees(defaultEmployees);
  }

  // Lấy tất cả nhân viên
  getAllEmployees() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Lấy nhân viên theo ID
  getEmployeeById(id) {
    const employees = this.getAllEmployees();
    return employees.find((emp) => emp.id === id);
  }

  // Lưu danh sách nhân viên
  async saveEmployees(employees) {
    // Giả lập delay khi lưu
    await this.delay(300);
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
  }

  // Thêm nhân viên mới
  async addEmployee(employee) {
    const employees = this.getAllEmployees();
    employees.push(employee);
    await this.saveEmployees(employees);
  }

  // Cập nhật nhân viên
  async updateEmployee(id, updatedData) {
    const employees = this.getAllEmployees();
    const index = employees.findIndex((emp) => emp.id === id);

    if (index !== -1) {
      employees[index] = { ...employees[index], ...updatedData };
      await this.saveEmployees(employees);
      return true;
    }
    return false;
  }

  // Xóa nhân viên
  async deleteEmployee(id) {
    const employees = this.getAllEmployees();
    const filtered = employees.filter((emp) => emp.id !== id);

    if (filtered.length < employees.length) {
      await this.saveEmployees(filtered);
      return true;
    }
    return false;
  }

  // Tạo ID nhân viên mới
  generateEmployeeId() {
    const employees = this.getAllEmployees();
    if (employees.length === 0) {
      return "EMP001";
    }

    // Lấy số lớn nhất từ các ID hiện có
    const numbers = employees
      .map((emp) => parseInt(emp.id.replace("EMP", "")))
      .filter((num) => !isNaN(num));

    const maxNumber = Math.max(...numbers);
    const newNumber = maxNumber + 1;
    return `EMP${String(newNumber).padStart(3, "0")}`;
  }

  // Lọc nhân viên - Higher-order function
  filterEmployees(filterFn) {
    const employees = this.getAllEmployees();
    return employees.filter(filterFn);
  }

  // Sắp xếp nhân viên - Higher-order function
  sortEmployees(sortFn) {
    const employees = this.getAllEmployees();
    return employees.sort(sortFn);
  }

  // Tìm kiếm nhân viên theo nhiều tiêu chí
  searchEmployees(criteria) {
    let employees = this.getAllEmployees();

    // Lọc theo tên (regex)
    if (criteria.name) {
      const regex = new RegExp(criteria.name, "i");
      employees = employees.filter((emp) => regex.test(emp.name));
    }

    // Lọc theo phòng ban
    if (criteria.departmentId) {
      employees = employees.filter(
        (emp) => emp.departmentId === criteria.departmentId
      );
    }

    // Lọc theo vị trí
    if (criteria.positionId) {
      employees = employees.filter(
        (emp) => emp.positionId === criteria.positionId
      );
    }

    // Lọc theo khoảng lương
    if (criteria.minSalary !== undefined) {
      employees = employees.filter((emp) => emp.salary >= criteria.minSalary);
    }
    if (criteria.maxSalary !== undefined) {
      employees = employees.filter((emp) => emp.salary <= criteria.maxSalary);
    }

    return employees;
  }

  // Thống kê nhân viên theo phòng ban (sử dụng reduce - higher-order function)
  getEmployeesByDepartment() {
    // Lấy toàn bộ danh sách nhân viên
    const employees = this.getAllEmployees();

    // Sử dụng reduce để nhóm nhân viên theo departmentId
    return employees.reduce((acc, emp) => {
      const deptId = emp.departmentId; // Lấy departmentId của nhân viên hiện tại

      // Nếu chưa có key này trong accumulator, khởi tạo mảng rỗng
      if (!acc[deptId]) {
        acc[deptId] = [];
      }

      // Thêm nhân viên vào mảng tương ứng với departmentId
      acc[deptId].push(emp);

      // Trả về accumulator để tiếp tục vòng lặp
      return acc;
    }, {}); // Khởi tạo accumulator là object rỗng
  }

  // Tính tổng lương (sử dụng reduce - higher-order function)
  getTotalSalary() {
    // Lấy toàn bộ danh sách nhân viên
    const employees = this.getAllEmployees();

    // Sử dụng reduce để cộng dồn tất cả lương
    // sum: accumulator (giá trị tích lũy), emp: element hiện tại
    // (emp.salary || 0): nếu salary undefined/null thì lấy 0
    // 0: giá trị khởi tạo của accumulator
    return employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  }

  // Hàm delay
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
