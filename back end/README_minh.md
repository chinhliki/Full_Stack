# Catalog Service - Hệ thống quản lý thư viện số

Catalog Service (Nhóm 1) chịu trách nhiệm quản lý danh mục sách, kho hàng và cung cấp thông tin metadata cho toàn bộ hệ thống thư viện theo kiến trúc Microservices.

---

## 📁 Cấu trúc thư mục

```
CatalogService/
├── Controllers/
│   ├── BooksController.cs           # Public API: CRUD, Tìm kiếm, Import Excel, Category Map
│   └── InternalBooksController.cs   # Internal API (server-to-server): Kiểm tra/Tăng/Giảm kho
├── Data/
│   ├── CatalogDbContext.cs          # Entity Framework Core DbContext
│   └── DataSeeder.cs               # Dữ liệu mẫu khởi tạo ban đầu
├── DTOs/
│   ├── BookDto.cs                  # Response: Thông tin sách trả về client
│   ├── CreateBookDto.cs            # Request: Tạo sách mới (có Validation)
│   ├── UpdateBookDto.cs            # Request: Cập nhật sách (có Validation)
│   ├── BookImportDto.cs            # Import Excel: Ánh xạ cột tiếng Việt
│   └── InternalBookAvailabilityDto.cs # Internal: Thông tin tình trạng kho
├── Migrations/                     # EF Core Migrations (tự động tạo)
├── Models/
│   └── Book.cs                    # Entity: Định nghĩa bảng Books trong DB
├── Services/
│   ├── IEventBus.cs               # Interface phát sự kiện
│   └── ConsoleEventBus.cs         # Implementation: Log sự kiện ra Console
├── Dockerfile                     # Cấu hình Docker
├── appsettings.json               # Cấu hình (DB, JWT, Internal Key)
└── Program.cs                     # Entry point, đăng ký DI, middleware
```

---

## 🌐 Danh sách API

### Public API (`/api/catalog/books`)

| Method | Endpoint | Phân quyền | Mô tả |
|--------|----------|------------|-------|
| `GET` | `/api/catalog/books` | Tất cả | Lấy danh sách sách (phân trang, tìm kiếm, lọc, sắp xếp) |
| `GET` | `/api/catalog/books/{id}` | Tất cả | Lấy chi tiết một cuốn sách |
| `GET` | `/api/catalog/books/category-map` | Tất cả | Lấy danh sách thể loại sách |
| `POST` | `/api/catalog/books` | Admin, Librarian | Thêm sách mới |
| `PUT` | `/api/catalog/books/{id}` | Admin, Librarian | Cập nhật thông tin sách |
| `DELETE` | `/api/catalog/books/{id}` | Admin | Xóa mềm sách |
| `POST` | `/api/catalog/books/import` | Admin, Librarian | Nhập hàng loạt từ Excel |

### Internal API (`/api/internal/books`)
> Yêu cầu header: `X-Internal-Service-Key: LibraryInternalServiceKey2026`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/internal/books/{id}/availability` | Kiểm tra số lượng tồn kho |
| `PUT` | `/api/internal/books/{id}/decrease` | Giảm kho (khi cho mượn) |
| `PUT` | `/api/internal/books/{id}/increase` | Tăng kho (khi trả sách) |
| `GET` | `/api/internal/books/category-map` | Lấy Map {BookId -> Category} để báo cáo |

---

## 🔍 Query Parameters (`GET /api/catalog/books`)

| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| `page` | int | `1` | Trang hiện tại |
| `pageSize` | int | `10` | Số dòng mỗi trang |
| `keyword` | string | — | Tìm theo tên sách, tác giả, ISBN |
| `category` | string | — | Lọc theo thể loại |
| `sortBy` | string | — | `title`, `publishedyear`, `createddate` |
| `sortOrder` | string | `asc` | `asc` hoặc `desc` |

> **Pagination Headers:** Server trả về `X-Total-Count`, `X-Total-Pages`, `X-Current-Page` trong Response Headers.

---

## 📤 Cấu trúc cột file Excel Import

| Tên cột trong file | Bắt buộc | Ghi chú |
|--------------------|----------|---------|
| `ISBN` | ✅ | Ví dụ: `978-604-0-12345-6` |
| `Tên Sách` | ✅ | |
| `Tác Giả` | ✅ | |
| `Nhà Xuất Bản` | ❌ | |
| `Năm Xuất Bản` | ❌ | Số nguyên, ≤ năm hiện tại |
| `Thể Loại` | ✅ | |
| `Mô Tả` | ❌ | |
| `Ảnh Bìa` | ❌ | URL đường dẫn ảnh |
| `Tổng Số Bản` | ✅ | Phải ≥ 1 |
| `Vị Trí Kệ` | ❌ | Ví dụ: `Kệ A3, Tầng 2` |

---

## ⚙️ Cách hoạt động

1. **Quản lý kho**: Truy vấn kho bằng `AvailableCopies`. Internal API cập nhật kho khi sách được mượn/trả và tự động phát sự kiện `book.availability.changed`.
2. **Bảo mật**: Public API dùng **JWT Bearer Token**. Internal API dùng header `X-Internal-Service-Key`.
3. **Event Bus**: Mỗi thay đổi kho phát sự kiện (hiện log Console, dễ thay thế bằng RabbitMQ/Redis).

---

## 🚀 Khởi chạy

```bash
# Chạy thông thường
dotnet run

# Truy cập Swagger
http://localhost:5234/swagger
```

## 🐳 Docker

```bash
docker build -t catalog-service .
docker run -p 5234:5234 catalog-service
```
