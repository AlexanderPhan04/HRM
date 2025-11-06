// PerformanceModule.js - Module đánh giá hiệu suất (kết nối MySQL qua PHP API)
export class PerformanceModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
    this.apiBaseUrl = "./api.php/performance";
  }

  // Lấy tất cả đánh giá từ API
  async getAllReviews() {
    try {
      const response = await fetch(this.apiBaseUrl);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }

  // Thêm đánh giá qua API
  async addReview(employeeId, rating, feedback = "", reviewDate = null) {
    if (rating < 1 || rating > 5) {
      throw new Error("Điểm đánh giá phải từ 1 đến 5!");
    }

    try {
      const response = await fetch(this.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          rating,
          feedback,
          date: reviewDate || new Date().toISOString().split("T")[0],
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Không thể thêm đánh giá");
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy điểm trung bình của nhân viên từ API
  async getAverageRating(employeeId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/average/${employeeId}`);
      const data = await response.json();
      return data.success ? data.data.average : 0;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return 0;
    }
  }

  // Lấy tất cả đánh giá của nhân viên từ API
  async getEmployeeReviews(employeeId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/employee/${employeeId}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching employee reviews:", error);
      return [];
    }
  }

  // Lấy top performers từ API
  async getTopPerformers(limit = 10) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/top?limit=${limit}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching top performers:", error);
      return [];
    }
  }

  // Render giao diện
  async render() {
    const employees = await this.employeeDb.getAllEmployees();
    const departments = await this.departmentModule.getAllDepartments();
    const topPerformers = await this.getTopPerformers(5);

    // Get average ratings for all employees
    const employeesWithRating = await Promise.all(
      employees.map(async (emp) => {
        const avg = await this.getAverageRating(emp.id);
        return { ...emp, avgRating: avg };
      })
    );

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
                                const dept = departments.find(
                                  (d) => d.id === emp.departmentId
                                );
                                return `
                                    <tr>
                                        <td><strong>#${index + 1}</strong></td>
                                        <td>${emp.id}</td>
                                        <td>${emp.name}</td>
                                        <td>${dept ? dept.name : "N/A"}</td>
                                        <td>⭐ ${(
                                          parseFloat(emp.avgRating) ||
                                          parseFloat(emp.average_rating) ||
                                          0
                                        ).toFixed(2)}/5</td>
                                        <td>${
                                          emp.reviewCount ||
                                          emp.review_count ||
                                          0
                                        }</td>
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
                                ${employeesWithRating
                                  .map((emp) => {
                                    const avgText =
                                      emp.avgRating > 0
                                        ? ` (TB: ${parseFloat(
                                            emp.avgRating
                                          ).toFixed(2)})`
                                        : "";
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
      const emp = await this.employeeDb.getEmployeeById(employeeId);
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
      setTimeout(async () => {
        const content = await this.render();
        document.getElementById("content-area").innerHTML = content;
        this.attachEventListeners();
      }, 1500);
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  // Hiển thị tất cả đánh giá
  async showAllRatings() {
    const employees = await this.employeeDb.getAllEmployees();
    const departments = await this.departmentModule.getAllDepartments();
    const positions = await this.positionModule.getAllPositions();

    const empWithRatings = await Promise.all(
      employees.map(async (emp) => {
        const reviews = await this.getEmployeeReviews(emp.id);
        const dept = departments.find((d) => d.id === emp.department_id);
        const pos = positions.find((p) => p.id === emp.position_id);
        const avgRating = await this.getAverageRating(emp.id);

        return {
          ...emp,
          departmentName: dept ? dept.name : "N/A",
          positionTitle: pos ? pos.title : "N/A",
          avgRating,
          reviewCount: reviews.length,
        };
      })
    );

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
                                    ? parseFloat(emp.avgRating).toFixed(2)
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
  async showEmployeeReviews(employeeId) {
    const employee = await this.employeeDb.getEmployeeById(employeeId);
    const reviews = await this.getEmployeeReviews(employeeId);
    const avgRating = await this.getAverageRating(employeeId);

    const container = document.getElementById("employee-reviews");
    container.innerHTML = `
            <div class="card">
                <h3>Lịch Sử Đánh Giá: ${employee.name}</h3>
                <p><strong>Điểm trung bình:</strong> ${
                  avgRating > 0 ? parseFloat(avgRating).toFixed(2) : "--"
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
}
