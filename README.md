# 📚 Hệ Thống Thư Viện Số - Nền Tảng Tri Thức Thế Hệ Mới

Chào mừng bạn đến với giao diện frontend của dự án **Thư viện Số**, được phát triển trên nền tảng **Vue 3**, **Vite** và **Vuetify** tối ưu hóa hiệu năng cao. Dự án được thiết kế đồng bộ với hệ thống Backend Microservices, mang lại giải pháp quản lý mượn trả sách, thẻ thư viện thông minh trực tuyến và tra cứu tài liệu học tập toàn diện.

---

## ✨ Các Tính Năng Nổi Bật Trên Giao Diện

### 1. Quản Lý Độc Giả Toàn Diện (MỚI NÂNG CẤP)
* **Thêm mới độc giả thủ công:** Nút bấm **Thêm độc giả** mở hộp thoại nhập liệu hiện đại (Họ tên, Email, Mật khẩu tài khoản, Số điện thoại, Địa chỉ, Trạng thái thẻ). Nếu chọn trạng thái "Khóa thẻ", hệ thống tự động khóa thẻ thư viện sau khi đăng ký tài khoản thành công.
* **Import hàng loạt bằng Excel (.xlsx, .xls, .csv):** Tích hợp thư viện **SheetJS (xlsx)** xử lý phân tích file Excel ngay tại client-side. Hệ thống tự động ánh xạ cột theo tiêu đề động (Họ và tên, Email, Mật khẩu tạm thời, SĐT, Địa chỉ) giúp hạn chế sai sót khi sắp xếp cột.
* **Bảng báo lỗi chi tiết:** Hiển thị số lượng dòng hợp lệ/lỗi ngay ở màn hình xem trước và liệt kê danh sách lỗi hệ thống kèm số dòng cụ thể ở bước hoàn tất.
* **Menu hành động tinh gọn:** Toàn bộ menu hành động cũ trên từng dòng được thay thế bằng dải nút biểu tượng nằm ngang kèm hiệu ứng hover và tooltip giải thích chức năng (`mdi-card-account-details`, `mdi-calendar-plus`, `mdi-lock`, `mdi-account-lock`).
* **Thanh công cụ hành động nổi (Bulk Action Toolbar):** Xuất hiện ở đáy màn hình với hiệu ứng kính mờ (glassmorphism) khi chọn nhiều độc giả, hỗ trợ các chức năng: *Xuất dữ liệu đã chọn, Khóa thẻ hàng loạt, Xuất toàn bộ CSV, Bỏ chọn*.
* **Bố cục trực quan:** Ô vuông "Chọn tất cả" được thiết kế thẳng hàng ngang với văn bản nhãn. Nút "Lọc danh sách" được dịch chuyển và sắp xếp sát ngay bên tay phải của thanh tìm kiếm.

### 2. Nhập Kho Sách Hàng Loạt & Xuất Báo Cáo Excel (MỚI)
* **Trang ImportBooksView.vue:** Thiết kế kéo thả tệp tin Excel/CSV cực kỳ mượt mà. Cấu hình giới hạn kích thước lên tới **50 MB** hỗ trợ nhập lượng dữ liệu khổng lồ (hơn 10.000 đầu sách cùng lúc).
* **Đồng bộ hóa cột Tiếng Việt:** Hỗ trợ chuẩn xác cấu trúc 10 cột khớp DTO của Backend: `ISBN, Tên Sách, Tác Giả, Nhà Xuất Bản, Năm Xuất Bản, Thể Loại, Mô Tả, Ảnh Bìa, Tổng Số Bản, Vị Trí Kệ`.
* **Xuất báo cáo kho sách:** Nút xuất file Excel (CSV) tại trang Quản lý sách tự động xuất lượng sách kèm theo chỉ số **Số Bản Sẵn Có** để theo dõi lượng sách còn lại trên kệ. Sử dụng định dạng **UTF-8 BOM** hiển thị tiếng Việt chuẩn xác trên MS Excel.

### 3. Tích Hợp QR Code Thẻ Thư Viện Số (MỚI)
* **QR Code nội bộ:** Mã QR Code được vẽ trực tiếp từ `cardNumber` của độc giả bằng thư viện `qrcode.vue` (kích thước 84px) và nhúng gọn gàng ở góc phải dưới của thẻ thư viện số Premium (`MyLibraryCardView.vue`), loại bỏ phần card hiển thị QR riêng lẻ bên dưới.
* **Hỗ trợ quét camera tại quầy:** Cả trang Quầy lưu thông (`BorrowCreateView.vue`) và trang Quản lý độc giả (`ReaderListView.vue`) đều được trang bị nút quét mã QR qua camera. Thủ thư chỉ cần quét thẻ của độc giả để hệ thống tự động tìm kiếm thông tin và điền nhanh vào form giao dịch mượn trả/xem thẻ chi tiết.

### 4. Dashboard Thống Kê & Quản Trị Tương Tác
* **Bố cục Dashboard thông minh:** Bố cục stats card và charts linh hoạt hiển thị thời gian thực.
* **Độc Giả Phát Sinh Phí Phạt:** Tổng hợp tự động và hiển thị theo thời gian thực từ 2 nguồn: sách quá hạn chưa trả và sách đã trả chưa thu phạt.
* **Gom nhóm phiếu mượn ảo (Virtual Slips Grouping):** Do dữ liệu backend lưu trữ dạng danh mục cuốn sách riêng lẻ, frontend tự động nhóm các cuốn sách mượn cùng ngày (`borrowDate`) thành các **Phiếu mượn** đồng nhất.
* **Đồng bộ hóa hệ thống màu & Dark Mode:** Viền phát sáng tím–xanh neon quanh các hộp thông tin chính, tiêu đề app bar, bảng biểu và thanh điều hướng bên.

---

## 🛠️ Công Nghệ Sử Dụng

- **Core:** HTML5, CSS3 (Vanilla CSS cho tối đa hiệu năng và tùy biến chuyển động).
- **Framework:** Vue 3 (Composition API với `<script setup>`).
- **Build Tool:** Vite.
- **UI Library:** Vuetify 3 (Material Design Components).
- **Libraries:**
  - `xlsx` (SheetJS cho việc đọc Excel tại Client).
  - `qrcode.vue` (Render mã QR dạng SVG).
  - `html5-qrcode` (Hỗ trợ camera quét mã QR).
  - `@microsoft/signalr` (Kết nối Real-time Hub thông báo).
  - `apexcharts` & `vue3-apexcharts` (Vẽ biểu đồ thống kê báo cáo).
- **Routing:** Vue Router.
- **State Management:** Pinia.

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
│   ├── cardApi.js          # API tra cứu thông tin thẻ theo số thẻ quét QR
│   ├── libraryCardApi.js   # API gia hạn/khóa/mở khóa thẻ
│   └── reportApi.js        # API thống kê báo cáo dashboard
├── components/
│   ├── ImportExcelDialog.vue # Hộp thoại nạp Excel/CSV độc giả client-side
│   ├── NotificationBell.vue  # Quản lý nhận thông báo real-time & polling fallback
│   └── QRScanner.vue         # Module quét mã QR qua camera
├── layouts/
│   └── MainLayout.vue      # Bố cục sidebar điều hướng & profile người dùng
├── router/
│   └── index.js            # Khai báo định tuyến phân quyền vai trò
├── views/
│   ├── auth/
│   │   ├── LoginView.vue       # Trang Đăng nhập cao cấp
│   │   └── RegisterView.vue    # Trang Đăng ký độc giả
│   ├── books/
│   │   ├── BookListView.vue    # Quản lý kho sách (Có Xuất báo cáo CSV)
│   │   └── ImportBooksView.vue # Trang nhập Excel sách dung lượng lớn 50MB
│   ├── dashboard/
│   │   └── DashboardView.vue   # Dashboard thống kê kèm cột Độc giả bị phạt
│   ├── borrows/
│   │   ├── BorrowCreateView.vue # Quầy lưu thông mượn trả sách (Tích hợp quét QR thẻ)
│   │   ├── BorrowListView.vue  # Quản lý toàn bộ danh sách phiếu mượn
│   │   ├── OverdueListView.vue # Theo dõi sách quá hạn
│   │   └── FineListView.vue    # Quản lý công nợ thu phí phạt
│   ├── readers/
│   │   └── ReaderListView.vue  # Quản lý độc giả (Thêm mới, Excel, Quét QR, Bottom Toolbar)
│   └── reader/
│       ├── MyBorrowHistoryView.vue # Trang phiếu mượn cá nhân dạng card
│       └── MyLibraryCardView.vue   # Trang thẻ thư viện tích hợp mã QR
```

---

## 📝 Giấy Phép & Bản Quyền
Bản quyền thuộc về **Hệ thống Thư viện Số Microservices**. Phát triển và phân phối bởi đội ngũ công nghệ vì sự nghiệp giáo dục và phát triển tri thức số.
