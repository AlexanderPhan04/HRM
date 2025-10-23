// PositionModule.js - Module quản lý vị trí công việc (kết nối MySQL qua PHP API)
export class PositionModule {
  constructor() {
    this.apiBaseUrl = "./api.php/positions";
  }

  // Lấy tất cả vị trí từ API
  async getAllPositions() {
    try {
      const response = await fetch(this.apiBaseUrl);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching positions:", error);
      return [];
    }
  }

  // Lấy vị trí theo ID từ API
  async getPositionById(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching position:", error);
      return null;
    }
  }

  // Thêm vị trí mới qua API
  async addPosition(title, description = "", salaryBase = 0) {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, salaryBase }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể thêm vị trí");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Sửa vị trí qua API
  async editPosition(id, updates) {
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
      console.error("Error updating position:", error);
      return false;
    }
  }

  // Xóa vị trí qua API
  async deletePosition(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error deleting position:", error);
      return false;
    }
  }

  // Tạo ID vị trí mới (server sẽ tự generate)
  async generatePositionId() {
    const positions = await this.getAllPositions();
    if (positions.length === 0) {
      return "POS001";
    }

    const numbers = positions
      .map((pos) => parseInt(pos.id.replace("POS", "")))
      .filter((num) => !isNaN(num));

    const maxNumber = Math.max(...numbers);
    const newNumber = maxNumber + 1;
    return `POS${String(newNumber).padStart(3, "0")}`;
  }

  // Render giao diện
  async render(employeeDb) {
    const positions = await this.getAllPositions();
    const employees = await employeeDb.getAllEmployees();
    const nextId = await this.generatePositionId();

    return `
            <div class="module-header">
                <h2>Quản Lý Vị Trí Công Việc</h2>
                <p>Thêm, sửa, xóa vị trí công việc trong hệ thống</p>
            </div>
            
            <!-- Form thêm vị trí -->
            <div class="form-container">
                <h3>Thêm Vị Trí Mới</h3>
                <form id="add-position-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Mã vị trí</label>
                            <input type="text" value="${nextId}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Tên vị trí *</label>
                            <input type="text" id="pos-title" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Lương cơ bản (VNĐ) *</label>
                            <input type="number" id="pos-salary" min="0" step="100000" required>
                        </div>
                        <div class="form-group">
                            <label>Mô tả</label>
                            <input type="text" id="pos-description">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Thêm vị trí</button>
                </form>
            </div>
            
            <!-- Danh sách vị trí -->
            <div class="card">
                <h3>Danh Sách Vị Trí (${positions.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Tên vị trí</th>
                            <th>Lương cơ bản</th>
                            <th>Mô tả</th>
                            <th>Số nhân viên</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${positions
                          .map((pos) => {
                            const empCount = employees.filter(
                              (e) => e.position_id === pos.id
                            ).length;
                            return `
                                <tr id="pos-row-${pos.id}">
                                    <td>${pos.id}</td>
                                    <td>${pos.title}</td>
                                    <td>${this.formatCurrency(
                                      pos.salary_base
                                    )}</td>
                                    <td>${pos.description || ""}</td>
                                    <td>${empCount}</td>
                                    <td class="action-buttons">
                                        <button class="btn btn-primary btn-small" onclick="window.positionModule.showEditForm('${
                                          pos.id
                                        }')">
                                            Sửa
                                        </button>
                                        <button class="btn btn-danger btn-small" onclick="window.positionModule.confirmDelete('${
                                          pos.id
                                        }', '${pos.title}', ${empCount})">
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
            <div id="edit-pos-modal"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners(employeeDb) {
    const addForm = document.getElementById("add-position-form");
    if (addForm) {
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAdd(employeeDb);
      });
    }
  }

  // Xử lý thêm vị trí
  async handleAdd(employeeDb) {
    const title = document.getElementById("pos-title").value.trim();
    const salaryBase = parseFloat(document.getElementById("pos-salary").value);
    const description = document.getElementById("pos-description").value.trim();

    if (!title) {
      alert("Vui lòng nhập tên vị trí!");
      return;
    }

    if (!salaryBase || salaryBase <= 0) {
      alert("Lương cơ bản phải lớn hơn 0!");
      return;
    }

    try {
      await this.addPosition(title, description, salaryBase);
      alert("Thêm vị trí thành công!");

      // Render lại
      const content = await this.render(employeeDb);
      document.getElementById("content-area").innerHTML = content;
      this.attachEventListeners(employeeDb);
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  }

  // Hiển thị form sửa
  async showEditForm(posId) {
    const pos = await this.getPositionById(posId);
    if (!pos) return;

    const modal = document.getElementById("edit-pos-modal");
    modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="form-container" style="max-width: 500px; margin: 0;">
                    <h3>Sửa Vị Trí: ${pos.title}</h3>
                    <form id="edit-pos-form">
                        <div class="form-group">
                            <label>Tên vị trí *</label>
                            <input type="text" id="edit-pos-title" value="${
                              pos.title
                            }" required>
                        </div>
                        <div class="form-group">
                            <label>Lương cơ bản (VNĐ) *</label>
                            <input type="number" id="edit-pos-salary" value="${
                              pos.salary_base
                            }" min="0" step="100000" required>
                        </div>
                        <div class="form-group">
                            <label>Mô tả</label>
                            <input type="text" id="edit-pos-description" value="${
                              pos.description || ""
                            }">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success">Lưu</button>
                            <button type="button" class="btn btn-secondary" onclick="window.positionModule.closeEditForm()">Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

    document
      .getElementById("edit-pos-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const updates = {
          title: document.getElementById("edit-pos-title").value.trim(),
          salaryBase: parseFloat(
            document.getElementById("edit-pos-salary").value
          ),
          description: document
            .getElementById("edit-pos-description")
            .value.trim(),
        };

        await this.editPosition(posId, updates);
        alert("Cập nhật thành công!");
        this.closeEditForm();

        if (window.currentEmployeeDb) {
          const content = await this.render(window.currentEmployeeDb);
          document.getElementById("content-area").innerHTML = content;
          this.attachEventListeners(window.currentEmployeeDb);
        }
      });
  }

  // Đóng form sửa
  closeEditForm() {
    document.getElementById("edit-pos-modal").innerHTML = "";
  }

  // Xác nhận xóa
  async confirmDelete(posId, posTitle, empCount) {
    if (empCount > 0) {
      alert(
        `Không thể xóa vị trí "${posTitle}" vì vẫn còn ${empCount} nhân viên!`
      );
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa vị trí "${posTitle}"?`)) {
      return;
    }

    try {
      await this.deletePosition(posId);
      alert("Xóa vị trí thành công!");

      const row = document.getElementById(`pos-row-${posId}`);
      if (row) row.remove();
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  }

  // Format tiền tệ
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
}
