// PerformanceModule.js - Module đánh giá hiệu suất
export class PerformanceModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
    this.storageKey = "hrm_performance";
    this.init();
  }

  // Khởi tạo
  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Lấy tất cả đánh giá
  getAllReviews() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Lưu danh sách đánh giá
  async saveReviews(reviews) {
    await this.delay(300);
    localStorage.setItem(this.storageKey, JSON.stringify(reviews));
  }

  // Thêm đánh giá
  async addReview(employeeId, rating, feedback = "", reviewDate = null) {
    if (rating < 1 || rating > 5) {
      throw new Error("Điểm đánh giá phải từ 1 đến 5!");
    }

    const reviews = this.getAllReviews();
    const newReview = {
      id: this.generateReviewId(),
      employeeId,
      rating,
      feedback,
      date: reviewDate || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    await this.saveReviews(reviews);
    return newReview;
  }

  // Lấy điểm trung bình của nhân viên (sử dụng filter và reduce - higher-order functions)
  getAverageRating(employeeId) {
    // Lấy tất cả đánh giá từ localStorage
    const reviews = this.getAllReviews();

    // Filter: Lọc ra chỉ những đánh giá của nhân viên này
    const empReviews = reviews.filter((r) => r.employeeId === employeeId);

    // Nếu chưa có đánh giá nào, trả về 0
    if (empReviews.length === 0) {
      return 0;
    }

    // Reduce: Cộng dồn tất cả rating để tính tổng điểm
    // sum: accumulator (tổng tích lũy), review: element hiện tại
    // 0: giá trị khởi tạo của sum
    const total = empReviews.reduce((sum, review) => sum + review.rating, 0);

    // Tính trung bình: Tổng điểm / Số lượng đánh giá
    return total / empReviews.length;
  }

  // Lấy tất cả đánh giá của nhân viên
  getEmployeeReviews(employeeId) {
    const reviews = this.getAllReviews();
    return reviews.filter((r) => r.employeeId === employeeId);
  }

  // Tạo ID đánh giá mới
  generateReviewId() {
    return "PERF" + Date.now();
  }

  // Lấy top performers (sử dụng map, filter, sort - higher-order functions)
  getTopPerformers(limit = 10) {
    // Lấy toàn bộ nhân viên từ database
    const employees = this.employeeDb.getAllEmployees();

    // Map: Transform mỗi employee, thêm thông tin rating
    const empWithRatings = employees.map((emp) => ({
      ...emp, // Spread: copy tất cả properties của employee
      avgRating: this.getAverageRating(emp.id), // Thêm điểm trung bình
      reviewCount: this.getEmployeeReviews(emp.id).length, // Thêm số lượng đánh giá
    }));

    // Filter: Chỉ lấy những nhân viên có ít nhất 1 đánh giá
    const withReviews = empWithRatings.filter((e) => e.reviewCount > 0);

    // Sort: Sắp xếp theo điểm trung bình giảm dần (descending)
    // Slice: Cắt mảng để chỉ lấy top N nhân viên
    return withReviews
      .sort((a, b) => b.avgRating - a.avgRating) // b - a: sắp xếp giảm dần
      .slice(0, limit); // Lấy từ index 0 đến limit
  }

  // Render giao diện
  render() {
    const employees = this.employeeDb.getAllEmployees();
    const topPerformers = this.getTopPerformers(5);

    return `
            <div class="module-header">
                <h2>Đánh Giá Hiệu Suất</h2>
                <p>Quản lý đánh giá và theo dõi hiệu suất nhân viên</p>
            </div>
            
            <!-- Top performers -->
            <div class="card">
                <h3>🏆 Top 5 Nhân Viên Xuất Sắc</h3>
                ${
                  topPerformers.length === 0
                    ? `
                    <div class="empty-state">
                        <p>Chưa có đánh giá nào</p>
                    </div>
                `
                    : `
                    <table>
                        <thead>
                            <tr>
                                <th>Thứ hạng</th>
                                <th>Mã NV</th>
                                <th>Họ tên</th>
                                <th>Phòng ban</th>
                                <th>Điểm TB</th>
                                <th>Số đánh giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topPerformers
                              .map((emp, index) => {
                                const dept =
                                  this.departmentModule.getDepartmentById(
                                    emp.departmentId
                                  );
                                return `
                                    <tr>
                                        <td><strong>#${index + 1}</strong></td>
                                        <td>${emp.id}</td>
                                        <td>${emp.name}</td>
                                        <td>${dept ? dept.name : "N/A"}</td>
                                        <td>⭐ ${emp.avgRating.toFixed(
                                          2
                                        )}/5</td>
                                        <td>${emp.reviewCount}</td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                `
                }
            </div>
            
            <!-- Form thêm đánh giá -->
            <div class="form-container">
                <h3>Thêm Đánh Giá Mới</h3>
                <form id="add-review-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nhân viên *</label>
                            <select id="review-employee" required>
                                <option value="">-- Chọn nhân viên --</option>
                                ${employees
                                  .map((emp) => {
                                    const avg = this.getAverageRating(emp.id);
                                    const avgText =
                                      avg > 0 ? ` (TB: ${avg.toFixed(2)})` : "";
                                    return `<option value="${emp.id}">${emp.name}${avgText}</option>`;
                                  })
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Điểm đánh giá (1-5) *</label>
                            <select id="review-rating" required>
                                <option value="">-- Chọn điểm --</option>
                                <option value="5">⭐⭐⭐⭐⭐ Xuất sắc (5)</option>
                                <option value="4">⭐⭐⭐⭐ Tốt (4)</option>
                                <option value="3">⭐⭐⭐ Trung bình (3)</option>
                                <option value="2">⭐⭐ Cần cải thiện (2)</option>
                                <option value="1">⭐ Kém (1)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Ngày đánh giá *</label>
                            <input type="date" id="review-date" value="${
                              new Date().toISOString().split("T")[0]
                            }" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Nhận xét</label>
                        <textarea id="review-feedback" rows="4" placeholder="Nhập nhận xét chi tiết..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Thêm đánh giá</button>
                </form>
                <div id="review-message"></div>
            </div>
            
            <!-- Danh sách tất cả nhân viên với điểm -->
            <div class="card">
                <h3>Bảng Đánh Giá Hiệu Suất</h3>
                <button class="btn btn-secondary btn-small" onclick="window.performanceModule.showAllRatings()">
                    Xem chi tiết
                </button>
                <div id="all-ratings"></div>
            </div>
            
            <!-- Chi tiết đánh giá nhân viên -->
            <div id="employee-reviews"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners() {
    const reviewForm = document.getElementById("add-review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAddReview();
      });
    }

    // Khi chọn nhân viên, hiển thị lịch sử đánh giá
    const employeeSelect = document.getElementById("review-employee");
    if (employeeSelect) {
      employeeSelect.addEventListener("change", (e) => {
        if (e.target.value) {
          this.showEmployeeReviews(e.target.value);
        } else {
          document.getElementById("employee-reviews").innerHTML = "";
        }
      });
    }
  }

  // Xử lý thêm đánh giá
  async handleAddReview() {
    const employeeId = document.getElementById("review-employee").value;
    const rating = parseInt(document.getElementById("review-rating").value);
    const date = document.getElementById("review-date").value;
    const feedback = document.getElementById("review-feedback").value.trim();

    if (!employeeId || !rating || !date) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await this.addReview(employeeId, rating, feedback, date);
      const emp = this.employeeDb.getEmployeeById(employeeId);
      this.showMessage(
        `Đã thêm đánh giá cho ${emp.name} với ${rating} sao`,
        "success"
      );

      // Clear form
      document.getElementById("add-review-form").reset();
      document.getElementById("review-date").value = new Date()
        .toISOString()
        .split("T")[0];

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

  // Hiển thị tất cả đánh giá
  showAllRatings() {
    const employees = this.employeeDb.getAllEmployees();

    const empWithRatings = employees.map((emp) => {
      const reviews = this.getEmployeeReviews(emp.id);
      const dept = this.departmentModule.getDepartmentById(emp.departmentId);
      const pos = this.positionModule.getPositionById(emp.positionId);

      return {
        ...emp,
        departmentName: dept ? dept.name : "N/A",
        positionTitle: pos ? pos.title : "N/A",
        avgRating: this.getAverageRating(emp.id),
        reviewCount: reviews.length,
      };
    });

    const container = document.getElementById("all-ratings");
    container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Mã NV</th>
                        <th>Họ tên</th>
                        <th>Phòng ban</th>
                        <th>Vị trí</th>
                        <th>Điểm TB</th>
                        <th>Số đánh giá</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${empWithRatings
                      .map((emp) => {
                        const stars =
                          emp.avgRating > 0
                            ? "⭐".repeat(Math.round(emp.avgRating))
                            : "--";
                        return `
                            <tr>
                                <td>${emp.id}</td>
                                <td>${emp.name}</td>
                                <td>${emp.departmentName}</td>
                                <td>${emp.positionTitle}</td>
                                <td>${
                                  emp.avgRating > 0
                                    ? emp.avgRating.toFixed(2)
                                    : "--"
                                } ${stars}</td>
                                <td>${emp.reviewCount}</td>
                                <td>
                                    <button class="btn btn-primary btn-small" onclick="window.performanceModule.showEmployeeReviews('${
                                      emp.id
                                    }')">
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        `;
  }

  // Hiển thị đánh giá của một nhân viên
  showEmployeeReviews(employeeId) {
    const employee = this.employeeDb.getEmployeeById(employeeId);
    const reviews = this.getEmployeeReviews(employeeId);
    const avgRating = this.getAverageRating(employeeId);

    const container = document.getElementById("employee-reviews");
    container.innerHTML = `
            <div class="card">
                <h3>Lịch Sử Đánh Giá: ${employee.name}</h3>
                <p><strong>Điểm trung bình:</strong> ${
                  avgRating > 0 ? avgRating.toFixed(2) : "--"
                }/5 ⭐ (${reviews.length} đánh giá)</p>
                
                ${
                  reviews.length === 0
                    ? `
                    <div class="empty-state">
                        <p>Chưa có đánh giá nào</p>
                    </div>
                `
                    : `
                    <table>
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Điểm</th>
                                <th>Nhận xét</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reviews
                              .sort(
                                (a, b) => new Date(b.date) - new Date(a.date)
                              )
                              .map((review) => {
                                const stars = "⭐".repeat(review.rating);
                                return `
                                    <tr>
                                        <td>${new Date(
                                          review.date
                                        ).toLocaleDateString("vi-VN")}</td>
                                        <td>${stars} (${review.rating}/5)</td>
                                        <td>${review.feedback || "--"}</td>
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

    // Scroll to view
    container.scrollIntoView({ behavior: "smooth" });
  }

  // Hiển thị thông báo
  showMessage(message, type) {
    const msgDiv = document.getElementById("review-message");
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
