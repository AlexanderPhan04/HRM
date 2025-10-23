// EditEmployeeModule.js - Module sửa thông tin nhân viên
export class EditEmployeeModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
    this.currentEmployee = null; // Closure để lưu trạng thái
  }

  // Render giao diện
  render() {
    return `
            <div class="module-header">
                <h2>Sửa Thông Tin Nhân Viên</h2>
                <p>Tìm kiếm nhân viên để chỉnh sửa thông tin</p>
            </div>
            
            <!-- Form tìm kiếm -->
            <div class="form-container">
                <h3>Tìm kiếm nhân viên</h3>
                <form id="search-employee-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Mã nhân viên</label>
                            <input type="text" id="search-id" placeholder="Ví dụ: EMP001">
                        </div>
                        <div class="form-group">
                            <label>Tên nhân viên</label>
                            <input type="text" id="search-name" placeholder="Nhập tên để tìm">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Tìm kiếm</button>
                </form>
            </div>
            
            <!-- Kết quả tìm kiếm -->
            <div id="search-results"></div>
            
            <!-- Form chỉnh sửa -->
            <div id="edit-form-container"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners() {
    const searchForm = document.getElementById("search-employee-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }
  }

  // Xử lý tìm kiếm
  async handleSearch() {
    const searchId = document.getElementById("search-id").value.trim();
    const searchName = document.getElementById("search-name").value.trim();

    let results = [];

    if (searchId) {
      const employee = await this.employeeDb.getEmployeeById(searchId);
      if (employee) {
        results = [employee];
      }
    } else if (searchName) {
      const regex = new RegExp(searchName, "i");
      results = await this.employeeDb.filterEmployees((emp) =>
        regex.test(emp.name)
      );
    } else {
      alert("Vui lòng nhập mã hoặc tên nhân viên để tìm kiếm!");
      return;
    }

    await this.displaySearchResults(results);
  }

  // Hiển thị kết quả tìm kiếm
  async displaySearchResults(results) {
    const container = document.getElementById("search-results");

    if (results.length === 0) {
      container.innerHTML = `
                <div class="card">
                    <div class="empty-state">
                        <h3>Không tìm thấy nhân viên</h3>
                        <p>Vui lòng thử lại với từ khóa khác</p>
                    </div>
                </div>
            `;
      return;
    }

    const departments = (await this.departmentModule.getAllDepartments()) || [];
    const positions = (await this.positionModule.getAllPositions()) || [];

    container.innerHTML = `
            <div class="card">
                <h3>Kết quả tìm kiếm (${results.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mã NV</th>
                            <th>Họ tên</th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th>
                            <th>Lương</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results
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
                                    <td>${this.formatCurrency(emp.salary)}</td>
                                    <td>
                                        <button class="btn btn-primary btn-small" onclick="window.editEmployeeModule.loadEditForm('${
                                          emp.id
                                        }')">
                                            Chỉnh sửa
                                        </button>
                                    </td>
                                </tr>
                            `;
                          })
                          .join("")}
                    </tbody>
                </table>
            </div>
        `;
  }

  // Load form chỉnh sửa
  async loadEditForm(employeeId) {
    this.currentEmployee = await this.employeeDb.getEmployeeById(employeeId);

    if (!this.currentEmployee) {
      alert("Không tìm thấy nhân viên!");
      return;
    }

    const departments = (await this.departmentModule.getAllDepartments()) || [];
    const positions = (await this.positionModule.getAllPositions()) || [];

    const container = document.getElementById("edit-form-container");
    container.innerHTML = `
            <div class="form-container">
                <h3>Chỉnh sửa thông tin: ${this.currentEmployee.name}</h3>
                <form id="edit-employee-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Mã nhân viên</label>
                            <input type="text" value="${
                              this.currentEmployee.id
                            }" readonly>
                        </div>
                        <div class="form-group">
                            <label>Họ tên *</label>
                            <input type="text" id="edit-name" value="${
                              this.currentEmployee.name
                            }" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" id="edit-email" value="${
                              this.currentEmployee.email
                            }" required>
                        </div>
                        <div class="form-group">
                            <label>Số điện thoại *</label>
                            <input type="tel" id="edit-phone" value="${
                              this.currentEmployee.phone
                            }" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phòng ban *</label>
                            <select id="edit-department" required>
                                ${departments
                                  .map(
                                    (dept) =>
                                      `<option value="${dept.id}" ${
                                        dept.id ===
                                        this.currentEmployee.departmentId
                                          ? "selected"
                                          : ""
                                      }>${dept.name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Vị trí *</label>
                            <select id="edit-position" required>
                                ${positions
                                  .map(
                                    (pos) =>
                                      `<option value="${pos.id}" ${
                                        pos.id ===
                                        this.currentEmployee.positionId
                                          ? "selected"
                                          : ""
                                      }>${pos.title}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Lương cơ bản (VNĐ) *</label>
                            <input type="number" id="edit-salary" value="${
                              this.currentEmployee.salary
                            }" min="0" step="100000" required>
                        </div>
                        <div class="form-group">
                            <label>Ngày vào làm *</label>
                            <input type="date" id="edit-hiredate" value="${
                              this.currentEmployee.hireDate
                            }" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <textarea id="edit-address" rows="3">${
                          this.currentEmployee.address || ""
                        }</textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-success">Lưu thay đổi</button>
                        <button type="button" class="btn btn-secondary" onclick="window.editEmployeeModule.cancelEdit()">Hủy</button>
                    </div>
                </form>
                
                <div id="edit-result"></div>
            </div>
        `;

    // Gắn event cho form edit
    const editForm = document.getElementById("edit-employee-form");
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleUpdate();
    });

    // Scroll to form
    container.scrollIntoView({ behavior: "smooth" });
  }

  // Xử lý cập nhật
  async handleUpdate() {
    if (!this.currentEmployee) return;

    // Xác nhận trước khi lưu
    if (!confirm("Bạn có chắc chắn muốn lưu các thay đổi?")) {
      return;
    }

    const updatedData = {
      name: document.getElementById("edit-name").value.trim(),
      email: document.getElementById("edit-email").value.trim(),
      phone: document.getElementById("edit-phone").value.trim(),
      departmentId: document.getElementById("edit-department").value,
      positionId: document.getElementById("edit-position").value,
      salary: parseFloat(document.getElementById("edit-salary").value),
      hireDate: document.getElementById("edit-hiredate").value,
      address: document.getElementById("edit-address").value.trim(),
    };

    try {
      await this.employeeDb.updateEmployee(
        this.currentEmployee.id,
        updatedData
      );
      this.showMessage("Cập nhật thông tin thành công!", "success");

      // Refresh search results
      this.handleSearch();
    } catch (error) {
      this.showMessage("Có lỗi xảy ra: " + error.message, "error");
    }
  }

  // Hủy chỉnh sửa
  cancelEdit() {
    this.currentEmployee = null;
    document.getElementById("edit-form-container").innerHTML = "";
  }

  // Hiển thị thông báo
  showMessage(message, type) {
    const resultDiv = document.getElementById("edit-result");
    resultDiv.innerHTML = `
            <div class="message message-${type}">
                ${message}
            </div>
        `;

    setTimeout(() => {
      resultDiv.innerHTML = "";
    }, 5000);
  }

  // Format tiền tệ
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
}
