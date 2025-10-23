// LeaveModule.js - Module quản lý nghỉ phép (sử dụng API backend)
export class LeaveModule {
  constructor(employeeDb) {
    this.employeeDb = employeeDb;
    this.apiBaseUrl = "api.php/leaves";
  }

  // Lấy tất cả yêu cầu nghỉ phép từ API
  async getAllLeaves() {
    try {
      const response = await fetch(this.apiBaseUrl);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching leaves:", error);
      return [];
    }
  }

  // Yêu cầu nghỉ phép qua API
  async requestLeave(employeeId, startDate, endDate, type, reason = "") {
    // Kiểm tra ngày hợp lệ
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      throw new Error("Ngày kết thúc phải sau ngày bắt đầu!");
    }

    // Tính số ngày
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    try {
      const response = await fetch(this.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          startDate,
          endDate,
          type,
          reason,
          days,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể tạo yêu cầu nghỉ phép");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Phê duyệt nghỉ phép qua API
  async approveLeave(leaveId, approved = true) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${leaveId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: approved ? "approved" : "rejected",
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể cập nhật trạng thái");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy số ngày phép còn lại từ API
  async getLeaveBalance(employeeId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/balance?employeeId=${employeeId}`
      );
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      // Fallback nếu API không có
      return { total: 20, used: 0, remaining: 20 };
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      return { total: 20, used: 0, remaining: 20 };
    }
  }

  // Render giao diện
  async render() {
    const employees = await this.employeeDb.getAllEmployees();
    const leaves = await this.getAllLeaves();
    const pendingLeaves = leaves.filter((l) => l.status === "pending");

    // Lấy balance cho tất cả employees
    const employeesWithBalance = await Promise.all(
      employees.map(async (emp) => {
        const balance = await this.getLeaveBalance(emp.id);
        return { ...emp, balance };
      })
    );

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
                                ${employeesWithBalance
                                  .map((emp) => {
                                    return `<option value="${emp.id}">${emp.name} - Còn ${emp.balance.remaining} ngày</option>`;
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
      const emp = await this.employeeDb.getEmployeeById(employeeId);
      this.showMessage(
        `Yêu cầu nghỉ phép cho ${emp.name} đã được gửi (${leave.days} ngày)`,
        "success"
      );

      // Refresh
      setTimeout(async () => {
        const content = await this.render();
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
      const emp = await this.employeeDb.getEmployeeById(leave.employeeId);
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
  async showHistory() {
    const leaves = await this.getAllLeaves();
    const employees = await this.employeeDb.getAllEmployees();
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
                        const emp = employees.find(
                          (e) => e.id === leave.employeeId
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
}
