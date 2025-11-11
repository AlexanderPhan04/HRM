# 🎨 HRM System - Design System Documentation

> **Hệ thống thiết kế giao diện cho dự án Quản lý Nhân sự**  
> Version: 1.0 | Updated: November 11, 2025

---

## 🎨 Color Palette (Bảng màu)

### Primary Colors (Màu chính)

```css
--primary-gradient-start: #5c6bc0; /* Tím xanh */
--primary-gradient-end: #2da0a8; /* Xanh ngọc */
--primary-solid: #2da0a8; /* Xanh ngọc đậm */
```

**Gradient chính:**

```css
background: linear-gradient(to right, #5c6bc0, #2da0a8);
```

### Secondary Colors (Màu phụ)

```css
--background-primary: #e2e2e2; /* Xám nhạt */
--background-gradient: #c9d6ff; /* Xanh pastel */
--white: #ffffff;
--text-dark: #333333;
--text-medium: #555555;
--text-light: #666666;
--border-gray: #cccccc;
```

### Status Colors (Màu trạng thái)

```css
--success: #4caf50; /* Xanh lá - thành công */
--error: #f44336; /* Đỏ - lỗi */
--warning: #ff9800; /* Cam - cảnh báo */
--info: #2196f3; /* Xanh dương - thông tin */
```

### Background Gradients

```css
/* Auth screen background */
background: linear-gradient(to right, #e2e2e2, #c9d6ff);

/* Toggle panel gradient */
background: linear-gradient(to right, #5c6bc0, #2da0a8);
```

---

## 📝 Typography (Font chữ)

### Font Families

```css
--font-primary: "Montserrat", sans-serif; /* Auth forms */
--font-secondary: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; /* Dashboard */
```

### Font Sizes

```css
--font-size-xxl: 28px; /* H1 - Tiêu đề chính */
--font-size-xl: 24px; /* H2 - Tiêu đề phụ */
--font-size-lg: 18px; /* H3 - Tiêu đề nhỏ */
--font-size-md: 14px; /* Body text */
--font-size-sm: 13px; /* Input, button text */
--font-size-xs: 12px; /* Small text, captions */
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights

```css
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.6;
```

---

## 📐 Spacing (Khoảng cách)

### Margin & Padding Scale

```css
--space-xs: 5px;
--space-sm: 10px;
--space-md: 15px;
--space-lg: 20px;
--space-xl: 30px;
--space-xxl: 40px;
```

### Input/Button Spacing

```css
/* Input fields */
padding: 10px 15px;
margin: 8px 0;

/* Buttons */
padding: 10px 45px;
margin-top: 10px;

/* Form đăng ký (spacing nhỏ hơn) */
padding: 8px 15px;
margin: 6px 0;
```

---

## 🔘 Border Radius (Bo góc)

```css
--radius-sm: 8px; /* Input fields, small buttons */
--radius-md: 10px; /* Cards, containers */
--radius-lg: 20px; /* Large containers */
--radius-xl: 30px; /* Auth container */
--radius-circle: 50%; /* Avatar, icons */
--radius-curved: 150px; /* Toggle panel (decorative) */
```

**Áp dụng:**

- **Input fields**: `8px`
- **Buttons**: `8px`
- **Auth container**: `10px` (để tránh vết lõm với toggle)
- **Toggle panel**: `150px 0 0 100px` (bất đối xứng - tạo hiệu ứng)
- **Social icons**: `20%` (gần vuông bo góc)

---

## 🎭 Shadows (Bóng đổ)

```css
/* Card shadow - Nhẹ */
--shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.1);

/* Auth container shadow - Vừa */
--shadow-md: 0 5px 15px rgba(0, 0, 0, 0.35);

/* Hover shadow - Mạnh */
--shadow-lg: 0 5px 15px rgba(102, 126, 234, 0.4);
```

**Áp dụng:**

```css
/* Dashboard cards */
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

/* Auth container */
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);

/* Button hover */
box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
```

---

## 🔲 Components (Các thành phần)

### 1. Buttons

#### Primary Button

```css
.btn-primary {
  background-color: #2da0a8;
  color: #fff;
  font-size: 12px;
  padding: 10px 45px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
```

#### Ghost Button (Toggle panel)

```css
.btn-ghost {
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 10px 45px;
  border-radius: 8px;
  font-weight: 600;
}
```

#### Button Sizes

```css
/* Small */
padding: 8px 35px;

/* Medium (default) */
padding: 10px 45px;

/* Large */
padding: 12px 50px;
```

---

### 2. Input Fields

```css
.input-field {
  background-color: #eee;
  border: none;
  margin: 8px 0;
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 8px;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
}

.input-field:focus {
  background-color: #fff;
  border: 1px solid #2da0a8;
}

/* Input trong form đăng ký (compact) */
.input-compact {
  margin: 6px 0;
  padding: 8px 15px;
}
```

---

### 3. Cards

#### Auth Container

```css
.auth-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}
```

#### Dashboard Card

```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}
```

---

### 4. Social Icons

```css
.social-icons a {
  border: 1px solid #ccc;
  border-radius: 20%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.social-icons a:hover {
  background-color: #2da0a8;
  border-color: #2da0a8;
  color: white;
}
```

**Icons sử dụng:** Font Awesome 6.4.2

- Google: `fa-brands fa-google-plus-g`
- Facebook: `fa-brands fa-facebook-f`
- GitHub: `fa-brands fa-github`
- LinkedIn: `fa-brands fa-linkedin-in`

---

### 5. Toggle Panel (Auth Form)

```css
.toggle-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  border-radius: 150px 0 0 100px;
  z-index: 2;
}

.toggle {
  background: linear-gradient(to right, #5c6bc0, #2da0a8);
  height: 100%;
  color: #fff;
  position: relative;
  left: -100%;
  width: 200%;
  transform: translateX(0);
  transition: all 0.6s ease-in-out;
}

/* Animation khi active */
.auth-container.active .toggle-container {
  transform: translateX(-100%);
  border-radius: 0 150px 100px 0;
}

.auth-container.active .toggle {
  transform: translateX(50%);
}
```

---

## 🎬 Animations (Hiệu ứng chuyển động)

### Transitions

```css
/* Smooth transition - mặc định */
transition: all 0.3s ease;

/* Slow transition - form sliding */
transition: all 0.6s ease-in-out;

/* Fast transition - hover effects */
transition: all 0.2s ease;
```

### Keyframes Animations

#### Move (Form sliding)

```css
@keyframes move {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
```

#### Spin (Loading)

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

### Hover Effects

```css
/* Button hover */
transform: translateY(-2px);
box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);

/* Icon hover */
background-color: #2da0a8;
color: white;
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  .auth-container {
    width: 100%;
    min-height: auto;
  }

  .toggle-container {
    display: none; /* Ẩn toggle trên mobile */
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .auth-container {
    width: 90%;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .auth-container {
    width: 768px;
  }
}
```

---

## 🎯 Z-Index Layers

```css
/* Layering system */
--z-background: 0;
--z-toggle: 2; /* Toggle panel */
--z-form: 5; /* Form containers */
--z-modal: 10; /* Modal/Dialog */
--z-dropdown: 20; /* Dropdown menus */
--z-tooltip: 30; /* Tooltips */
--z-notification: 40; /* Toast notifications */
```

**Áp dụng:**

- Background: `z-index: 0`
- Toggle panel: `z-index: 2`
- Sign-in form: `z-index: 5`
- Sign-up form (active): `z-index: 5`

---

## 📚 Usage Examples (Ví dụ sử dụng)

### Auth Screen Background

```css
#auth-screen {
  background: linear-gradient(to right, #e2e2e2, #c9d6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}
```

### Primary Button với Icon

```html
<button class="btn btn-primary"><i class="fa fa-sign-in"></i> Đăng nhập</button>
```

### Input Field với Placeholder

```html
<input type="text" class="input-field" placeholder="Tên đăng nhập" required />
```

### Card với Gradient Header

```html
<div class="card">
  <div
    class="card-header"
    style="background: linear-gradient(to right, #5c6bc0, #2da0a8);"
  >
    <h3>Tiêu đề</h3>
  </div>
  <div class="card-body">Nội dung</div>
</div>
```

---

## 🛠️ Implementation Guidelines (Hướng dẫn triển khai)

### 1. Thêm Google Fonts

```html
<!-- Trong <head> của index.html -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
/>
```

### 2. Thêm Font Awesome

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
/>
```

### 3. CSS Variables (Khuyến nghị)

```css
:root {
  /* Colors */
  --primary: #2da0a8;
  --primary-gradient: linear-gradient(to right, #5c6bc0, #2da0a8);

  /* Fonts */
  --font-primary: "Montserrat", sans-serif;

  /* Spacing */
  --space-md: 15px;

  /* Border radius */
  --radius-sm: 8px;

  /* Shadows */
  --shadow-md: 0 5px 15px rgba(0, 0, 0, 0.35);
}
```

---

## 🎨 Design Principles (Nguyên tắc thiết kế)

1. **Consistency** - Nhất quán trong màu sắc, spacing, typography
2. **Hierarchy** - Phân cấp rõ ràng qua font size, color, spacing
3. **Accessibility** - Contrast ratio đủ cao cho text (WCAG AA)
4. **Responsive** - Tương thích mọi kích thước màn hình
5. **Performance** - Tối ưu animation, transition (60fps)

---

## 📝 Notes (Ghi chú)

- **Auth container border-radius**: Hiện tại dùng `10px` để tránh vết lõm khi toggle panel có `border-radius: 150px`
- **Toggle animation**: Sử dụng `transform: translateX()` thay vì `left/right` để tối ưu performance
- **Form spacing**: Form đăng ký có spacing nhỏ hơn (6px) so với đăng nhập (8px) do nhiều trường hơn
- **Z-index**: Form phải có z-index cao hơn toggle để không bị che

---

## 🔄 Version History

- **v1.0** (Nov 11, 2025): Initial design system documentation
  - Auth form với gradient toggle panel
  - Modern sliding animation
  - Responsive cho mobile/tablet/desktop

---

**📧 Contact**: HRM Development Team  
**📅 Last Updated**: November 11, 2025
