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
    this.checkEmailVerification(); // Kiểm tra link verify từ email
  }

  // Kiểm tra URL có chứa token verify không
  checkEmailVerification() {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get("verify");

    if (verifyToken) {
      this.verifyEmailToken(verifyToken);
    }
  }

  // Gọi API verify email
  async verifyEmailToken(token) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/verify/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Xác thực email thành công! Bạn có thể đăng nhập ngay.");
      } else {
        alert("❌ " + (data.message || "Token không hợp lệ hoặc đã hết hạn."));
      }

      // Xóa query string và reload trang login
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Verification error:", error);
      alert("❌ Không thể kết nối đến server.");
    }
  }

  // Render form đăng nhập (Modern Design)
  renderLoginForm() {
    const container = document.getElementById("auth-form-container");
    container.className = "auth-container"; // Reset class

    container.innerHTML = `
      <div class="form-container sign-in">
        <form id="login-form" class="auth-form">
          <h1>Đăng nhập</h1>
          <div class="social-icons">
            <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>hoặc sử dụng tài khoản hệ thống</span>
          <div class="form-group">
            <input type="text" id="login-username" placeholder="Tên đăng nhập" required>
          </div>
          <div class="form-group">
            <input type="password" id="login-password" placeholder="Mật khẩu" required>
          </div>
          <a href="#">Quên mật khẩu?</a>
          <button type="submit" class="btn">Đăng nhập</button>
        </form>
      </div>
      
      <div class="form-container sign-up">
        <form id="register-form" class="auth-form">
          <h1>Tạo tài khoản</h1>
          <div class="social-icons">
            <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>hoặc đăng ký bằng email</span>
          <div class="form-group">
            <input type="text" id="register-username" placeholder="Tên đăng nhập" required>
          </div>
          <div class="form-group">
            <input type="text" id="register-fullname" placeholder="Họ và tên" required>
          </div>
          <div class="form-group">
            <input type="email" id="register-email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input type="password" id="register-password" placeholder="Mật khẩu" required>
          </div>
          <div class="form-group">
            <input type="password" id="register-confirm" placeholder="Xác nhận mật khẩu" required>
          </div>
          <button type="submit" class="btn">Đăng ký</button>
        </form>
      </div>
      
      <div class="toggle-container">
        <div class="toggle">
          <div class="toggle-panel toggle-left">
            <h1>Chào mừng trở lại!</h1>
            <p>Đăng nhập để sử dụng đầy đủ tính năng của hệ thống</p>
            <button class="hidden" id="login">Đăng nhập</button>
          </div>
          <div class="toggle-panel toggle-right">
            <h1>Xin chào!</h1>
            <p>Đăng ký tài khoản để sử dụng hệ thống quản lý nhân sự</p>
            <button class="hidden" id="register">Đăng ký</button>
          </div>
        </div>
      </div>
    `;

    // Toggle between login and register
    const authContainer = container;
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authContainer.classList.add("active");
    });

    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authContainer.classList.remove("active");
    });

    // Login form submit
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Register form submit
    document.getElementById("register-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegister();
    });
  }

  // Deprecated - no longer used (kept for compatibility)
  renderRegisterForm() {
    this.renderLoginForm(); // Just render the combined form
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
    const email = document.getElementById("register-email").value.trim();

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

    // Validate: Kiểm tra email hợp lệ
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    try {
      // Gọi API register
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, fullname, email }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
        );
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
