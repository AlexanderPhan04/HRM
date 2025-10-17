// LeaveModule.js - Module quản lý nghỉ phép
export class LeaveModule {
  constructor(employeeDb) {
    this.employeeDb = employeeDb;
    this.storageKey = "hrm_leaves";
    this.init();
  }

  // Khởi tạo
  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Lấy tất cả yêu cầu nghỉ phép
  getAllLeaves() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Lưu danh sách nghỉ phép
  async saveLeaves(leaves) {
    await this.delay(300);
    localStorage.setItem(this.storageKey, JSON.stringify(leaves));
  }

  // Yêu cầu nghỉ phép
  async requestLeave(employeeId, startDate, endDate, type, reason = "") {
    const leaves = this.getAllLeaves();

    // Kiểm tra ngày hợp lệ
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      throw new Error("Ngày kết thúc phải sau ngày bắt đầu!");
    }

    // Tính số ngày
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: this.generateLeaveId(),
      employeeId,
      startDate,
      endDate,
      type, // annual, sick
      reason,
      days,
      status: "pending", // pending, approved, rejected
      requestDate: new Date().toISOString(),
      approvedBy: null,
      approvedDate: null,
    };

    leaves.push(newLeave);
    await this.saveLeaves(leaves);
    return newLeave;
  }

  // Phê duyệt nghỉ phép
  async approveLeave(leaveId, approved = true) {
    const leaves = this.getAllLeaves();
    const leave = leaves.find((l) => l.id === leaveId);

    if (!leave) {
      throw new Error("Không tìm thấy yêu cầu!");
    }

    leave.status = approved ? "approved" : "rejected";
    leave.approvedDate = new Date().toISOString();

    await this.saveLeaves(leaves);
    return leave;
  }

  // Lấy số ngày phép còn lại (sử dụng filter và reduce)
  getLeaveBalance(employeeId) {
    const defaultAnnualLeave = 20; // Quy định: mỗi nhân viên có 20 ngày phép năm
    // Lấy tất cả các yêu cầu nghỉ phép từ localStorage
    const leaves = this.getAllLeaves();

    // Tính tổng số ngày đã nghỉ (chỉ tính những đơn đã approved)
    const usedDays = leaves
      .filter(
        // Bước 1: Lọc các yêu cầu nghỉ phép theo điều kiện
        (l) =>
          l.employeeId === employeeId && // Của nhân viên này
          l.status === "approved" && // Đã được phê duyệt
          l.type === "annual" // Chỉ tính nghỉ phép năm (không tính sick leave)
      )
      .reduce((sum, l) => sum + l.days, 0); // Bước 2: Cộng dồn số ngày (reduce)

    // Trả về object chứa thông tin về số ngày phép
    return {
      total: defaultAnnualLeave, // Tổng số ngày được phép nghỉ
      used: usedDays, // Số ngày đã sử dụng
      remaining: defaultAnnualLeave - usedDays, // Số ngày còn lại
    };
  }

  // Tạo ID nghỉ phép mới
  generateLeaveId() {
    return "LEAVE" + Date.now();
  }

  // Render giao diện
  render() {
    const employees = this.employeeDb.getAllEmployees();
    const leaves = this.getAllLeaves();
    const pendingLeaves = leaves.filter((l) => l.status === "pending");

    return `
            <div class="module-header">
                <h2>Quản Lý Nghỉ Phép</h2>
                <p>Yêu cầu và phê duyệt nghỉ phép</p>
            </div>
            
            <!-- Form yêu cầu nghỉ phép -->
            <div class="form-container">
                <h3>Yêu Cầu Nghỉ Phép</h3>
                <form id="leave-request-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nhân viên *</label>
                            <select id="leave-employee" required>
                                <option value="">-- Chọn nhân viên --</option>
                                ${employees
                                  .map((emp) => {
                                    const balance = this.getLeaveBalance(
                                      emp.id
                                    );
                                    return `<option value="${emp.id}">${emp.name} - Còn ${balance.remaining} ngày</option>`;
                                  })
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Loại nghỉ *</label>
                            <select id="leave-type" required>
                                <option value="annual">Phép năm</option>
                                <option value="sick">Ốm đau</option>
                                <option value="personal">Cá nhân</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Từ ngày *</label>
                            <input type="date" id="leave-start" required>
                        </div>
                        <div class="form-group">
                            <label>Đến ngày *</label>
                            <input type="date" id="leave-end" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Lý do</label>
                        <textarea id="leave-reason" rows="3"></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Gửi yêu cầu</button>
                </form>
                <div id="leave-message"></div>
            </div>
            
            <!-- Danh sách yêu cầu chờ duyệt -->
            <div class="card">
                <h3>Yêu Cầu Chờ Duyệt (${pendingLeaves.length})</h3>
                ${
                  pendingLeaves.length === 0
                    ? `
                    <div class="empty-state">
                        <p>Không có yêu cầu nào chờ duyệt</p>
                    </div>
                `
                    : `
                    <table>
                        <thead>
                            <tr>
                                <th>Mã NV</th>
                                <th>Họ tên</th>
                                <th>Loại</th>
                                <th>Từ ngày</th>
                                <th>Đến ngày</th>
                                <th>Số ngày</th>
                                <th>Lý do</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pendingLeaves
                              .map((leave) => {
                                const emp = this.employeeDb.getEmployeeById(
                                  leave.employeeId
                                );
                                const typeNames = {
                                  annual: "Phép năm",
                                  sick: "Ốm đau",
                                  personal: "Cá nhân",
                                };
                                return `
                                    <tr id="leave-row-${leave.id}">
                                        <td>${leave.employeeId}</td>
                                        <td>${emp ? emp.name : "N/A"}</td>
                                        <td>${
                                          typeNames[leave.type] || leave.type
                                        }</td>
                                        <td>${new Date(
                                          leave.startDate
                                        ).toLocaleDateString("vi-VN")}</td>
                                        <td>${new Date(
                                          leave.endDate
                                        ).toLocaleDateString("vi-VN")}</td>
                                        <td>${leave.days}</td>
                                        <td>${leave.reason || "--"}</td>
                                        <td class="action-buttons">
                                            <button class="btn btn-success btn-small" onclick="window.leaveModule.handleApprove('${
                                              leave.id
                                            }', true)">
                                                Duyệt
                                            </button>
                                            <button class="btn btn-danger btn-small" onclick="window.leaveModule.handleApprove('${
                                              leave.id
                                            }', false)">
                                                Từ chối
                                            </button>
                                        </td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                `
                }
            </div>
            
            <!-- Lịch sử nghỉ phép -->
            <div class="card">
                <h3>Lịch Sử Nghỉ Phép</h3>
                <button class="btn btn-secondary btn-small" onclick="window.leaveModule.showHistory()">
                    Xem tất cả
                </button>
                <div id="leave-history"></div>
            </div>
        `;
  }

  // Gắn event listeners
  attachEventListeners() {
    const requestForm = document.getElementById("leave-request-form");
    if (requestForm) {
      requestForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleRequest();
      });
    }
  }

  // Xử lý yêu cầu nghỉ phép
  async handleRequest() {
    const employeeId = document.getElementById("leave-employee").value;
    const type = document.getElementById("leave-type").value;
    const startDate = document.getElementById("leave-start").value;
    const endDate = document.getElementById("leave-end").value;
    const reason = document.getElementById("leave-reason").value.trim();

    if (!employeeId || !type || !startDate || !endDate) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const leave = await this.requestLeave(
        employeeId,
        startDate,
        endDate,
        type,
        reason
      );
      const emp = this.employeeDb.getEmployeeById(employeeId);
      this.showMessage(
        `Yêu cầu nghỉ phép cho ${emp.name} đã được gửi (${leave.days} ngày)`,
        "success"
      );

      // Refresh
      setTimeout(() => {
        const content = this.render();
        document.getElementById("content-area").innerHTML = content;
        this.attachEventListeners();
      }, 1500);
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  // Xử lý phê duyệt
  async handleApprove(leaveId, approved) {
    try {
      const leave = await this.approveLeave(leaveId, approved);
      const emp = this.employeeDb.getEmployeeById(leave.employeeId);
      const action = approved ? "đã được duyệt" : "đã bị từ chối";
      alert(`Yêu cầu nghỉ phép của ${emp.name} ${action}!`);

      // Remove row
      const row = document.getElementById(`leave-row-${leaveId}`);
      if (row) row.remove();
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  }

  // Hiển thị lịch sử
  showHistory() {
    const leaves = this.getAllLeaves();
    const approvedOrRejected = leaves.filter((l) => l.status !== "pending");

    const typeNames = {
      annual: "Phép năm",
      sick: "Ốm đau",
      personal: "Cá nhân",
    };

    const statusNames = {
      approved: "Đã duyệt",
      rejected: "Từ chối",
    };

    const container = document.getElementById("leave-history");
    container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Mã NV</th>
                        <th>Họ tên</th>
                        <th>Loại</th>
                        <th>Từ ngày</th>
                        <th>Đến ngày</th>
                        <th>Số ngày</th>
                        <th>Trạng thái</th>
                        <th>Ngày duyệt</th>
                    </tr>
                </thead>
                <tbody>
                    ${approvedOrRejected
                      .map((leave) => {
                        const emp = this.employeeDb.getEmployeeById(
                          leave.employeeId
                        );
                        return `
                            <tr>
                                <td>${leave.employeeId}</td>
                                <td>${emp ? emp.name : "N/A"}</td>
                                <td>${typeNames[leave.type] || leave.type}</td>
                                <td>${new Date(
                                  leave.startDate
                                ).toLocaleDateString("vi-VN")}</td>
                                <td>${new Date(
                                  leave.endDate
                                ).toLocaleDateString("vi-VN")}</td>
                                <td>${leave.days}</td>
                                <td>${
                                  statusNames[leave.status] || leave.status
                                }</td>
                                <td>${
                                  leave.approvedDate
                                    ? new Date(
                                        leave.approvedDate
                                      ).toLocaleDateString("vi-VN")
                                    : "--"
                                }</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        `;
  }

  // Hiển thị thông báo
  showMessage(message, type) {
    const msgDiv = document.getElementById("leave-message");
    msgDiv.innerHTML = `
            <div class="message message-${type}">
                ${message}
            </div>
        `;

    setTimeout(() => {
      msgDiv.innerHTML = "";
    }, 5000);
  }

  // Hàm delay
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
