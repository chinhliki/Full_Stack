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

## 🌐 4. Danh sách API Endpoints chi tiết cho Frontend

| STT | Method | Frontend URL Path | Role | Header | Chức năng (Description) |
|---|---|---|---|---|---|
| 1 | `POST` | `/api/identity/auth/login` | Guest | Không | Đăng nhập hệ thống |
| 2 | `POST` | `/api/identity/auth/register` | Guest | Không | Đăng ký độc giả mới |
| 3 | `GET` | `/api/identity/auth/me` | Đăng nhập | Bearer token | Lấy thông tin user hiện tại |
| 4 | `GET` | `/api/identity/reports/dashboard` | Admin, Librarian | Bearer token | Số liệu thống kê tổng quan dashboard |
| 5 | `GET` | `/api/identity/report/borrowReturn` | Admin, Librarian | Bearer token | Biểu đồ lượt mượn/trả theo từng tháng |
| 6 | `GET` | `/api/identity/report/categoryStats` | Admin, Librarian | Bearer token | Biểu đồ tỉ lệ mượn theo thể loại |
| 7 | `GET` | `/api/identity/report/fineRevenue` | Admin, Librarian | Bearer token | Biểu đồ doanh thu phí phạt trễ hạn |
| 8 | `GET` | `/api/identity/notifications` | Đăng nhập | Bearer token | Lấy toàn bộ thông báo của user |
| 9 | `PATCH` | `/api/identity/notifications/{id}/read` | Đăng nhập | Bearer token | Đánh dấu một thông báo đã đọc |
| 10 | `PATCH` | `/api/identity/notifications/read-all` | Đăng nhập | Bearer token | Đánh dấu tất cả thông báo đã đọc |
| 11 | `GET` | `/api/identity/card/{cardNumber}` | Admin, Librarian | Bearer token | Tra cứu thẻ độc giả (Phục vụ quét mã QR) |

---

## 📦 5. Đặc tả dữ liệu truyền nhận (JSON DTOs)

### A. Đăng nhập & Đăng ký
* **Đăng nhập (`POST /api/identity/auth/login`)**:
  ```json
  {
    "email": "admin@library.com",
    "password": ""
  }
  ```
  * **Response:**
    ```json
    {
      "token": "jwt-token-string",
      "fullName": "Admin",
      "role": "Admin"
    }
    ```
* **Đăng ký độc giả (`POST /api/identity/auth/register`)**:
  ```json
  {
    "email": "reader@gmail.com",
    "password": "Mật khẩu tối thiểu 6 ký tự",
    "fullName": "Nguyễn Văn A",
    "studentCode": "SV001",
    "phone": "0123456789",
    "address": "Hà Nội"
  }
  ```

### B. Báo cáo & Dashboard
* **Tổng quan Dashboard (`GET /api/identity/reports/dashboard`)**:
  ```json
  {
    "totalReaders": 10,
    "totalBorrowed": 30,
    "totalReturned": 20,
    "currentlyBorrowing": 10,
    "totalFineAmount": 50000,
    "topBooks": [
      {
        "bookId": "00000000-0000-0000-0000-000000000000",
        "bookTitle": "Lập trình Microservices",
        "borrowCount": 5
      }
    ]
  }
  ```

### C. Quản lý thông báo & Tra cứu QR thẻ
* **Thông báo (`GET /api/identity/notifications`)**:
  ```json
  [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "type": "BorrowCreated",
      "message": "Bạn đã đăng ký mượn sách thành công.",
      "createdAt": "2026-06-27T10:00:00Z",
      "isRead": false
    }
  ]
  ```
* **Tra cứu thẻ (`GET /api/identity/card/{cardNumber}`)**:
  ```json
  {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "fullName": "Nguyễn Văn A",
    "email": "reader@library.com",
    "cardNumber": "LIB-20260616-0001",
    "cardStatus": "Active",
    "expiredDate": "2027-06-16T00:00:00Z",
    "canBorrow": true,
    "reason": "Thẻ hợp lệ"
  }
  ```

---

## 🔔 6. Tích hợp Thời gian thực & Gợi ý Cài đặt cho Frontend

### A. Hub kết nối SignalR:
* **Hub URL:** `http://26.114.35.12:5000/api/identity/notificationHub`
* **Xác thực:** Truyền Token qua tham số query `access_token`
* **Lắng nghe sự kiện:** Lắng nghe phương thức `ReceiveNotification` để hiển thị popup thông báo thời gian thực lên giao diện.

### B. Gợi ý cấu hình HttpClient (Axios):
```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Gateway port 5000
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```
