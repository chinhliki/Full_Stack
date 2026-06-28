# Catalog Service - Hệ thống quản lý thư viện số

Catalog Service (Nhóm 1) chịu trách nhiệm quản lý danh mục sách, kho hàng và cung cấp thông tin metadata cho toàn bộ hệ thống thư viện theo kiến trúc Microservices.

## 📁 Cấu trúc thư mục

```
CatalogService/
├── Controllers/            # Chứa các API Endpoints
│   ├── BooksController.cs         # API công khai: CRUD, Tìm kiếm, Import Excel
│   └── InternalBooksController.cs  # API nội bộ: Kiểm tra kho, Tăng/Giảm tồn kho
├── Data/                   # Cấu hình Database
│   ├── CatalogDbContext.cs        # Entity Framework Context
│   └── DataSeeder.cs              # Dữ liệu mẫu ban đầu
├── DTOs/                   # Data Transfer Objects (Đối tượng truyền tải dữ liệu)
│   ├── BookDto.cs                 # Kết quả trả về cho client
│   ├── CreateBookDto.cs           # Dữ liệu tạo sách mới
│   ├── BookImportDto.cs           # Cấu trúc file Excel để Import
│   └── ...
├── Models/                 # Định nghĩa các thực thể (Entities)
│   └── Book.cs                    # Thông tin chi tiết một cuốn sách
├── Services/               # Các dịch vụ bổ trợ
│   ├── IEventBus.cs               # Giao diện phát sự kiện
│   └── ConsoleEventBus.cs         # Implementation log sự kiện ra Console
├── Properties/             # Cấu hình môi trường chạy (launchSettings.json)
├── Dockerfile              # Cấu hình đóng gói Container
├── appsettings.json        # Cấu hình hệ thống (DB, JWT, Secret Keys)
└── Program.cs              # Điểm khởi đầu của ứng dụng, đăng ký Services
```

## ⚙️ Cơ chế hoạt động chính

### 1. Quản lý kho hàng (Inventory)
*   Duy trì số lượng sách sẵn có (`AvailableCopies`) và tổng số lượng (`TotalCopies`).
*   Cung cấp API nội bộ cho **Circulation Service (Nhóm 2)** để trừ kho khi mượn sách và hoàn kho khi trả sách.
*   Mọi thay đổi về kho đều phát đi sự kiện `book.availability.changed` qua Event Bus.

### 2. Bảo mật & Giao tiếp
*   **Public API**: Sử dụng **JWT Authentication** (phối hợp với Identity Service - Nhóm 3). Các thao tác thêm/xóa/sửa yêu cầu role `Admin`.
*   **Internal API**: Sử dụng **Header Security** (`X-Internal-Service-Key`). Điều này cho phép các service gọi nhau trực tiếp mà không cần qua luồng đăng nhập của người dùng.

### 3. Nhập dữ liệu hàng loạt (Bulk Import)
*   Tích hợp thư viện **MiniExcel** để đọc file `.xlsx`.
*   Tự động ánh xạ các cột trong Excel vào Database, giúp thủ thư thêm hàng nghìn cuốn sách chỉ trong vài giây.

### 4. Hỗ trợ Báo cáo & Thống kê
*   Cung cấp API ánh xạ thể loại (`category-map`) để **Report Service (Nhóm 3)** có thể tổng hợp số liệu mượn trả theo từng chuyên mục sách.

## 🚀 Hướng dẫn khởi chạy

1.  **Cấu hình Database**: Đảm bảo chuỗi kết nối trong `appsettings.json` trỏ đúng về SQL Server của bạn.
2.  **Khởi chạy**: 
    ```bash
    dotnet run
    ```
3.  **Truy cập Swagger**: Mở trình duyệt tại `http://localhost:5234/swagger` để xem tài liệu API và test trực tiếp.

## 🐳 Docker Deployment
Service đã sẵn sàng để chạy trong môi trường Container:
```bash
docker build -t catalog-service .
docker run -p 5234:5234 catalog-service
```
