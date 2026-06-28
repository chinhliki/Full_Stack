# README Frontend — IdentityReportService

Tài liệu ngắn này dành cho frontend để hiểu phần backend Identity của nhóm.

---

## 1. Service của nhóm Identity

Nhóm Identity phụ trách:

- Đăng nhập, đăng ký, lấy thông tin tài khoản
- Quản lý độc giả và thẻ thư viện
- Dashboard report/chart
- Notifications
- Tra cứu thẻ thư viện bằng `cardNumber`

Thông tin service:

```text
API Gateway:           http://26.114.35.12:5000
IdentityReportService: http://26.114.35.12:5003
```

Frontend nên gọi qua Gateway:

```text
VITE_API_BASE_URL=http://26.114.35.12:5000
```

Không nên gọi trực tiếp `:5003` trong frontend.

---

## 2. Quy tắc gọi API qua Gateway

Các API của Identity khi gọi qua Gateway đều có prefix:

```text
/api/identity
```

Ví dụ:

```text
Backend thật: /api/auth/login
Frontend gọi: /api/identity/auth/login
```

```text
Backend thật: /api/report/borrowReturn
Frontend gọi: /api/identity/report/borrowReturn
```

---

## 3. Authentication

Sau khi login thành công, frontend lưu token JWT.

Các request cần đăng nhập phải gửi header:

```http
Authorization: Bearer <token>
```

Các role đang dùng:

```text
Admin
Librarian
Reader
```

Admin và Librarian được xem dashboard/report, quản lý độc giả, tra cứu thẻ.  
Reader chỉ xem dữ liệu cá nhân như thông báo, thẻ thư viện, lịch sử mượn của mình.

---

## 4. API Auth

### Đăng nhập

```http
POST /api/identity/auth/login
```

Body:

```json
{
  "email": "admin@library.com",
  "password": "123456"
}
```

Response thường có:

```json
{
  "token": "...",
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

---

### Lấy thông tin user hiện tại

```http
GET /api/identity/auth/me
```

Header:

```http
Authorization: Bearer <token>
```

---

## 5. API Dashboard / Report

Các API này dành cho Admin/Librarian.

### Tổng quan dashboard

```http
GET /api/identity/reports/dashboard
```

Response:

```json
{
  "totalReaders": 10,
  "totalBorrowed": 30,
  "totalReturned": 20,
  "currentlyBorrowing": 10,
  "totalFineAmount": 50000,
  "topBooks": []
}
```

---

### Biểu đồ mượn/trả theo tháng

```http
GET /api/identity/report/borrowReturn
```

Có thể truyền năm:

```http
GET /api/identity/report/borrowReturn?year=2026
```

Response:

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

---

### Thống kê thể loại sách được mượn

```http
GET /api/identity/report/categoryStats
```

Response:

```json
[
  {
    "category": "Công nghệ",
    "borrowCount": 15,
    "percent": 42.86
  }
]
```

Nếu backend chưa nhận được thể loại từ nhóm Catalog/Circulation, category có thể là:

```text
Chưa phân loại
```

---

### Doanh thu tiền phạt theo tháng

```http
GET /api/identity/report/fineRevenue
```

Response:

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

## 6. API Notifications

Các API này cần token.

### Lấy thông báo của user hiện tại

```http
GET /api/identity/notifications
```

Lọc chưa đọc:

```http
GET /api/identity/notifications?isRead=false
```

Response:

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

Các type thường gặp:

```text
BorrowCreated
BookReturned
FineCreated
System
```

---

### Đánh dấu một thông báo là đã đọc

```http
PATCH /api/identity/notifications/{id}/read
```

---

### Đánh dấu tất cả là đã đọc

```http
PATCH /api/identity/notifications/read-all
```

---

## 7. API tra cứu thẻ thư viện

Dùng cho QR Self-Service hoặc màn hình thủ thư quét thẻ.

```http
GET /api/identity/card/{cardNumber}
```

Ví dụ:

```http
GET /api/identity/card/LIB-20260616-0001
```

Response:

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

Frontend nên dựa vào:

```text
canBorrow
reason
```

Nếu `canBorrow = false`, hiển thị `reason` cho người dùng.

---

## 8. Cấu trúc frontend API gợi ý

Nên tách file API như sau:

```text
src/api/axios.js
src/api/authApi.js
src/api/reportApi.js
src/api/notificationApi.js
src/api/cardApi.js
```

Ví dụ `axios.js`:

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

Ví dụ `reportApi.js`:

```js
import api from './axios'

export const reportApi = {
  dashboard: () => api.get('/api/identity/reports/dashboard'),
  borrowReturn: (year) => api.get('/api/identity/report/borrowReturn', { params: { year } }),
  categoryStats: (year) => api.get('/api/identity/report/categoryStats', { params: { year } }),
  fineRevenue: (year) => api.get('/api/identity/report/fineRevenue', { params: { year } })
}
```

Ví dụ `notificationApi.js`:

```js
import api from './axios'

export const notificationApi = {
  getAll: (isRead) => api.get('/api/identity/notifications', { params: { isRead } }),
  markAsRead: (id) => api.patch(`/api/identity/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/api/identity/notifications/read-all')
}
```

Ví dụ `cardApi.js`:

```js
import api from './axios'

export const cardApi = {
  lookup: (cardNumber) => api.get(`/api/identity/card/${cardNumber}`)
}
```

---

## 9. Lỗi thường gặp khi frontend gọi API

### 401 Unauthorized

Nguyên nhân:

```text
- Chưa đăng nhập
- Thiếu Authorization Bearer token
- Token hết hạn
```

Cách xử lý:

```text
- Kiểm tra localStorage có token không
- Kiểm tra axios interceptor đã gắn token chưa
- Đăng nhập lại
```

---

### 403 Forbidden

Nguyên nhân:

```text
- Đăng nhập rồi nhưng role không đủ quyền
```

Ví dụ Reader gọi dashboard admin sẽ bị 403.

---

### 502 Bad Gateway

Nguyên nhân:

```text
- API Gateway chạy nhưng service đích chưa chạy
- IdentityReportService chưa chạy port 5003
- Gateway cấu hình sai IP/port
```

Cần kiểm tra:

```text
http://26.114.35.12:5003/swagger
http://26.114.35.12:5000
```

---

## 10. Tóm tắt API frontend cần nhớ

```http
POST  /api/identity/auth/login
GET   /api/identity/auth/me

GET   /api/identity/reports/dashboard
GET   /api/identity/report/borrowReturn
GET   /api/identity/report/categoryStats
GET   /api/identity/report/fineRevenue

GET   /api/identity/notifications
PATCH /api/identity/notifications/{id}/read
PATCH /api/identity/notifications/read-all

GET   /api/identity/card/{cardNumber}
```

---

## 11. Ghi chú tích hợp

- Frontend chỉ gọi Gateway port `5000`.
- API Identity qua Gateway luôn có prefix `/api/identity`.
- API dashboard cần role `Admin` hoặc `Librarian`.
- API notifications lấy theo user đang đăng nhập.
- API card lookup trả `canBorrow` và `reason`, frontend nên hiển thị rõ cho thủ thư/người dùng.
