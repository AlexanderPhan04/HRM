// SalaryModule.js - Module quản lý lương
export class SalaryModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
  }

  // Tính lương thực nhận (Net Salary = Base + Bonus - Deduction)
  calculateNetSalary(employee) {
    // Lấy lương cơ bản, nếu undefined thì mặc định là 0
    const baseSalary = employee.salary || 0;
    // Lấy tiền thưởng, nếu undefined thì mặc định là 0
    const bonus = employee.bonus || 0;
    // Lấy tiền khấu trừ (bảo hiểm, thuế...), nếu undefined thì mặc định là 0
    const deduction = employee.deduction || 0;

    // Công thức: Lương thực nhận = Lương cơ bản + Thưởng - Khấu trừ
    return baseSalary + bonus - deduction;
  }

  // Tạo báo cáo lương (sử dụng map - higher-order function)
  generatePayrollReport() {
    // Lấy danh sách tất cả nhân viên từ employeeDb
    const employees = this.employeeDb.getAllEmployees();

    // Sử dụng map để transform mỗi employee thành payroll record
    return employees.map((emp) => {
      // Tính lương thực nhận cho nhân viên này
      const netSalary = this.calculateNetSalary(emp);
      // Lấy thông tin phòng ban từ departmentId
      const department = this.departmentModule.getDepartmentById(
        emp.departmentId
      );
      // Lấy thông tin vị trí từ positionId
      const position = this.positionModule.getPositionById(emp.positionId);

      // Trả về object mới với thông tin đầy đủ
      return {
        ...emp, // Spread operator: copy tất cả properties của emp
        // Ternary operator: department ? truthy : falsy
        departmentName: department ? department.name : "N/A",
        positionTitle: position ? position.title : "N/A",
        netSalary, // ES6 shorthand (equivalent to netSalary: netSalary)
      };
    });
  }

  // Render giao diện
  render() {
    const payroll = this.generatePayrollReport();

    // Tính tổng lương - sử dụng reduce
    const totalBaseSalary = payroll.reduce(
      (sum, emp) => sum + (emp.salary || 0),
      0
    );
    const totalBonus = payroll.reduce((sum, emp) => sum + (emp.bonus || 0), 0);
    const totalDeduction = payroll.reduce(
      (sum, emp) => sum + (emp.deduction || 0),
      0
    );
    const totalNetSalary = payroll.reduce((sum, emp) => sum + emp.netSalary, 0);

    return `
            <div class="module-header">
                <h2>Quản Lý Lương</h2>
                <p>Xem và cập nhật thông tin lương nhân viên</p>
            </div>
            
            <!-- Thống kê -->
            <div class="stats-container">
                <div class="stat-card">
                    <h3>${this.formatCurrency(totalBaseSalary)}</h3>
                    <p>Tổng Lương Cơ Bản</p>
                </div>
                <div class="stat-card">
                    <h3>${this.formatCurrency(totalBonus)}</h3>
                    <p>Tổng Thưởng</p>
                </div>
                <div class="stat-card">
                    <h3>${this.formatCurrency(totalDeduction)}</h3>
                    <p>Tổng Khấu Trừ</p>
                </div>
                <div class="stat-card">
                    <h3>${this.formatCurrency(totalNetSalary)}</h3>
                    <p>Tổng Lương Thực Nhận</p>
                </div>
            </div>
            
            <!-- Bảng lương -->
            <div class="card">
                <h3>Bảng Lương Nhân Viên</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mã NV</th>
                            <th>Họ tên</th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th>
                            <th>Lương cơ bản</th>
                            <th>Thưởng</th>
                            <th>Khấu trừ</th>
                            <th>Thực nhận</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payroll
                          .map(
                            (emp) => `
                            <tr>
                                <td>${emp.id}</td>
                                <td>${emp.name}</td>
                                <td>${emp.departmentName}</td>
                                <td>${emp.positionTitle}</td>
                                <td>${this.formatCurrency(emp.salary)}</td>
                                <td>${this.formatCurrency(emp.bonus || 0)}</td>
                                <td>${this.formatCurrency(
                                  emp.deduction || 0
                                )}</td>
                                <td><strong>${this.formatCurrency(
                                  emp.netSalary
                                )}</strong></td>
                                <td>
                                    <button class="btn btn-primary btn-small" onclick="window.salaryModule.showUpdateForm('${
                                      emp.id
                                    }')">
                                        Cập nhật
                                    </button>
                                </td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
            
            <!-- Modal cập nhật -->
            <div id="update-salary-modal"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners() {
    // Event listeners handled by onclick in buttons
  }

  // Hiển thị form cập nhật lương
  showUpdateForm(employeeId) {
    const employee = this.employeeDb.getEmployeeById(employeeId);
    if (!employee) return;

    const modal = document.getElementById("update-salary-modal");
    modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="form-container" style="max-width: 500px; margin: 0;">
                    <h3>Cập Nhật Lương: ${employee.name}</h3>
                    <form id="update-salary-form">
                        <div class="form-group">
                            <label>Mã nhân viên</label>
                            <input type="text" value="${employee.id}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Lương cơ bản (VNĐ) *</label>
                            <input type="number" id="update-salary" value="${
                              employee.salary
                            }" min="0" step="100000" required>
                        </div>
                        <div class="form-group">
                            <label>Thưởng (VNĐ)</label>
                            <input type="number" id="update-bonus" value="${
                              employee.bonus || 0
                            }" min="0" step="100000">
                        </div>
                        <div class="form-group">
                            <label>Khấu trừ (VNĐ)</label>
                            <input type="number" id="update-deduction" value="${
                              employee.deduction || 0
                            }" min="0" step="100000">
                        </div>
                        <div class="form-group">
                            <label>Lương thực nhận</label>
                            <input type="text" id="net-salary-display" readonly>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success">Lưu</button>
                            <button type="button" class="btn btn-secondary" onclick="window.salaryModule.closeUpdateForm()">Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

    // Tính lương thực nhận khi thay đổi
    const updateNetSalary = () => {
      const salary =
        parseFloat(document.getElementById("update-salary").value) || 0;
      const bonus =
        parseFloat(document.getElementById("update-bonus").value) || 0;
      const deduction =
        parseFloat(document.getElementById("update-deduction").value) || 0;
      const net = salary + bonus - deduction;
      document.getElementById("net-salary-display").value =
        this.formatCurrency(net);
    };

    // Gắn events
    ["update-salary", "update-bonus", "update-deduction"].forEach((id) => {
      document.getElementById(id).addEventListener("input", updateNetSalary);
    });

    // Hiển thị lương thực nhận ban đầu
    updateNetSalary();

    // Xử lý submit
    document
      .getElementById("update-salary-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const updates = {
          salary: parseFloat(document.getElementById("update-salary").value),
          bonus: parseFloat(document.getElementById("update-bonus").value) || 0,
          deduction:
            parseFloat(document.getElementById("update-deduction").value) || 0,
        };

        if (updates.salary <= 0) {
          alert("Lương cơ bản phải lớn hơn 0!");
          return;
        }

        await this.employeeDb.updateEmployee(employeeId, updates);
        alert("Cập nhật lương thành công!");
        this.closeUpdateForm();

        // Refresh
        const content = this.render();
        document.getElementById("content-area").innerHTML = content;
        this.attachEventListeners();
      });
  }

  // Đóng form cập nhật
  closeUpdateForm() {
    document.getElementById("update-salary-modal").innerHTML = "";
  }

  // Format tiền tệ
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
}
