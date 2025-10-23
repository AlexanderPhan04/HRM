// AttendanceModule.js - Module theo dõi chấm công (sử dụng API backend)
export class AttendanceModule {
  constructor(employeeDb) {
    this.employeeDb = employeeDb;
    this.apiBaseUrl = "api.php/attendance";
  }

  // Lấy tất cả attendance logs từ API
  async getAllAttendance() {
    try {
      const response = await fetch(this.apiBaseUrl);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return [];
    }
  }

  // Check-in qua API
  async checkIn(employeeId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Check-in thất bại");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Check-out qua API
  async checkOut(employeeId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/check-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Check-out thất bại");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy báo cáo chấm công theo nhân viên và khoảng thời gian từ API
  async getAttendanceReport(employeeId, fromDate, toDate) {
    try {
      const params = new URLSearchParams();
      if (employeeId) params.append("employeeId", employeeId);
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);

      const response = await fetch(`${this.apiBaseUrl}/report?${params}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching report:", error);
      return [];
    }
  }

  // Render giao diện
  async render() {
    const employees = await this.employeeDb.getAllEmployees();
    const today = new Date().toISOString().split("T")[0];
    const logs = await this.getAllAttendance();

    // Lấy trạng thái check-in hôm nay
    const todayLogs = logs.filter((l) => l.date === today);

    return `
            <div class="module-header">
                <h2>Chấm Công</h2>
                <p>Quản lý check-in/check-out nhân viên</p>
            </div>
            
            <!-- Form check-in/out -->
            <div class="form-container">
                <h3>Chấm công hôm nay (${new Date().toLocaleDateString(
                  "vi-VN"
                )})</h3>
                <form id="attendance-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Chọn nhân viên *</label>
                            <select id="attendance-employee" required>
                                <option value="">-- Chọn nhân viên --</option>
                                ${employees
                                  .map(
                                    (emp) => `
                                    <option value="${emp.id}">${emp.name} (${emp.id})</option>
                                `
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-success" onclick="window.attendanceModule.handleCheckIn()">
                            Check-in
                        </button>
                        <button type="button" class="btn btn-danger" onclick="window.attendanceModule.handleCheckOut()">
                            Check-out
                        </button>
                    </div>
                </form>
                <div id="attendance-message"></div>
            </div>
            
            <!-- Chấm công hôm nay -->
            <div class="card">
                <h3>Chấm công hôm nay (${todayLogs.length})</h3>
                ${
                  todayLogs.length === 0
                    ? `
                    <div class="empty-state">
                        <p>Chưa có ai chấm công hôm nay</p>
                    </div>
                `
                    : `
                    <table>
                        <thead>
                            <tr>
                                <th>Mã NV</th>
                                <th>Họ tên</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Số giờ</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${todayLogs
                              .map((log) => {
                                const emp = this.employeeDb.getEmployeeById(
                                  log.employeeId
                                );
                                const status = log.checkOut
                                  ? "Hoàn thành"
                                  : "Đang làm";
                                return `
                                    <tr>
                                        <td>${log.employeeId}</td>
                                        <td>${emp ? emp.name : "N/A"}</td>
                                        <td>${log.checkIn}</td>
                                        <td>${log.checkOut || "--:--:--"}</td>
                                        <td>${log.totalHours.toFixed(2)}h</td>
                                        <td>${status}</td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                `
                }
            </div>
            
            <!-- Form báo cáo -->
            <div class="form-container">
                <h3>Báo Cáo Chấm Công</h3>
                <form id="report-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nhân viên (tùy chọn)</label>
                            <select id="report-employee">
                                <option value="">-- Tất cả nhân viên --</option>
                                ${employees
                                  .map(
                                    (emp) => `
                                    <option value="${emp.id}">${emp.name} (${emp.id})</option>
                                `
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Từ ngày</label>
                            <input type="date" id="report-from" value="${this.getFirstDayOfMonth()}">
                        </div>
                        <div class="form-group">
                            <label>Đến ngày</label>
                            <input type="date" id="report-to" value="${today}">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Xem báo cáo</button>
                </form>
            </div>
            
            <!-- Kết quả báo cáo -->
            <div id="report-results"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners() {
    const reportForm = document.getElementById("report-form");
    if (reportForm) {
      reportForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.showReport();
      });
    }
  }

  // Xử lý check-in
  async handleCheckIn() {
    const employeeId = document.getElementById("attendance-employee").value;
    if (!employeeId) {
      alert("Vui lòng chọn nhân viên!");
      return;
    }

    try {
      const log = await this.checkIn(employeeId);
      const emp = await this.employeeDb.getEmployeeById(employeeId);
      this.showMessage(
        `Check-in thành công cho ${emp.name} lúc ${log.checkIn}`,
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

  // Xử lý check-out
  async handleCheckOut() {
    const employeeId = document.getElementById("attendance-employee").value;
    if (!employeeId) {
      alert("Vui lòng chọn nhân viên!");
      return;
    }

    try {
      const log = await this.checkOut(employeeId);
      const emp = await this.employeeDb.getEmployeeById(employeeId);
      this.showMessage(
        `Check-out thành công cho ${emp.name} lúc ${
          log.checkOut
        }. Tổng: ${log.totalHours.toFixed(2)}h`,
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

  // Hiển thị báo cáo
  async showReport() {
    const employeeId = document.getElementById("report-employee").value;
    const fromDate = document.getElementById("report-from").value;
    const toDate = document.getElementById("report-to").value;

    const report = await this.getAttendanceReport(employeeId, fromDate, toDate);

    // Tính tổng giờ làm
    const totalHours = report.reduce((sum, log) => sum + log.totalHours, 0);

    const container = document.getElementById("report-results");
    container.innerHTML = `
            <div class="card">
                <h3>Báo Cáo Chấm Công (${
                  report.length
                } ngày, tổng ${totalHours.toFixed(2)}h)</h3>
                ${
                  report.length === 0
                    ? `
                    <div class="empty-state">
                        <p>Không có dữ liệu</p>
                    </div>
                `
                    : `
                    <table>
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Mã NV</th>
                                <th>Họ tên</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Số giờ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${report
                              .map((log) => {
                                const emp = this.employeeDb.getEmployeeById(
                                  log.employeeId
                                );
                                return `
                                    <tr>
                                        <td>${new Date(
                                          log.date
                                        ).toLocaleDateString("vi-VN")}</td>
                                        <td>${log.employeeId}</td>
                                        <td>${emp ? emp.name : "N/A"}</td>
                                        <td>${log.checkIn}</td>
                                        <td>${log.checkOut || "--:--:--"}</td>
                                        <td>${log.totalHours.toFixed(2)}h</td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                `
                }
            </div>
        `;
  }

  // Hiển thị thông báo
  showMessage(message, type) {
    const msgDiv = document.getElementById("attendance-message");
    msgDiv.innerHTML = `
            <div class="message message-${type}">
                ${message}
            </div>
        `;

    setTimeout(() => {
      msgDiv.innerHTML = "";
    }, 5000);
  }

  // Lấy ngày đầu tháng
  getFirstDayOfMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  }
}
