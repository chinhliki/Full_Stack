# 🔐 Tài liệu Cấu trúc & Hướng dẫn API Identity & Report Service (Nhóm 3)

**Identity & Report Service** là phân hệ chịu trách nhiệm xác thực người dùng, phân quyền, quản lý hồ sơ độc giả, phát hành thẻ thư viện, gửi thông báo theo thời gian thực và tổng hợp dữ liệu thống kê báo cáo cho toàn bộ hệ thống thư viện **LibraryMicroservices**.

---

## 📁 1. Cấu trúc Thư mục và Các File trong Dự án

Dưới đây là sơ đồ cấu trúc thư mục của dự án [IdentityReportService](file:///d:/full-stack/CNTT17-12/LibraryMicroservices/IdentityReportService):

```text
IdentityReportService/
│
├── Program.cs                         # Khởi tạo DI, cài đặt Authentication/Authorization, định tuyến Routing
├── appsettings.json                   # Cấu hình chuỗi kết nối Database, JWT Token, API Gateway, Port các dịch vụ
├── IdentityReportService.csproj       # Khai báo các thư viện phụ thuộc (.NET Core)
│
├── Data/                              # Tầng kết nối Database (Database Layer)
│   ├── IdentityDbContext.cs           # DbContext quản lý ánh xạ thực thể Identity, Card, Notification, Report
│   └── DataSeeder.cs                  # Tạo dữ liệu mẫu ban đầu (Admin, Librarian, Reader mẫu)
│
├── Models/                            # Thực thể Cơ sở dữ liệu (Database Entities)
│   ├── ApplicationUser.cs             # Thực thể User (kế thừa IdentityUser)
│   ├── LibraryCard.cs                 # Thực thể thẻ thư viện
│   ├── Notification.cs                # Thực thể lưu vết thông báo người dùng
│   └── ReaderProfile.cs               # Thông tin chi tiết độc giả (SĐT, Địa chỉ, Mã SV)
│
├── DTOs/                              # Đối tượng chuyển dữ liệu (Data Transfer Objects)
│   ├── Auth/                          # DTO phục vụ Đăng nhập, Đăng ký, Profile
│   │   ├── LoginRequest.cs
│   │   ├── LoginResponse.cs
│   │   ├── RegisterRequest.cs
│   │   └── UserProfileResponse.cs
│   ├── Reports/                       # DTO phục vụ biểu đồ, thống kê báo cáo
│   │   ├── DashboardStatsResponse.cs
│   │   ├── MonthlyBorrowReturnStats.cs
│   │   ├── CategoryBorrowStats.cs
│   │   └── FineRevenueStats.cs
│   └── Notifications/                 # DTO phục vụ gửi nhận thông báo
│       └── NotificationResponse.cs
│
├── Services/                          # Tầng xử lý Logic và Hub liên lạc
│   ├── TokenService.cs                # Tạo và kiểm tra tính hợp lệ của JWT Token
│   └── NotificationHub.cs             # SignalR Hub đẩy thông báo thời gian thực (Real-time)
│
└── Controllers/                       # Tầng xử lý API Endpoints (Presentation Layer)
    ├── AuthController.cs              # API Login, Register, Profile, Độc giả
    ├── LibraryCardController.cs       # API Tạo thẻ, Khóa/Mở thẻ, Gia hạn thẻ, Tra cứu QR Code
    ├── ReportController.cs            # API thống kê số liệu Dashboard, Biểu đồ doanh thu/mượn trả
    └── NotificationController.cs      # API quản lý và đọc thông báo
```

---

## 🌐 2. Cấu hình & Định tuyến qua API Gateway

Toàn bộ các yêu cầu từ Frontend đều được gọi tập trung qua **API Gateway** để đảm bảo bảo mật và tránh lỗi CORS chéo miền:

```env
VITE_API_BASE_URL=http://26.114.35.12:5000
```

### Quy tắc ánh xạ định tuyến Gateway:
* Dịch vụ chạy thực tế tại: `http://26.114.35.12:5003`
* API Gateway định tuyến qua cổng `5000` với tiền tố `/api/identity/...`
  * **Thực tế trên Backend:** `POST /api/auth/login`
  * **Frontend gọi qua Gateway:** `POST /api/identity/auth/login`

---

## 🔑 3. Authentication & Authorization (Xác thực và Phân quyền)

Các API yêu cầu đăng nhập phải gửi Token JWT thông qua Header:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Các vai trò phân quyền (Roles):
1. **Admin**: Có toàn quyền hệ thống, xem dashboard, báo cáo tài chính, quản lý độc giả, cấu hình hệ thống.
2. **Librarian (Thủ thư)**: Phê duyệt phiếu mượn, nhận sách trả, nạp phạt, tra cứu QR thẻ độc giả.
3. **Reader (Độc giả)**: Đăng ký mượn sách, tra cứu tài khoản cá nhân, xem thẻ thư viện số, xem thông báo của mình.

---

## 📊 4. API Endpoints Chi tiết cho Frontend

### A. Nhóm Đăng nhập & Đăng ký (Auth API)

* **Đăng nhập (`POST /api/identity/auth/login`)**:
  * **Body:** `{"email": "admin@library.com", "password": "123456"}`
  * **Response:** `{"token": "jwt...", "fullName": "Admin", "role": "Admin"}`
* **Đăng ký độc giả (`POST /api/identity/auth/register`)**:
  * **Body:** `{"email": "reader@gmail.com", "password": "...", "fullName": "Nguyễn Văn A", "studentCode": "SV001", "phone": "01234", "address": "HN"}`
* **Lấy thông tin tài khoản hiện tại (`GET /api/identity/auth/me`)**:
  * Đọc thông tin chi tiết của Token đang đăng nhập.

### B. Nhóm Báo cáo thống kê (Report API)
*(Yêu cầu quyền: Admin hoặc Librarian)*

* **Tổng hợp số liệu Dashboard (`GET /api/identity/reports/dashboard`)**:
  * Trả về tổng số độc giả, tổng số lượt mượn/trả, tiền phạt chưa nộp và Top sách được mượn nhiều nhất.
* **Biểu đồ mượn/trả hàng tháng (`GET /api/identity/report/borrowReturn?year=2026`)**:
  * Thống kê số lượng mượn/trả theo từng tháng.
* **Biểu đồ thể loại sách phổ biến (`GET /api/identity/report/categoryStats?year=2026`)**:
  * Thống kê tỷ lệ phần trăm sách mượn theo thể loại.
* **Doanh thu phí phạt (`GET /api/identity/report/fineRevenue?year=2026`)**:
  * Số tiền phạt trễ hạn thu được theo từng tháng phục vụ kế toán.

### C. Nhóm Quản lý thông báo (Notification API)

* **Lấy danh sách thông báo (`GET /api/identity/notifications?isRead=false`)**
* **Đọc thông báo (`PATCH /api/identity/notifications/{id}/read`)**
* **Đọc toàn bộ thông báo (`PATCH /api/identity/notifications/read-all`)**

### D. Nhóm Tra cứu & Quản lý thẻ thư viện (Card API)

* **Tra cứu thẻ độc giả bằng mã thẻ (`GET /api/identity/card/{cardNumber}`)**
  * Hỗ trợ quét mã QR để lấy hồ sơ độc giả, trạng thái thẻ (`cardStatus`), thời hạn (`expiredDate`) và cờ `canBorrow` để quyết định cho mượn sách.

---

## 🔔 5. Hướng dẫn Tích hợp Thông báo thời gian thực (SignalR Hub)

Hiện tại, ở phiên bản trước nhóm Identity sử dụng cơ chế Polling HTTP Get mỗi 30-60 giây để cập nhật thông báo. Ở phiên bản nâng cấp, Frontend có thể tùy chọn tích hợp kết nối tới **SignalR Hub**:

* **Hub Endpoint:** `http://26.114.35.12:5000/api/identity/notificationHub`
* **Cơ chế kết nối:** Truyền token JWT qua tham số query `access_token` khi khởi tạo kết nối.
* **Sự kiện lắng nghe (Server-to-Client):** `ReceiveNotification` trả về Payload chứa thông tin thông báo mới nhất.
