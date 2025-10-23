// DepartmentModule.js - Module quản lý phòng ban (kết nối MySQL qua PHP API)
export class DepartmentModule {
  constructor() {
    this.apiBaseUrl = "./api.php/departments";
  }

  // Lấy tất cả phòng ban từ API
  async getAllDepartments() {
    try {
      const response = await fetch(this.apiBaseUrl);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  }

  // Lấy phòng ban theo ID từ API
  async getDepartmentById(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching department:", error);
      return null;
    }
  }

  // Thêm phòng ban mới qua API
  async addDepartment(name, description = "", managerId = null) {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, managerId }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể thêm phòng ban");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Sửa phòng ban qua API
  async editDepartment(id, updates) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error updating department:", error);
      return false;
    }
  }

  // Xóa phòng ban qua API
  async deleteDepartment(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error deleting department:", error);
      return false;
    }
  }

  // Tạo ID phòng ban mới (server sẽ tự generate)
  async generateDepartmentId() {
    const departments = await this.getAllDepartments();
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
  async render(employeeDb) {
    const departments = await this.getAllDepartments();
    const employees = await employeeDb.getAllEmployees();
    const nextId = await this.generateDepartmentId();

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
                            <input type="text" value="${nextId}" readonly>
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
  async showEditForm(deptId) {
    const dept = await this.getDepartmentById(deptId);
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
          const content = await this.render(window.currentEmployeeDb);
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
}
