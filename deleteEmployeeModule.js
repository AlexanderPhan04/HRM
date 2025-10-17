// DeleteEmployeeModule.js - Module xóa nhân viên
export class DeleteEmployeeModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
  }

  // Render giao diện
  render() {
    return `
            <div class="module-header">
                <h2>Xóa Nhân Viên</h2>
                <p>Tìm kiếm và xóa nhân viên khỏi hệ thống</p>
            </div>
            
            <!-- Form tìm kiếm -->
            <div class="form-container">
                <h3>Tìm kiếm nhân viên</h3>
                <form id="delete-search-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Mã nhân viên</label>
                            <input type="text" id="delete-search-id" placeholder="Ví dụ: EMP001">
                        </div>
                        <div class="form-group">
                            <label>Tên nhân viên</label>
                            <input type="text" id="delete-search-name" placeholder="Nhập tên để tìm">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Tìm kiếm</button>
                </form>
            </div>
            
            <!-- Kết quả tìm kiếm -->
            <div id="delete-results"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners() {
    const searchForm = document.getElementById("delete-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }
  }

  // Xử lý tìm kiếm
  handleSearch() {
    const searchId = document.getElementById("delete-search-id").value.trim();
    const searchName = document
      .getElementById("delete-search-name")
      .value.trim();

    let results = [];

    if (searchId) {
      const employee = this.employeeDb.getEmployeeById(searchId);
      if (employee) {
        results = [employee];
      }
    } else if (searchName) {
      const regex = new RegExp(searchName, "i");
      results = this.employeeDb.filterEmployees((emp) => regex.test(emp.name));
    } else {
      alert("Vui lòng nhập mã hoặc tên nhân viên để tìm kiếm!");
      return;
    }

    this.displayResults(results);
  }

  // Hiển thị kết quả
  displayResults(results) {
    const container = document.getElementById("delete-results");

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

    const departments = this.departmentModule.getAllDepartments();
    const positions = this.positionModule.getAllPositions();

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
                            <th>Email</th>
                            <th>Số điện thoại</th>
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
                                <tr id="emp-row-${emp.id}">
                                    <td>${emp.id}</td>
                                    <td>${emp.name}</td>
                                    <td>${dept ? dept.name : "N/A"}</td>
                                    <td>${pos ? pos.title : "N/A"}</td>
                                    <td>${emp.email}</td>
                                    <td>${emp.phone}</td>
                                    <td>
                                        <button class="btn btn-danger btn-small" onclick="window.deleteEmployeeModule.confirmDelete('${
                                          emp.id
                                        }', '${emp.name}')">
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
        `;
  }

  // Xác nhận xóa
  async confirmDelete(employeeId, employeeName) {
    // Hiển thị confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa nhân viên:\n\n` +
        `Mã: ${employeeId}\n` +
        `Tên: ${employeeName}\n\n` +
        `Hành động này không thể hoàn tác!`
    );

    if (!confirmed) {
      return;
    }

    try {
      // Xóa nhân viên khỏi database
      const success = await this.employeeDb.deleteEmployee(employeeId);

      if (success) {
        alert("Xóa nhân viên thành công!");

        // Xóa dòng khỏi bảng
        const row = document.getElementById(`emp-row-${employeeId}`);
        if (row) {
          row.remove();
        }

        // Kiểm tra nếu không còn kết quả nào
        const tbody = document.querySelector("#delete-results tbody");
        if (tbody && tbody.children.length === 0) {
          this.displayResults([]);
        }
      } else {
        alert("Không thể xóa nhân viên. Vui lòng thử lại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  }
}
