// AuthModule.js - Module xác thực người dùng (kết nối MySQL qua PHP API)
export class AuthModule {
  constructor() {
    this.currentUser = null;
    this.apiBaseUrl = "api.php"; // API endpoint trong public/
    this.init();
  }

  // Khởi tạo module
  init() {
    this.checkSession();
  }

  // Render form đăng nhập (sử dụng template literals và DOM manipulation)
  renderLoginForm() {
    // Lấy element container để inject form
    const container = document.getElementById("auth-form-container");
    // Sử dụng template literals (backticks) để tạo HTML string
    container.innerHTML = `
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label>Tên đăng nhập</label>
                    <input type="text" id="login-username" required>
                </div>
                <div class="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn btn-primary">Đăng nhập</button>
                <p class="auth-toggle" id="show-register">Chưa có tài khoản? Đăng ký</p>
            </form>
        `;

    // Gắn event listener cho form submit
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault(); // Ngăn form reload trang (default behavior)
      this.handleLogin(); // Gọi method xử lý đăng nhập
    });

    // Gắn event listener cho link chuyển sang form đăng ký
    document.getElementById("show-register").addEventListener("click", () => {
      this.renderRegisterForm(); // Render form đăng ký
    });
  }

  // Render form đăng ký
  renderRegisterForm() {
    const container = document.getElementById("auth-form-container");
    container.innerHTML = `
            <form id="register-form" class="auth-form">
                <div class="form-group">
                    <label>Tên đăng nhập</label>
                    <input type="text" id="register-username" required>
                </div>
                <div class="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" id="register-password" required>
                </div>
                <div class="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <input type="password" id="register-confirm" required>
                </div>
                <div class="form-group">
                    <label>Họ tên</label>
                    <input type="text" id="register-fullname" required>
                </div>
                <button type="submit" class="btn btn-primary">Đăng ký</button>
                <p class="auth-toggle" id="show-login">Đã có tài khoản? Đăng nhập</p>
            </form>
        `;

    document.getElementById("register-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    document.getElementById("show-login").addEventListener("click", () => {
      this.renderLoginForm();
    });
  }

  // Xử lý đăng nhập với async/await (gọi API backend)
  async handleLogin() {
    // Lấy giá trị username từ input và loại bỏ khoảng trắng đầu cuối
    const username = document.getElementById("login-username").value.trim();
    // Lấy giá trị password từ input
    const password = document.getElementById("login-password").value;

    try {
      // Gọi API login
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Nếu đăng nhập thành công: lưu user info
        this.currentUser = data.data.user;
        // Lưu session vào sessionStorage (thay vì localStorage)
        this.saveSession();
        // Gọi callback function khi đăng nhập thành công
        this.onLoginSuccess();
      } else {
        // Nếu đăng nhập thất bại: hiển thị thông báo lỗi
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi kết nối server: " + error.message);
    }
  }

  // Xử lý đăng ký (gọi API backend)
  async handleRegister() {
    // Lấy tất cả giá trị từ form đăng ký
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value;
    const confirm = document.getElementById("register-confirm").value;
    const fullname = document.getElementById("register-fullname").value.trim();

    // Validate: Kiểm tra mật khẩu và xác nhận khớp nhau
    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Validate: Kiểm tra độ dài mật khẩu tối thiểu
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      // Gọi API register
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, fullname }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        this.renderLoginForm();
      } else {
        alert(data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi kết nối server: " + error.message);
    }
  }

  // Lưu phiên làm việc vào sessionStorage (Session persistence)
  saveSession() {
    // Tạo object session chứa thông tin cần thiết
    const session = {
      user: this.currentUser, // Thông tin user hiện tại
      timestamp: new Date().toISOString(), // Thời điểm đăng nhập
    };
    // Lưu session vào sessionStorage (thay vì localStorage)
    sessionStorage.setItem("hrm_session", JSON.stringify(session));
  }

  // Kiểm tra phiên làm việc khi khởi động app
  async checkSession() {
    // Đọc session từ sessionStorage
    const localSession = sessionStorage.getItem("hrm_session");

    if (localSession) {
      try {
        const data = JSON.parse(localSession);
        this.currentUser = data.user;
      } catch (error) {
        // Session data không hợp lệ, xóa đi
        sessionStorage.removeItem("hrm_session");
      }
    }

    // Không cần check với server vì sessionStorage đã đủ
    // Nếu user đóng browser, sessionStorage sẽ tự động clear
  }

  // Đăng xuất (Clear session và gọi API logout)
  async logout() {
    try {
      // Gọi API logout
      await fetch(`${this.apiBaseUrl}/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      // Không quan trọng nếu API lỗi, vẫn clear session local
    }

    // Xóa session khỏi sessionStorage
    sessionStorage.removeItem("hrm_session");
    // Reset currentUser về null
    this.currentUser = null;
    // Gọi callback để chuyển về màn hình login
    this.onLogout();
  }

  // Kiểm tra đăng nhập (getter method)
  isAuthenticated() {
    // Trả về true nếu currentUser không phải null
    return this.currentUser !== null;
  }

  // Lấy người dùng hiện tại (getter method)
  getCurrentUser() {
    // Trả về object user hiện tại
    return this.currentUser;
  }

  // Callback khi đăng nhập thành công
  onLoginSuccess() {}

  // Callback khi đăng xuất
  onLogout() {}
}
