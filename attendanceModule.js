// AttendanceModule.js - Module theo dõi chấm công
export class AttendanceModule {
  constructor(employeeDb) {
    this.employeeDb = employeeDb;
    this.storageKey = "hrm_attendance";
    this.init();
  }

  // Khởi tạo
  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Lấy tất cả attendance logs
  getAllAttendance() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Lưu attendance logs
  async saveAttendance(logs) {
    await this.delay(300);
    localStorage.setItem(this.storageKey, JSON.stringify(logs));
  }

  // Check-in
  async checkIn(employeeId) {
    const logs = this.getAllAttendance();
    const today = new Date().toISOString().split("T")[0];

    // Kiểm tra đã check-in chưa
    const existing = logs.find(
      (log) =>
        log.employeeId === employeeId && log.date === today && log.checkIn
    );

    if (existing) {
      throw new Error("Đã check-in hôm nay rồi!");
    }

    const newLog = {
      id: this.generateLogId(),
      employeeId,
      date: today,
      checkIn: new Date().toTimeString().split(" ")[0],
      checkOut: null,
      totalHours: 0,
    };

    logs.push(newLog);
    await this.saveAttendance(logs);
    return newLog;
  }

  // Check-out
  async checkOut(employeeId) {
    const logs = this.getAllAttendance();
    const today = new Date().toISOString().split("T")[0];

    const log = logs.find(
      (l) =>
        l.employeeId === employeeId &&
        l.date === today &&
        l.checkIn &&
        !l.checkOut
    );

    if (!log) {
      throw new Error("Chưa check-in hoặc đã check-out rồi!");
    }

    log.checkOut = new Date().toTimeString().split(" ")[0];
    log.totalHours = this.calculateHours(log.checkIn, log.checkOut);

    await this.saveAttendance(logs);
    return log;
  }

  // Tính số giờ làm việc (sử dụng Date object và phép toán thời gian)
  calculateHours(checkIn, checkOut) {
    // Parse checkIn time: split chuỗi "HH:MM:SS" thành array và convert sang số
    // Ví dụ: "08:30:00" => ["08", "30", "00"] => [8, 30, 0]
    const [h1, m1, s1] = checkIn.split(":").map(Number);
    // Parse checkOut time tương tự
    const [h2, m2, s2] = checkOut.split(":").map(Number);

    // Tạo Date object cho thời điểm check-in
    const start = new Date();
    // Set giờ, phút, giây cho check-in
    start.setHours(h1, m1, s1);

    // Tạo Date object cho thời điểm check-out
    const end = new Date();
    // Set giờ, phút, giây cho check-out
    end.setHours(h2, m2, s2);

    // Tính khoảng thời gian chênh lệch (milliseconds)
    // Chia cho 1000 để ra giây, 60 để ra phút, 60 lần nữa để ra giờ
    const diff = (end - start) / (1000 * 60 * 60); // Convert to hours

    // Trả về số giờ dương (Math.max đảm bảo không âm nếu có lỗi dữ liệu)
    return Math.max(0, diff);
  }

  // Lấy báo cáo chấm công theo nhân viên và khoảng thời gian
  getAttendanceReport(employeeId, fromDate, toDate) {
    const logs = this.getAllAttendance();

    return logs.filter((log) => {
      if (employeeId && log.employeeId !== employeeId) return false;
      if (fromDate && log.date < fromDate) return false;
      if (toDate && log.date > toDate) return false;
      return true;
    });
  }

  // Tạo ID log mới
  generateLogId() {
    return "ATT" + Date.now();
  }

  // Render giao diện
  render() {
    const employees = this.employeeDb.getAllEmployees();
    const today = new Date().toISOString().split("T")[0];
    const logs = this.getAllAttendance();

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
      const emp = this.employeeDb.getEmployeeById(employeeId);
      this.showMessage(
        `Check-in thành công cho ${emp.name} lúc ${log.checkIn}`,
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

  // Xử lý check-out
  async handleCheckOut() {
    const employeeId = document.getElementById("attendance-employee").value;
    if (!employeeId) {
      alert("Vui lòng chọn nhân viên!");
      return;
    }

    try {
      const log = await this.checkOut(employeeId);
      const emp = this.employeeDb.getEmployeeById(employeeId);
      this.showMessage(
        `Check-out thành công cho ${emp.name} lúc ${
          log.checkOut
        }. Tổng: ${log.totalHours.toFixed(2)}h`,
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

  // Hiển thị báo cáo
  showReport() {
    const employeeId = document.getElementById("report-employee").value;
    const fromDate = document.getElementById("report-from").value;
    const toDate = document.getElementById("report-to").value;

    const report = this.getAttendanceReport(employeeId, fromDate, toDate);

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

  // Hàm delay
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
