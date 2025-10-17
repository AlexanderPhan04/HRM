// DepartmentModule.js - Module quản lý phòng ban
export class DepartmentModule {
  constructor() {
    this.storageKey = "hrm_departments";
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
    const defaultDepartments = [
      {
        id: "DEP001",
        name: "Phòng Kinh doanh",
        managerId: "EMP001",
        description: "Phòng kinh doanh và bán hàng",
      },
      {
        id: "DEP002",
        name: "Phòng Kỹ thuật",
        managerId: "EMP002",
        description: "Phòng phát triển sản phẩm",
      },
      {
        id: "DEP003",
        name: "Phòng Nhân sự",
        managerId: null,
        description: "Phòng quản lý nhân sự",
      },
      {
        id: "DEP004",
        name: "Phòng Kế toán",
        managerId: null,
        description: "Phòng tài chính kế toán",
      },
    ];
    localStorage.setItem(this.storageKey, JSON.stringify(defaultDepartments));
  }

  // Lấy tất cả phòng ban
  getAllDepartments() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Lấy phòng ban theo ID
  getDepartmentById(id) {
    const departments = this.getAllDepartments();
    return departments.find((dept) => dept.id === id);
  }

  // Lưu danh sách phòng ban
  async saveDepartments(departments) {
    await this.delay(300);
    localStorage.setItem(this.storageKey, JSON.stringify(departments));
  }

  // Thêm phòng ban mới
  async addDepartment(name, description = "", managerId = null) {
    const departments = this.getAllDepartments();
    const newDepartment = {
      id: this.generateDepartmentId(),
      name,
      description,
      managerId,
    };
    departments.push(newDepartment);
    await this.saveDepartments(departments);
    return newDepartment;
  }

  // Sửa phòng ban
  async editDepartment(id, updates) {
    const departments = this.getAllDepartments();
    const index = departments.findIndex((dept) => dept.id === id);

    if (index !== -1) {
      departments[index] = { ...departments[index], ...updates };
      await this.saveDepartments(departments);
      return true;
    }
    return false;
  }

  // Xóa phòng ban
  async deleteDepartment(id) {
    const departments = this.getAllDepartments();
    const filtered = departments.filter((dept) => dept.id !== id);

    if (filtered.length < departments.length) {
      await this.saveDepartments(filtered);
      return true;
    }
    return false;
  }

  // Tạo ID phòng ban mới
  generateDepartmentId() {
    const departments = this.getAllDepartments();
    if (departments.length === 0) {
      return "DEP001";
    }

    const numbers = departments
      .map((dept) => parseInt(dept.id.replace("DEP", "")))
      .filter((num) => !isNaN(num));

    const maxNumber = Math.max(...numbers);
    const newNumber = maxNumber + 1;
    return `DEP${String(newNumber).padStart(3, "0")}`;
  }

  // Render giao diện
  render(employeeDb) {
    const departments = this.getAllDepartments();
    const employees = employeeDb.getAllEmployees();

    return `
            <div class="module-header">
                <h2>Quản Lý Phòng Ban</h2>
                <p>Thêm, sửa, xóa phòng ban trong hệ thống</p>
            </div>
            
            <!-- Form thêm phòng ban -->
            <div class="form-container">
                <h3>Thêm Phòng Ban Mới</h3>
                <form id="add-department-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Mã phòng ban</label>
                            <input type="text" value="${this.generateDepartmentId()}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Tên phòng ban *</label>
                            <input type="text" id="dept-name" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Trưởng phòng</label>
                            <select id="dept-manager">
                                <option value="">-- Chưa chọn --</option>
                                ${employees
                                  .map(
                                    (emp) =>
                                      `<option value="${emp.id}">${emp.name} (${emp.id})</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Mô tả</label>
                            <input type="text" id="dept-description">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Thêm phòng ban</button>
                </form>
            </div>
            
            <!-- Danh sách phòng ban -->
            <div class="card">
                <h3>Danh Sách Phòng Ban (${departments.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Tên phòng ban</th>
                            <th>Trưởng phòng</th>
                            <th>Số nhân viên</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${departments
                          .map((dept) => {
                            const manager = employees.find(
                              (e) => e.id === dept.managerId
                            );
                            const empCount = employees.filter(
                              (e) => e.departmentId === dept.id
                            ).length;
                            return `
                                <tr id="dept-row-${dept.id}">
                                    <td>${dept.id}</td>
                                    <td>${dept.name}</td>
                                    <td>${
                                      manager ? manager.name : "Chưa có"
                                    }</td>
                                    <td>${empCount}</td>
                                    <td>${dept.description || ""}</td>
                                    <td class="action-buttons">
                                        <button class="btn btn-primary btn-small" onclick="window.departmentModule.showEditForm('${
                                          dept.id
                                        }')">
                                            Sửa
                                        </button>
                                        <button class="btn btn-danger btn-small" onclick="window.departmentModule.confirmDelete('${
                                          dept.id
                                        }', '${dept.name}', ${empCount})">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            `;
                          })
                          .join("")}
                    </tbody>
                </table>
            </div>
            
            <!-- Modal edit -->
            <div id="edit-dept-modal"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners(employeeDb) {
    const addForm = document.getElementById("add-department-form");
    if (addForm) {
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAdd(employeeDb);
      });
    }
  }

  // Xử lý thêm phòng ban
  async handleAdd(employeeDb) {
    const name = document.getElementById("dept-name").value.trim();
    const managerId = document.getElementById("dept-manager").value || null;
    const description = document
      .getElementById("dept-description")
      .value.trim();

    if (!name) {
      alert("Vui lòng nhập tên phòng ban!");
      return;
    }

    try {
      await this.addDepartment(name, description, managerId);
      alert("Thêm phòng ban thành công!");

      // Render lại
      const content = this.render(employeeDb);
      document.getElementById("content-area").innerHTML = content;
      this.attachEventListeners(employeeDb);
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  }

  // Hiển thị form sửa
  showEditForm(deptId) {
    const dept = this.getDepartmentById(deptId);
    if (!dept) return;

    const modal = document.getElementById("edit-dept-modal");
    modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="form-container" style="max-width: 500px; margin: 0;">
                    <h3>Sửa Phòng Ban: ${dept.name}</h3>
                    <form id="edit-dept-form">
                        <div class="form-group">
                            <label>Tên phòng ban *</label>
                            <input type="text" id="edit-dept-name" value="${
                              dept.name
                            }" required>
                        </div>
                        <div class="form-group">
                            <label>Mô tả</label>
                            <input type="text" id="edit-dept-description" value="${
                              dept.description || ""
                            }">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success">Lưu</button>
                            <button type="button" class="btn btn-secondary" onclick="window.departmentModule.closeEditForm()">Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

    document
      .getElementById("edit-dept-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = document.getElementById("edit-dept-name").value.trim();
        const newDescription = document
          .getElementById("edit-dept-description")
          .value.trim();

        await this.editDepartment(deptId, {
          name: newName,
          description: newDescription,
        });
        alert("Cập nhật thành công!");
        this.closeEditForm();

        // Reload module (needs to be called from app.js)
        if (window.currentEmployeeDb) {
          const content = this.render(window.currentEmployeeDb);
          document.getElementById("content-area").innerHTML = content;
          this.attachEventListeners(window.currentEmployeeDb);
        }
      });
  }

  // Đóng form sửa
  closeEditForm() {
    document.getElementById("edit-dept-modal").innerHTML = "";
  }

  // Xác nhận xóa
  async confirmDelete(deptId, deptName, empCount) {
    if (empCount > 0) {
      alert(
        `Không thể xóa phòng ban "${deptName}" vì vẫn còn ${empCount} nhân viên!`
      );
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa phòng ban "${deptName}"?`)) {
      return;
    }

    try {
      await this.deleteDepartment(deptId);
      alert("Xóa phòng ban thành công!");

      const row = document.getElementById(`dept-row-${deptId}`);
      if (row) row.remove();
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  }

  // Hàm delay
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
