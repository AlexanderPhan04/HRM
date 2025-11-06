// EmployeeDbModule.js - Module quản lý cơ sở dữ liệu nhân viên (kết nối MySQL qua PHP API)
export class EmployeeDbModule {
  constructor() {
    this.apiBaseUrl = "./api.php/employees";
  }

  // Lấy tất cả nhân viên từ API
  async getAllEmployees() {
    try {
      const response = await fetch(this.apiBaseUrl);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  }

  // Lấy nhân viên theo ID từ API
  async getEmployeeById(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching employee:", error);
      return null;
    }
  }

  // Thêm nhân viên mới qua API
  async addEmployee(employee) {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể thêm nhân viên");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật nhân viên qua API
  async updateEmployee(id, updatedData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error updating employee:", error);
      return false;
    }
  }

  // Xóa nhân viên qua API
  async deleteEmployee(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return false;
    }
  }

  // Tạo ID nhân viên mới (giờ server sẽ tự generate)
  async generateEmployeeId() {
    // Server sẽ auto-generate ID, nhưng giữ method này để tương thích
    const employees = await this.getAllEmployees();
    if (employees.length === 0) {
      return "EMP001";
    }

    const numbers = employees
      .map((emp) => parseInt(emp.id.replace("EMP", "")))
      .filter((num) => !isNaN(num));

    const maxNumber = Math.max(...numbers);
    const newNumber = maxNumber + 1;
    return `EMP${String(newNumber).padStart(3, "0")}`;
  }

  // Lọc nhân viên - Higher-order function
  async filterEmployees(filterFn) {
    const employees = await this.getAllEmployees();
    return employees.filter(filterFn);
  }

  // Sắp xếp nhân viên - Higher-order function
  async sortEmployees(sortFn) {
    const employees = await this.getAllEmployees();
    return employees.sort(sortFn);
  }

  // Tìm kiếm nhân viên theo nhiều tiêu chí qua API
  async searchEmployees(criteria) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(criteria),
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error searching employees:", error);
      return [];
    }
  }

  // Thống kê nhân viên theo phòng ban qua API
  async getEmployeesByDepartment(departmentId = null) {
    try {
      const url = departmentId
        ? `${this.apiBaseUrl}/department/${departmentId}`
        : this.apiBaseUrl;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) return {};

      const employees = data.data;

      // Nếu không có departmentId, group tất cả
      if (!departmentId) {
        return employees.reduce((acc, emp) => {
          const deptId = emp.departmentId;
          if (!acc[deptId]) {
            acc[deptId] = [];
          }
          acc[deptId].push(emp);
          return acc;
        }, {});
      }

      return employees;
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      return {};
    }
  }

  // Tính tổng lương qua API
  async getTotalSalary() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/total-salary`);
      const data = await response.json();
      return data.success ? data.data.total : 0;
    } catch (error) {
      console.error("Error fetching total salary:", error);
      return 0;
    }
  }
}
