// SearchEmployeeModule.js - Module tìm kiếm nhân viên nâng cao
export class SearchEmployeeModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
    this.currentResults = [];
    this.sortField = "name";
    this.sortDirection = "asc";
  }

  // Render giao diện
  render() {
    const departments = this.departmentModule.getAllDepartments();
    const positions = this.positionModule.getAllPositions();

    return `
            <div class="module-header">
                <h2>Tìm Kiếm Nhân Viên Nâng Cao</h2>
                <p>Sử dụng các bộ lọc để tìm kiếm nhân viên</p>
            </div>
            
            <div class="form-container">
                <form id="advanced-search-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tên nhân viên (hỗ trợ regex)</label>
                            <input type="text" id="search-name-pattern" placeholder="Ví dụ: Nguyễn.*An">
                        </div>
                        <div class="form-group">
                            <label>Mã nhân viên</label>
                            <input type="text" id="search-id-pattern" placeholder="Ví dụ: EMP001">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phòng ban</label>
                            <select id="search-department">
                                <option value="">-- Tất cả phòng ban --</option>
                                ${departments
                                  .map(
                                    (dept) =>
                                      `<option value="${dept.id}">${dept.name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Vị trí</label>
                            <select id="search-position">
                                <option value="">-- Tất cả vị trí --</option>
                                ${positions
                                  .map(
                                    (pos) =>
                                      `<option value="${pos.id}">${pos.title}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Lương tối thiểu (VNĐ)</label>
                            <input type="number" id="search-min-salary" min="0" step="100000" placeholder="0">
                        </div>
                        <div class="form-group">
                            <label>Lương tối đa (VNĐ)</label>
                            <input type="number" id="search-max-salary" min="0" step="100000" placeholder="100000000">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Tìm kiếm</button>
                        <button type="reset" class="btn btn-secondary">Xóa bộ lọc</button>
                    </div>
                </form>
            </div>
            
            <!-- Kết quả tìm kiếm -->
            <div id="search-results-container"></div>
        `;
  }

  // Gắn event listeners
  attachEventListeners() {
    const searchForm = document.getElementById("advanced-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSearch();
      });

      searchForm.addEventListener("reset", () => {
        setTimeout(() => {
          document.getElementById("search-results-container").innerHTML = "";
        }, 100);
      });
    }
  }

  // Xử lý tìm kiếm
  handleSearch() {
    // Lấy tiêu chí tìm kiếm
    const criteria = {
      name: document.getElementById("search-name-pattern").value.trim(),
      id: document.getElementById("search-id-pattern").value.trim(),
      departmentId: document.getElementById("search-department").value,
      positionId: document.getElementById("search-position").value,
      minSalary:
        parseFloat(document.getElementById("search-min-salary").value) ||
        undefined,
      maxSalary:
        parseFloat(document.getElementById("search-max-salary").value) ||
        undefined,
    };

    // Tìm kiếm với higher-order functions
    this.currentResults = this.performSearch(criteria);

    // Sắp xếp kết quả
    this.sortResults();

    // Hiển thị kết quả
    this.displayResults();
  }

  // Thực hiện tìm kiếm với filter và regex
  performSearch(criteria) {
    // Bắt đầu với toàn bộ danh sách nhân viên (let cho phép reassign)
    let results = this.employeeDb.getAllEmployees();

    // ============ Tìm kiếm theo tên (sử dụng RegExp với error handling) ============
    if (criteria.name) {
      try {
        // Tạo Regular Expression với flag "i" (case-insensitive)
        // Ví dụ: "nguyen" sẽ khớp với "Nguyễn", "NGUYEN", "nguyen"
        const regex = new RegExp(criteria.name, "i");
        // Filter: chỉ giữ lại employees có tên match với regex
        // regex.test(string): trả về true/false nếu string khớp với pattern
        results = results.filter((emp) => regex.test(emp.name));
      } catch (e) {
        // Nếu regex pattern không hợp lệ (ví dụ: "["), catch error
        alert("Pattern không hợp lệ! Sử dụng tìm kiếm thông thường.");
        // Fallback: sử dụng includes() thay vì regex
        results = results.filter((emp) =>
          emp.name.toLowerCase().includes(criteria.name.toLowerCase())
        );
      }
    }

    // ============ Tìm kiếm theo ID (RegExp) ============
    if (criteria.id) {
      // Tạo regex để tìm ID (partial match, case-insensitive)
      const regex = new RegExp(criteria.id, "i");
      results = results.filter((emp) => regex.test(emp.id));
    }

    // ============ Tìm kiếm theo phòng ban (exact match) ============
    if (criteria.departmentId) {
      // Filter: chỉ giữ lại employees thuộc phòng ban được chọn
      results = results.filter(
        (emp) => emp.departmentId === criteria.departmentId
      );
    }

    // ============ Tìm kiếm theo vị trí (exact match) ============
    if (criteria.positionId) {
      // Filter: chỉ giữ lại employees có vị trí được chọn
      results = results.filter((emp) => emp.positionId === criteria.positionId);
    }

    // ============ Tìm kiếm theo mức lương tối thiểu ============
    // undefined check: chỉ filter nếu minSalary được cung cấp (có thể là 0)
    if (criteria.minSalary !== undefined) {
      // Filter: chỉ giữ lại employees có lương >= minSalary
      results = results.filter((emp) => emp.salary >= criteria.minSalary);
    }

    // ============ Tìm kiếm theo mức lương tối đa ============
    if (criteria.maxSalary !== undefined) {
      // Filter: chỉ giữ lại employees có lương <= maxSalary
      results = results.filter((emp) => emp.salary <= criteria.maxSalary);
    }

    // Trả về kết quả sau khi đã lọc theo tất cả tiêu chí
    return results;
  }

  // Sắp xếp kết quả
  sortResults(field, direction) {
    if (field) {
      this.sortField = field;
      this.sortDirection =
        direction || (this.sortDirection === "asc" ? "desc" : "asc");
    }

    this.currentResults.sort((a, b) => {
      let aVal = a[this.sortField];
      let bVal = b[this.sortField];

      // Xử lý sorting cho số
      if (typeof aVal === "number" && typeof bVal === "number") {
        return this.sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Xử lý sorting cho chuỗi
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        if (this.sortDirection === "asc") {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      }

      return 0;
    });
  }

  // Hiển thị kết quả
  displayResults() {
    const container = document.getElementById("search-results-container");

    if (this.currentResults.length === 0) {
      container.innerHTML = `
                <div class="card">
                    <div class="empty-state">
                        <h3>Không tìm thấy kết quả</h3>
                        <p>Vui lòng thử lại với các tiêu chí khác</p>
                    </div>
                </div>
            `;
      return;
    }

    const departments = this.departmentModule.getAllDepartments();
    const positions = this.positionModule.getAllPositions();

    const getSortIcon = (field) => {
      if (this.sortField === field) {
        return this.sortDirection === "asc" ? " ▲" : " ▼";
      }
      return "";
    };

    container.innerHTML = `
            <div class="card">
                <h3>Kết quả tìm kiếm: ${
                  this.currentResults.length
                } nhân viên</h3>
                <table>
                    <thead>
                        <tr>
                            <th style="cursor: pointer;" onclick="window.searchEmployeeModule.sortAndDisplay('id')">
                                Mã NV${getSortIcon("id")}
                            </th>
                            <th style="cursor: pointer;" onclick="window.searchEmployeeModule.sortAndDisplay('name')">
                                Họ tên${getSortIcon("name")}
                            </th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th>
                            <th style="cursor: pointer;" onclick="window.searchEmployeeModule.sortAndDisplay('salary')">
                                Lương${getSortIcon("salary")}
                            </th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th style="cursor: pointer;" onclick="window.searchEmployeeModule.sortAndDisplay('hireDate')">
                                Ngày vào làm${getSortIcon("hireDate")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.currentResults
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
                                    <td>${emp.email}</td>
                                    <td>${emp.phone}</td>
                                    <td>${this.formatDate(emp.hireDate)}</td>
                                </tr>
                            `;
                          })
                          .join("")}
                    </tbody>
                </table>
            </div>
        `;
  }

  // Sắp xếp và hiển thị lại
  sortAndDisplay(field) {
    this.sortResults(field);
    this.displayResults();
  }

  // Format tiền tệ
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  // Format ngày
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  }
}
