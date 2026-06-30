# README API Frontend — Identity & Report Service

Tài liệu này dành cho đội Frontend để kết nối đúng API của nhóm **Identity & Report Service**.

## 1. Thông tin service

Frontend **chỉ gọi qua API Gateway**, không gọi trực tiếp `IdentityReportService`.

```env
VITE_API_BASE_URL=http://26.114.35.12:5000
```

| Thành phần | URL |
|---|---|
| API Gateway | `http://26.114.35.12:5000` |
| IdentityReportService | `http://26.114.35.12:5003` |
| Swagger Identity | `http://26.114.35.12:5003/swagger` |

Quy tắc route:

```text
Backend thật: /api/auth/login
Frontend gọi: /api/identity/auth/login
```

```text
Backend thật: /api/report/borrowReturn
Frontend gọi: /api/identity/report/borrowReturn
```

---

## 2. Header xác thực

Các API cần đăng nhập phải gửi JWT:

```http
Authorization: Bearer <token>
```

Các role đang dùng:

```text
Admin
Librarian
Reader
```

| Role | Quyền chính |
|---|---|
| Admin | Xem dashboard, quản lý độc giả, tra cứu thẻ, xem thông báo |
| Librarian | Xem dashboard, quản lý độc giả, tra cứu thẻ, xem thông báo |
| Reader | Xem thông báo và dữ liệu cá nhân |

---

## 3. Danh sách endpoint Frontend cần dùng

| STT | Method | Frontend URL | Role | Header | Chức năng |
|---|---|---|---|---|---|
| 1 | `POST` | `/api/identity/auth/login` | Guest | Không | Đăng nhập |
| 2 | `POST` | `/api/identity/auth/register` | Guest | Không | Đăng ký độc giả |
| 3 | `GET` | `/api/identity/auth/me` | Đăng nhập | Bearer token | Lấy thông tin user hiện tại |
| 4 | `GET` | `/api/identity/reports/dashboard` | Admin, Librarian | Bearer token | Số liệu tổng quan dashboard |
| 5 | `GET` | `/api/identity/report/borrowReturn` | Admin, Librarian | Bearer token | Biểu đồ mượn/trả theo tháng |
| 6 | `GET` | `/api/identity/report/categoryStats` | Admin, Librarian | Bearer token | Biểu đồ tỉ lệ mượn theo thể loại |
| 7 | `GET` | `/api/identity/report/fineRevenue` | Admin, Librarian | Bearer token | Biểu đồ doanh thu phí phạt |
| 8 | `GET` | `/api/identity/notifications` | Đăng nhập | Bearer token | Lấy thông báo của user hiện tại |
| 9 | `PATCH` | `/api/identity/notifications/{id}/read` | Đăng nhập | Bearer token | Đánh dấu một thông báo đã đọc |
| 10 | `PATCH` | `/api/identity/notifications/read-all` | Đăng nhập | Bearer token | Đánh dấu tất cả thông báo đã đọc |
| 11 | `GET` | `/api/identity/card/{cardNumber}` | Admin, Librarian hoặc internal service | Bearer token hoặc internal key | Tra cứu thẻ thư viện |

> Lưu ý: Các API quản lý độc giả như khóa tài khoản/gia hạn thẻ cần kiểm tra theo route thực tế trong backend hiện tại trước khi Frontend dùng. Tài liệu này ưu tiên các API nhóm đã nâng cấp đến Phần 3.

---

## 4. Auth API

### 4.1. Đăng nhập

```http
POST /api/identity/auth/login
```

Request body:

```json
{
  "email": "admin@library.com",
  "password": "123456"
}
```

Response mẫu:

```json
{
  "token": "jwt-token",
  "fullName": "Admin",
  "role": "Admin"
}
```

Frontend cần lưu:

```text
token
fullName
role
```

### 4.2. Đăng ký độc giả

```http
POST /api/identity/auth/register
```

Request body:

```json
{
  "email": "reader@gmail.com",
  "password": "123456",
  "fullName": "Nguyễn Văn A",
  "studentCode": "SV001",
  "phone": "0123456789",
  "address": "Hà Nội"
}
```

| Field | Bắt buộc | Ghi chú |
|---|---|---|
| `email` | Có | Email đăng ký |
| `password` | Có | Tối thiểu 6 ký tự |
| `fullName` | Có | Họ tên độc giả |
| `studentCode` | Nên có | Mã sinh viên |
| `phone` | Không | Số điện thoại |
| `address` | Không | Địa chỉ |

### 4.3. Lấy thông tin user hiện tại

```http
GET /api/identity/auth/me
```

Header:

```http
Authorization: Bearer <token>
```

---

## 5. Report / Dashboard API

Các API report yêu cầu role:

```text
Admin hoặc Librarian
```

### 5.1. Dashboard tổng quan

```http
GET /api/identity/reports/dashboard
```

Response mẫu:

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
      "bookTitle": "Lập trình Microservices với .NET",
      "borrowCount": 5
    }
  ]
}
```

### 5.2. Biểu đồ mượn/trả theo tháng

```http
GET /api/identity/report/borrowReturn
GET /api/identity/report/borrowReturn?year=2026
```

Response mẫu:

```json
[
  {
    "month": "2026-01",
    "monthName": "Tháng 1",
    "borrowCount": 12,
    "returnCount": 8
  }
]
```

### 5.3. Biểu đồ tỉ lệ mượn theo thể loại

```http
GET /api/identity/report/categoryStats
GET /api/identity/report/categoryStats?year=2026
```

Response mẫu:

```json
[
  {
    "category": "Công nghệ",
    "borrowCount": 15,
    "percent": 42.86
  }
]
```

Nếu nhóm Catalog/Circulation chưa gửi category, backend sẽ trả:

```text
Chưa phân loại
```

### 5.4. Biểu đồ doanh thu tiền phạt

```http
GET /api/identity/report/fineRevenue
GET /api/identity/report/fineRevenue?year=2026
```

Response mẫu:

```json
[
  {
    "month": "2026-01",
    "monthName": "Tháng 1",
    "totalFine": 50000
  }
]
```

---

## 6. Notifications API

Các API thông báo lấy theo user đang đăng nhập.

### 6.1. Lấy danh sách thông báo

```http
GET /api/identity/notifications
GET /api/identity/notifications?isRead=false
GET /api/identity/notifications?isRead=true
```

Response mẫu:

```json
[
  {
    "id": "00000000-0000-0000-0000-000000000000",
    "type": "BorrowCreated",
    "message": "Bạn đã mượn sách thành công.",
    "createdAt": "2026-06-27T10:00:00Z",
    "isRead": false
  }
]
```

Các type hiện dùng:

| Type | Ý nghĩa |
|---|---|
| `BorrowCreated` | Tạo phiếu mượn thành công |
| `BookReturned` | Trả sách thành công |
| `FineCreated` | Có phát sinh tiền phạt |
| `System` | Thông báo hệ thống |

### 6.2. Đánh dấu một thông báo đã đọc

```http
PATCH /api/identity/notifications/{id}/read
```

Response mẫu:

```json
{
  "message": "Đã đánh dấu thông báo là đã đọc",
  "id": "00000000-0000-0000-0000-000000000000"
}
```

### 6.3. Đánh dấu tất cả thông báo đã đọc

```http
PATCH /api/identity/notifications/read-all
```

Response mẫu:

```json
{
  "message": "Đã đánh dấu tất cả thông báo là đã đọc",
  "count": 5
}
```

---

## 7. Card Lookup API

Dùng cho QR Self-Service hoặc màn hình thủ thư quét thẻ.

```http
GET /api/identity/card/{cardNumber}
```

Ví dụ:

```http
GET /api/identity/card/LIB-20260616-0001
```

Response mẫu:

```json
{
  "userId": "00000000-0000-0000-0000-000000000000",
  "readerProfileId": "00000000-0000-0000-0000-000000000000",
  "fullName": "Nguyễn Văn A",
  "email": "reader@library.com",
  "studentCode": "SV001",
  "phone": "0123456789",
  "address": "Hà Nội",
  "cardNumber": "LIB-20260616-0001",
  "cardStatus": "Active",
  "expiredDate": "2027-06-16T00:00:00Z",
  "canBorrow": true,
  "reason": "Thẻ hợp lệ"
}
```

Frontend cần xử lý theo:

```text
canBorrow
reason
```

Nếu `canBorrow = false`, hiển thị `reason`.

---

## 8. SignalR / Real-time Notification

Hiện tại nhóm Identity **chưa triển khai SignalR Hub**.

Frontend chưa cần cài:

```text
@microsoft/signalr
```

Cách xử lý hiện tại:

```text
Frontend gọi REST API GET /api/identity/notifications để lấy thông báo.
Có thể polling mỗi 30-60 giây nếu cần cập nhật gần realtime.
```

Khi SignalR được triển khai sau, backend sẽ bổ sung:

```text
Hub URL
Tên event server-to-client
Cách truyền access_token
Payload realtime
```

---

## 9. Gợi ý file API frontend

### 9.1. `src/api/axios.js`

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

### 9.2. `src/api/reportApi.js`

```js
import api from './axios'

export const reportApi = {
  dashboard: () => api.get('/api/identity/reports/dashboard'),
  borrowReturn: (year) =>
    api.get('/api/identity/report/borrowReturn', { params: { year } }),
  categoryStats: (year) =>
    api.get('/api/identity/report/categoryStats', { params: { year } }),
  fineRevenue: (year) =>
    api.get('/api/identity/report/fineRevenue', { params: { year } })
}
```

### 9.3. `src/api/notificationApi.js`

```js
import api from './axios'

export const notificationApi = {
  getAll: (isRead) =>
    api.get('/api/identity/notifications', { params: { isRead } }),

  markAsRead: (id) =>
    api.patch(`/api/identity/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch('/api/identity/notifications/read-all')
}
```

### 9.4. `src/api/cardApi.js`

```js
import api from './axios'

export const cardApi = {
  lookup: (cardNumber) =>
    api.get(`/api/identity/card/${cardNumber}`)
}
```

---

## 10. Lỗi thường gặp

### 401 Unauthorized

Nguyên nhân:

```text
Chưa đăng nhập, thiếu Bearer token hoặc token hết hạn.
```

Cách xử lý:

```text
Kiểm tra localStorage có token chưa.
Kiểm tra axios interceptor đã gắn token chưa.
Đăng nhập lại.
```

### 403 Forbidden

Nguyên nhân:

```text
Có token nhưng role không đủ quyền.
```

Ví dụ:

```text
Reader gọi API dashboard sẽ bị 403.
```

### 502 Bad Gateway

Nguyên nhân:

```text
API Gateway đang chạy nhưng IdentityReportService chưa chạy.
Gateway trỏ sai IP/port.
IdentityReportService lỗi runtime.
```

Kiểm tra:

```text
http://26.114.35.12:5003/swagger
http://26.114.35.12:5000
```

---

## 11. Checklist cho Frontend

```text
[ ] .env dùng VITE_API_BASE_URL=http://26.114.35.12:5000
[ ] Tất cả API Identity đều gọi prefix /api/identity
[ ] Login lưu token/fullName/role
[ ] Axios interceptor tự gắn Authorization Bearer token
[ ] Dashboard chỉ hiển thị cho Admin/Librarian
[ ] Notifications gọi theo user đang đăng nhập
[ ] Card lookup xử lý canBorrow và reason
[ ] Chưa dùng SignalR ở phiên bản hiện tại
```
