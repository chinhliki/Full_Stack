# 📚 Hệ Thống Thư Viện Số - Nền Tảng Tri Thức Thế Hệ Mới

Chào mừng bạn đến với giao diện frontend của dự án **Thư viện Số**, được phát triển trên nền tảng **Vue 3**, **Vite** và **Vuetify** tối ưu hóa hiệu năng cao. Dự án được thiết kế đồng bộ với hệ thống Backend Microservices, mang lại giải pháp quản lý mượn trả sách, thẻ thư viện thông minh trực tuyến và tra cứu tài liệu học tập toàn diện.

---

## ✨ Các Tính Năng Nổi Bật Trên Giao Diện

### 1. Dashboard Thống Kê & Quản Trị Tương Tác (MỚI)
- **Bố cục chân trang chia đôi linh hoạt:** Bố cục chân trang Dashboard được tái cấu trúc thành 2 cột (`cols="12" md="6"`):
  - **Cột trái:** Top Sách Phổ Biến Nhất.
  - **Cột phải:** **Độc Giả Phát Sinh Phí Phạt** - Danh sách này tổng hợp tự động và hiển thị theo thời gian thực từ 2 nguồn dữ liệu:
    1. *Sách quá hạn chưa trả:* Tính toán phí phạt dự kiến (`5,000 đ / ngày`) dựa trên số ngày trễ hẹn của độc giả.
    2. *Sách đã trả chưa thu phạt:* Các khoản phạt chính thức đã chốt nhưng chưa thanh toán.
- **Thao tác nhanh trực tiếp:** Quản trị viên chỉ cần nhấn vào tên độc giả bị phạt trên Dashboard, hệ thống sẽ tự động chuyển hướng đến trang [Sách quá hạn](/app/overdue) hoặc [Công nợ phí phạt](/app/fines) tương ứng để thực hiện thu phạt.
- **Thẻ thống kê thông minh (Interactive Cards):** Toàn bộ các thẻ stats trên Dashboard đều có hiệu ứng hover đổi màu/glow và click để chuyển nhanh đến danh sách chi tiết (Tổng độc giả -> Quản lý độc giả, Tổng tiền phạt -> Công nợ phí phạt,...).

### 2. Quản Lý Phiếu Mượn Cho Độc Giả (MỚI)
- **Gom nhóm phiếu mượn ảo (Virtual Slips Grouping):** Do dữ liệu backend lưu trữ dạng danh mục cuốn sách riêng lẻ, frontend tự động nhóm các cuốn sách mượn cùng ngày (`borrowDate`) thành các **Phiếu mượn** đồng nhất.
- **Giao diện Card 12px hiện đại:** Hiển thị danh sách phiếu mượn dưới dạng các card lưới có thiết kế bo góc tròn `12px` tinh tế, viền đỏ nhạt nhẹ nhàng (`rgba(239, 68, 68, 0.22)`) và hiệu ứng đổ bóng phát sáng (glowing shadow) khi rê chuột.
- **Bộ lọc kép chuyên sâu:** Độc giả có thể lọc phiếu mượn dễ dàng theo:
  - *Trạng thái:* Đang mượn, Đã trả, Quá hạn.
  - *Thời gian:* Tháng này, 3 tháng gần nhất, Tất cả.
- **Modal chi tiết Scale-In:** Bấm vào phiếu mượn sẽ mở modal danh sách sách đã mượn kèm hạn trả, phí phạt và nút báo trả trực tiếp. Modal sử dụng hiệu ứng phóng to mượt mà (`dialogScaleIn`) trong vòng `0.2s`.

### 3. Đồng Bộ Hóa Hệ Thống Màu & Dark Mode (Cải Tiến)
- **Khởi tạo và Lifecycle ổn định:** Đồng bộ hóa biến trạng thái `isDark` trực tiếp từ Vuetify theme vào `localStorage` và thẻ `body` ngay khi ứng dụng mount, triệt tiêu hoàn toàn hiện tượng nhấp nháy sáng (layout flashing).
- **Thiết kế Cyberpunk & Neon Aura:**
  - Viền phát sáng tím–xanh neon quanh các hộp thông tin chính, tiêu đề app bar, bảng biểu và thanh điều hướng bên.
  - Loại bỏ hoàn toàn lớp overlay xám ở góc trên các stats card để giữ nguyên nền sáng sạch sẽ và viền màu neon sắc nét.
  - Nút chuyển theme (Sun/Moon) được tối ưu hiệu ứng xoay và tạo vùng sáng phát quang huyền ảo (neon glowing pulse) đẹp mắt.
  - Bổ sung icon ví tiền/đồng xu có dấu trừ `mdi-cash-minus` màu cam phát sáng nhẹ trên thẻ "Tổng phí phạt".

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
- Trình quản lý gói `npm`.

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
   VITE_API_BASE_URL=http://26.114.35.12:5000
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
├── api/
│   ├── borrowApi.js        # Các API liên quan tới mượn trả, phí phạt
│   └── reportApi.js        # API thống kê báo cáo dashboard
├── layouts/
│   └── MainLayout.vue      # Bố cục sidebar điều hướng & profile người dùng
├── views/
│   ├── auth/
│   │   ├── LoginView.vue       # Trang Đăng nhập cao cấp
│   │   └── RegisterView.vue    # Trang Đăng ký độc giả
│   ├── dashboard/
│   │   └── DashboardView.vue   # Dashboard thống kê kèm cột Độc giả bị phạt & Clickable Cards
│   ├── borrows/
│   │   ├── BorrowListView.vue  # Quản lý toàn bộ danh sách phiếu mượn (Admin)
│   │   ├── OverdueListView.vue # Theo dõi sách quá hạn (Admin)
│   │   └── FineListView.vue    # Quản lý công nợ thu phí phạt (Admin)
│   ├── reader/
│   │   └── MyBorrowHistoryView.vue # Trang phiếu mượn cá nhân dạng card của độc giả
│   └── public/
│       └── HomeView.vue        # Trang chủ thư viện số
```

---

## 📝 Giấy Phép & Bản Quyền
Bản quyền thuộc về **Hệ thống Thư viện Số Microservices**. Phát triển và phân phối bởi đội ngũ công nghệ vì sự nghiệp giáo dục và phát triển tri thức số.
