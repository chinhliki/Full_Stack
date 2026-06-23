# 📚 Hệ Thống Thư Viện Số - Nền Tảng Tri Thức Thế Hệ Mới

Chào mừng bạn đến với giao diện frontend của dự án **Thư viện Số**, được phát triển trên nền tảng **Vue 3**, **Vite** và **Vuetify** tối ưu hóa hiệu năng cao. Dự án được thiết kế đồng bộ với hệ thống Backend Microservices, mang lại giải pháp quản lý mượn trả sách, thẻ thư viện thông minh trực tuyến và tra cứu tài liệu học tập toàn diện.

---

## ✨ Các Tính Năng Nổi Bật Trên Giao Diện

### 1. Trang Chủ Sinh Động & Công Nghệ
- **Tiêu đề hấp dẫn & Icon công nghệ neon:** Khu vực Hero hiển thị tiêu đề *"Khám Phá Kho Tàng Tri Thức Số Mới"* kèm 8 biểu tượng công nghệ số phát sáng nhẹ (Sách mở, bóng đèn ý tưởng, chip AI, đám mây, kết nối dữ liệu, bộ não,...) với hiệu ứng trôi nổi (`floating`) và xoay chậm vô cực.
- **Thanh tìm kiếm thông minh:** Hiệu ứng co giãn linh hoạt khi tương tác (`focus-within`) giúp độc giả tra cứu tài liệu nhanh chóng.
- **Thống kê dạng Marquee vô tận:** Hiển thị các chỉ số ấn tượng của thư viện (`10.000+ Đầu sách`, `50.000+ Độc giả`, `2.5M+ Lượt đọc`) tự động cuộn mượt mà từ trái qua phải không giật lag.
- **Footer hiện đại:** Tone màu nền sáng gradient xanh-tím đồng bộ hoàn chỉnh, cấu trúc 3 cột rõ ràng cùng Logo thương hiệu có hiệu ứng hover phóng to nhẹ `1.05x`.

### 2. Trang Đăng Nhập & Đăng Ký Cao Cấp
- **Tỉ lệ phân chia 60/40 tối ưu:** Cột biểu mẫu chiếm 60% chiều ngang rộng rãi dễ điền thông tin, cột đồ họa chiếm 40% hiển thị hình ảnh minh họa holographic.
- **Hoạt ảnh Holographic 3D Book:** Cuốn sách kỹ thuật số phát sáng và các hạt dữ liệu tri thức liên tục chuyển động bay lên trên pedestal công nghệ.
- **Glassmorphism Quote Card:** Thẻ trích dẫn danh ngôn mờ kính tinh tế nằm ở góc dưới cột đồ họa.
- **Trang trí Icon nổi hai bên:** Phía trái biểu mẫu trang trí các icon học tập mờ tinh tế; phía phải trang trí các icon neon đậm nét hơn.
- **Xác thực linh hoạt:** Hỗ trợ đăng nhập/đăng ký bằng Email và liên kết nhanh thông qua Google (mẫu).

---

## 🛠️ Công Nghệ Sử Dụng

- **Core:** HTML5, CSS3 (Vanilla CSS cho tối đa hiệu năng và tùy biến chuyển động).
- **Framework:** Vue 3 (Composition API với `<script setup>`).
- **Build Tool:** Vite (Cực nhanh và nhẹ).
- **UI Library:** Vuetify 3 (Material Design Components).
- **Routing:** Vue Router.
- **State Management:** Pinia (Quản lý trạng thái đăng nhập/giỏ sách).

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

### Yêu Cầu Hệ Thống
- [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản LTS v18 trở lên).
- Trình quản lý gói `npm` hoặc `yarn`.

### Các Bước Cài Đặt

1. **Cloning Repository:**
   ```bash
   git clone https://github.com/chinhliki/Full_Stack.git
   cd Full_Stack
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo hoặc chỉnh sửa tệp `.env` ở thư mục gốc:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Khởi chạy máy chủ phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt và truy cập `http://localhost:5173` để xem kết quả.

5. **Đóng gói dự án (Production Build):**
   ```bash
   npm run build
   ```
   Sản phẩm đóng gói sẽ nằm trong thư mục `/dist` sẵn sàng để triển khai lên máy chủ.

---

## 📂 Cấu Trúc Thư Mục View Chính

```text
src/
├── views/
│   ├── auth/
│   │   ├── LoginView.vue       # Trang Đăng nhập cao cấp
│   │   └── RegisterView.vue    # Trang Đăng ký độc giả
│   └── public/
│       └── HomeView.vue        # Trang chủ thư viện số
```

---

## 📝 Giấy Phép & Bản Quyền
Bản quyền thuộc về **Hệ thống Thư viện Số Microservices**. Phát triển và phân phối bởi đội ngũ công nghệ vì sự nghiệp giáo dục và phát triển tri thức số.
