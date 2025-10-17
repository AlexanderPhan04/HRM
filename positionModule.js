// PositionModule.js - Module quản lý vị trí công việc
export class PositionModule {
  constructor() {
    this.storageKey = "hrm_positions";
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
    const defaultPositions = [
      {
        id: "POS001",
        title: "Giám đốc",
        description: "Giám đốc công ty",
        salaryBase: 30000000,
      },
      {
        id: "POS002",
        title: "Trưởng phòng",
        description: "Quản lý phòng ban",
        salaryBase: 20000000,
      },
      {
        id: "POS003",
        title: "Nhân viên chính thức",
        description: "Nhân viên full-time",
        salaryBase: 12000000,
      },
      {
        id: "POS004",
        title: "Nhân viên thử việc",
        description: "Nhân viên đang thử việc",
        salaryBase: 8000000,
      },
      {
        id: "POS005",
        title: "Thực tập sinh",
        description: "Sinh viên thực tập",
        salaryBase: 5000000,
      },
    ];
    localStorage.setItem(this.storageKey, JSON.stringify(defaultPositions));
  }

  // Lấy tất cả vị trí
  getAllPositions() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Lấy vị trí theo ID
  getPositionById(id) {
    const positions = this.getAllPositions();
    return positions.find((pos) => pos.id === id);
  }

  // Lưu danh sách vị trí
  async savePositions(positions) {
    await this.delay(300);
    localStorage.setItem(this.storageKey, JSON.stringify(positions));
  }

  // Thêm vị trí mới
  async addPosition(title, description = "", salaryBase = 0) {
    const positions = this.getAllPositions();
    const newPosition = {
      id: this.generatePositionId(),
      title,
      description,
      salaryBase,
    };
    positions.push(newPosition);
    await this.savePositions(positions);
    return newPosition;
  }

  // Sửa vị trí
  async editPosition(id, updates) {
    const positions = this.getAllPositions();
    const index = positions.findIndex((pos) => pos.id === id);

    if (index !== -1) {
      positions[index] = { ...positions[index], ...updates };
      await this.savePositions(positions);
      return true;
    }
    return false;
  }

  // Xóa vị trí
  async deletePosition(id) {
    const positions = this.getAllPositions();
    const filtered = positions.filter((pos) => pos.id !== id);

    if (filtered.length < positions.length) {
      await this.savePositions(filtered);
      return true;
    }
    return false;
  }

  // Tạo ID vị trí mới
  generatePositionId() {
    const positions = this.getAllPositions();
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
  render(employeeDb) {
    const positions = this.getAllPositions();
    const employees = employeeDb.getAllEmployees();

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
                            <input type="text" value="${this.generatePositionId()}" readonly>
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
                              (e) => e.positionId === pos.id
                            ).length;
                            return `
                                <tr id="pos-row-${pos.id}">
                                    <td>${pos.id}</td>
                                    <td>${pos.title}</td>
                                    <td>${this.formatCurrency(
                                      pos.salaryBase
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
      const content = this.render(employeeDb);
      document.getElementById("content-area").innerHTML = content;
      this.attachEventListeners(employeeDb);
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  }

  // Hiển thị form sửa
  showEditForm(posId) {
    const pos = this.getPositionById(posId);
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
                              pos.salaryBase
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
          const content = this.render(window.currentEmployeeDb);
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

  // Hàm delay
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
