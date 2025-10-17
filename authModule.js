// AuthModule.js - Module xác thực người dùng
export class AuthModule {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  // Khởi tạo module
  init() {
    this.checkSession();
  }

  // Hàm băm mật khẩu đơn giản (sử dụng closure)
  createHasher() {
    // Định nghĩa chuỗi bí mật để tăng độ bảo mật khi băm mật khẩu
    const secret = "hrm_secret_key_2025";

    // Trả về một closure - hàm con có thể truy cập biến secret từ hàm cha
    return (password) => {
      let hash = 0; // Khởi tạo giá trị hash ban đầu
      const input = password + secret; // Kết hợp password với secret key

      // Vòng lặp qua từng ký tự trong chuỗi input để tính hash
      for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i); // Lấy mã ASCII của ký tự
        hash = (hash << 5) - hash + char; // Công thức hash: (hash * 32) - hash + char
        hash = hash & hash; // Chuyển thành số nguyên 32-bit bằng bitwise AND
      }

      // Chuyển đổi hash number sang chuỗi base36 (0-9, a-z)
      return hash.toString(36);
    };
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

  // Xử lý đăng nhập với async/await (demonstrating async operations)
  async handleLogin() {
    // Lấy giá trị username từ input và loại bỏ khoảng trắng đầu cuối
    const username = document.getElementById("login-username").value.trim();
    // Lấy giá trị password từ input (không trim để giữ nguyên khoảng trắng)
    const password = document.getElementById("login-password").value;

    // Giả lập delay 500ms khi kiểm tra (tạo trải nghiệm thực tế hơn)
    // Keyword 'await' đợi Promise hoàn thành trước khi tiếp tục
    await this.delay(500);

    // Lấy danh sách tất cả users từ localStorage
    const users = this.getUsers();
    // Tạo hàm hasher thông qua closure
    const hasher = this.createHasher();
    // Băm mật khẩu người dùng nhập vào để so sánh
    const hashedPassword = hasher(password);

    // Tìm user có username và password khớp trong danh sách
    // Sử dụng Array.find() - higher-order function
    const user = users.find(
      (u) => u.username === username && u.password === hashedPassword
    );

    // Kiểm tra kết quả đăng nhập
    if (user) {
      // Nếu tìm thấy user: lưu vào currentUser (chỉ lưu info cần thiết, không lưu password)
      this.currentUser = { username: user.username, fullname: user.fullname };
      // Lưu session vào localStorage để duy trì đăng nhập
      this.saveSession();
      // Gọi callback function khi đăng nhập thành công
      this.onLoginSuccess();
    } else {
      // Nếu không tìm thấy: hiển thị thông báo lỗi
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  }

  // Xử lý đăng ký (async/await pattern)
  async handleRegister() {
    // Lấy tất cả giá trị từ form đăng ký
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value;
    const confirm = document.getElementById("register-confirm").value;
    const fullname = document.getElementById("register-fullname").value.trim();

    // Validate: Kiểm tra mật khẩu và xác nhận khớp nhau
    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return; // Early return - dừng thực thi nếu validation fail
    }

    // Validate: Kiểm tra độ dài mật khẩu tối thiểu
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return; // Early return
    }

    // Giả lập delay 500ms khi xử lý đăng ký (async operation)
    await this.delay(500);

    // Lấy danh sách users hiện tại từ localStorage
    const users = this.getUsers();

    // Kiểm tra username đã tồn tại chưa (sử dụng Array.find())
    if (users.find((u) => u.username === username)) {
      alert("Tên đăng nhập đã tồn tại!");
      return; // Early return nếu username bị trùng
    }

    // Tạo hàm hasher thông qua closure và băm mật khẩu
    const hasher = this.createHasher();
    // Tạo object user mới với các thông tin cần thiết
    const newUser = {
      username, // ES6 shorthand property (equivalent to username: username)
      password: hasher(password), // Lưu password đã được băm để bảo mật
      fullname, // ES6 shorthand property
      createdAt: new Date().toISOString(), // Lưu timestamp đăng ký (ISO format)
    };

    // Thêm user mới vào mảng users (mutate array)
    users.push(newUser);
    // Lưu toàn bộ danh sách users vào localStorage
    // JSON.stringify: convert object/array sang string để lưu trữ
    localStorage.setItem("hrm_users", JSON.stringify(users));

    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    this.renderLoginForm();
  }

  // Lấy danh sách người dùng từ localStorage (với default data initialization)
  getUsers() {
    // Đọc data từ localStorage
    const data = localStorage.getItem("hrm_users");

    // Nếu chưa có data (lần đầu chạy ứng dụng)
    if (!data) {
      // Tạo admin mặc định để có thể đăng nhập lần đầu
      const hasher = this.createHasher(); // Tạo hàm hash
      const defaultUsers = [
        {
          username: "admin", // Username mặc định
          password: hasher("admin123"), // Password mặc định đã được băm
          fullname: "Administrator", // Tên đầy đủ
          createdAt: new Date().toISOString(), // Timestamp tạo tài khoản
        },
      ];
      // Lưu default users vào localStorage
      localStorage.setItem("hrm_users", JSON.stringify(defaultUsers));
      return defaultUsers; // Trả về default users
    }

    // Nếu đã có data: parse JSON string thành array và trả về
    return JSON.parse(data);
  }

  // Lưu phiên làm việc vào localStorage (Session persistence)
  saveSession() {
    // Tạo object session chứa thông tin cần thiết
    const session = {
      user: this.currentUser, // Thông tin user hiện tại
      timestamp: new Date().toISOString(), // Thời điểm đăng nhập
    };
    // Lưu session vào localStorage để persist qua các lần reload
    localStorage.setItem("hrm_session", JSON.stringify(session));
  }

  // Kiểm tra phiên làm việc khi khởi động app
  checkSession() {
    // Đọc session từ localStorage
    const session = localStorage.getItem("hrm_session");

    // Nếu có session (user đã đăng nhập trước đó)
    if (session) {
      const data = JSON.parse(session); // Parse JSON string
      this.currentUser = data.user; // Restore user info
      // Không cần đăng nhập lại, giữ trạng thái đã đăng nhập
    }
  }

  // Đăng xuất (Clear session và reset state)
  logout() {
    // Xóa session khỏi localStorage
    localStorage.removeItem("hrm_session");
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

  // Hàm delay (tạo Promise để async/await)
  delay(ms) {
    // Trả về Promise resolve sau ms milliseconds
    // setTimeout: built-in function chạy callback sau delay
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Callback khi đăng nhập thành công
  onLoginSuccess() {}

  // Callback khi đăng xuất
  onLogout() {}
}
