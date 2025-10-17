// AddEmployeeModule.js - Module thêm nhân viên mới
export class AddEmployeeModule {
  constructor(employeeDb, departmentModule, positionModule) {
    this.employeeDb = employeeDb;
    this.departmentModule = departmentModule;
    this.positionModule = positionModule;
  }

  // Render giao diện thêm nhân viên
  render() {
    const departments = this.departmentModule.getAllDepartments();
    const positions = this.positionModule.getAllPositions();

    return `
            <div class="module-header">
                <h2>Thêm Nhân Viên Mới</h2>
                <p>Điền thông tin nhân viên mới vào form dưới đây</p>
            </div>
            
            <div class="form-container">
                <form id="add-employee-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Mã nhân viên</label>
                            <input type="text" id="emp-id" value="${this.employeeDb.generateEmployeeId()}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Họ tên *</label>
                            <input type="text" id="emp-name" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" id="emp-email" required>
                        </div>
                        <div class="form-group">
                            <label>Số điện thoại *</label>
                            <input type="tel" id="emp-phone" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phòng ban *</label>
                            <select id="emp-department" required>
                                <option value="">-- Chọn phòng ban --</option>
                                ${departments
                                  .map(
                                    (dept) =>
                                      `<option value="${dept.id}">${dept.name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Vị trí *</label>
                            <select id="emp-position" required>
                                <option value="">-- Chọn vị trí --</option>
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
                            <label>Lương cơ bản (VNĐ) *</label>
                            <input type="number" id="emp-salary" min="0" step="100000" required>
                        </div>
                        <div class="form-group">
                            <label>Ngày vào làm *</label>
                            <input type="date" id="emp-hiredate" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <textarea id="emp-address" rows="3"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Thêm nhân viên</button>
                        <button type="reset" class="btn btn-secondary">Xóa form</button>
                    </div>
                </form>
                
                <div id="add-result"></div>
            </div>
        `;
  }

  // Gắn event listeners cho form và inputs
  attachEventListeners() {
    // Lấy form element
    const form = document.getElementById("add-employee-form");

    // Nếu form tồn tại (đã được render)
    if (form) {
      // Gắn event listener cho submit event
      form.addEventListener("submit", (e) => {
        e.preventDefault(); // Ngăn form reload trang
        this.handleSubmit(); // Xử lý submit
      });

      // ============ Real-time validation ============

      // Validate số điện thoại khi người dùng nhập
      const phoneInput = document.getElementById("emp-phone");
      phoneInput.addEventListener("input", (e) => {
        this.validatePhone(e.target); // Validate ngay khi input thay đổi
      });

      // Validate email khi người dùng nhập
      const emailInput = document.getElementById("emp-email");
      emailInput.addEventListener("input", (e) => {
        this.validateEmail(e.target); // Validate ngay khi input thay đổi
      });

      // Validate lương khi người dùng nhập
      const salaryInput = document.getElementById("emp-salary");
      salaryInput.addEventListener("input", (e) => {
        this.validateSalary(e.target); // Validate ngay khi input thay đổi
      });
    }
  }

  // Xử lý submit form (async operation với validation)
  async handleSubmit() {
    // ============ Thu thập dữ liệu từ form ============
    const employeeData = {
      id: document.getElementById("emp-id").value, // ID đã auto-generate
      name: document.getElementById("emp-name").value.trim(), // Trim khoảng trắng
      email: document.getElementById("emp-email").value.trim(),
      phone: document.getElementById("emp-phone").value.trim(),
      departmentId: document.getElementById("emp-department").value, // Selected option value
      positionId: document.getElementById("emp-position").value,
      salary: parseFloat(document.getElementById("emp-salary").value), // Convert string to number
      hireDate: document.getElementById("emp-hiredate").value, // Date string (YYYY-MM-DD)
      address: document.getElementById("emp-address").value.trim(),
      bonus: 0, // Default bonus = 0
      deduction: 0, // Default deduction = 0
    };

    // ============ Validate dữ liệu ============
    const validation = this.validateEmployeeData(employeeData);

    // Nếu validation fail: hiển thị lỗi và dừng
    if (!validation.isValid) {
      this.showMessage(validation.message, "error");
      return; // Early return
    }

    // ============ Thêm nhân viên vào database ============
    try {
      // Await async operation: thêm employee vào localStorage
      await this.employeeDb.addEmployee(employeeData);

      // Thành công: hiển thị thông báo
      this.showMessage("Thêm nhân viên thành công!", "success");

      // Reset form về trạng thái ban đầu
      document.getElementById("add-employee-form").reset();
      // Generate ID mới cho lần thêm tiếp theo
      document.getElementById("emp-id").value =
        this.employeeDb.generateEmployeeId();
    } catch (error) {
      // Bắt lỗi nếu có exception xảy ra
      this.showMessage("Có lỗi xảy ra: " + error.message, "error");
    }
  }

  // Validate dữ liệu nhân viên
  validateEmployeeData(data) {
    // ============ Validate họ tên ============
    // Kiểm tra tên không rỗng và có ít nhất 2 ký tự
    if (!data.name || data.name.length < 2) {
      return { isValid: false, message: "Họ tên phải có ít nhất 2 ký tự!" };
    }

    // ============ Validate email với RegExp ============
    // Pattern: có ký tự @ ở giữa, có domain, có extension
    // ^ : bắt đầu chuỗi
    // [^\s@]+ : 1 hoặc nhiều ký tự không phải space hoặc @
    // @ : ký tự @
    // [^\s@]+ : domain
    // \. : dấu chấm (escaped)
    // [^\s@]+ : extension
    // $ : kết thúc chuỗi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { isValid: false, message: "Email không hợp lệ!" };
    }

    // ============ Validate số điện thoại với RegExp ============
    // Pattern: bắt đầu bằng 0, theo sau là 9 chữ số
    // ^0 : bắt buộc bắt đầu bằng số 0
    // \d{9} : đúng 9 chữ số (digit)
    // $ : kết thúc chuỗi
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      return {
        isValid: false,
        message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!",
      };
    }

    // ============ Validate phòng ban ============
    if (!data.departmentId) {
      return { isValid: false, message: "Vui lòng chọn phòng ban!" };
    }

    // ============ Validate vị trí ============
    if (!data.positionId) {
      return { isValid: false, message: "Vui lòng chọn vị trí!" };
    }

    // ============ Validate lương ============
    // Lương phải là số dương (> 0)
    if (!data.salary || data.salary <= 0) {
      return { isValid: false, message: "Lương phải lớn hơn 0!" };
    }

    // ============ Validate ngày tuyển dụng ============
    if (!data.hireDate) {
      return { isValid: false, message: "Vui lòng chọn ngày vào làm!" };
    }

    // Parse string sang Date object để so sánh
    const hireDate = new Date(data.hireDate);
    const today = new Date();
    // Business rule: Ngày vào làm không được là ngày trong tương lai
    if (hireDate > today) {
      return {
        isValid: false,
        message: "Ngày vào làm không thể là ngày tương lai!",
      };
    }

    // Tất cả validation passed
    return { isValid: true };
  }

  // Validate số điện thoại real-time (HTML5 Custom Validity API)
  validatePhone(input) {
    // RegExp pattern: ^0\d{9}$ (bắt đầu 0, theo sau 9 chữ số)
    const phoneRegex = /^0\d{9}$/;

    // Nếu có giá trị và không match pattern
    if (input.value && !phoneRegex.test(input.value)) {
      // Set custom validation message (hiển thị khi submit)
      input.setCustomValidity(
        "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"
      );
    } else {
      // Clear validation message nếu hợp lệ
      input.setCustomValidity("");
    }
  }

  // Validate email real-time (HTML5 Custom Validity API)
  validateEmail(input) {
    // RegExp pattern: cơ bản cho email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Nếu có giá trị và không match pattern
    if (input.value && !emailRegex.test(input.value)) {
      // Set custom validation message
      input.setCustomValidity("Email không hợp lệ");
    } else {
      // Clear validation message nếu hợp lệ
      input.setCustomValidity("");
    }
  }

  // Validate lương real-time (kiểm tra số dương)
  validateSalary(input) {
    // Parse string thành float number
    const salary = parseFloat(input.value);

    // Kiểm tra NaN (Not a Number) hoặc <= 0
    if (isNaN(salary) || salary <= 0) {
      // Set custom validation message
      input.setCustomValidity("Lương phải lớn hơn 0");
    } else {
      // Clear validation message nếu hợp lệ
      input.setCustomValidity("");
    }
  }

  // Hiển thị thông báo (với auto-hide sau 5 giây)
  showMessage(message, type) {
    // Lấy container để hiển thị message
    const resultDiv = document.getElementById("add-result");

    // Inject HTML message với CSS class tương ứng
    // type có thể là: "success", "error", "info"
    resultDiv.innerHTML = `
            <div class="message message-${type}">
                ${message}
            </div>
        `;

    // Tự động ẩn message sau 5 giây (5000ms)
    setTimeout(() => {
      resultDiv.innerHTML = ""; // Clear message
    }, 5000);
  }
}
