# KIẾN TRÚC HỆ THỐNG & BẢO MẬT (SYSTEM ARCHITECTURE & SECURITY)
## CHUẨN KIẾN TRÚC 4 TẦNG & GIAO THỨC JWT / RBAC

> Tài liệu mô tả nguyên lý thiết kế Kiến trúc phân lớp (Layered Architecture) và cơ chế Xác thực & Phân quyền bảo mật của hệ thống.

---

## 1. MÔ HÌNH KIẾN TRÚC 4 TẦNG (4-TIER ARCHITECTURE)

Hệ thống được thiết kế phân chia trách nhiệm rõ ràng theo nguyên tắc **Separation of Concerns (SoC)** và quy tắc phụ thuộc một chiều từ trên xuống dưới:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      TẦNG 1: PRESENTATION LAYER (TẦNG TRÌNH DIỄN)                      │
│                                                                                        │
│  [Phía Client - React 19 SPA]      │  [Phía Server - NestJS Controllers]               │
│  • Components, Pages, Theme System │  • *.controller.ts                                │
│  • Axios Client & Interceptors     │  • Nhiệm vụ: Nhận HTTP Request, validate dữ liệu   │
│  • AuthContext State Management    │    đầu vào qua DTO, điều hướng đến Service.       │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ DTOs (Data Transfer Objects đã validate)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   TẦNG 2: BUSINESS LOGIC LAYER (TẦNG NGHIỆP VỤ / DỊCH VỤ)              │
│                                                                                        │
│  [Services - *.service.ts]                                                             │
│  • AuthService, UserService, AssetService, OrderService, ReviewService, ...            │
│  • Nhiệm vụ: Xử lý logic nghiệp vụ, tính toán số dư, mã hóa Bcrypt, ký phát JWT,      │
│    kiểm tra điều kiện tải file và điều phối Transaction.                               │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Dependency Injection (Repository Interface)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                TẦNG 3: DATA ACCESS LAYER / PERSISTENCE (TẦNG TRUY XUẤT DỮ LIỆU)        │
│                                                                                        │
│  [Providers & Repositories - *.provider.ts]                                            │
│  • user.provider.ts, asset.provider.ts, order.provider.ts, ...                         │
│  • Nhiệm vụ: Đóng gói truy vấn dữ liệu. Tiêm (Inject) `DATA_SOURCE` để lấy Repository  │
│    TypeORM tương ứng, tách biệt Service khỏi chi tiết kỹ thuật của CSDL.               │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Object-Relational Mapping (ORM)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               TẦNG 4: DATABASE & ENTITY LAYER (TẦNG THỰC THỂ & CƠ SỞ DỮ LIỆU)          │
│                                                                                        │
│  [Entities & Database Engine - *.entity.ts & MySQL Server]                             │
│  • Entities ánh xạ 1-1 với bảng CSDL.                                                  │
│  • Hệ quản trị CSDL MySQL 8.0 đảm bảo tính toàn vẹn và giao dịch ACID.                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CƠ CHẾ BẢO MẬT & PHÂN QUYỀN (AUTHENTICATION & AUTHORIZATION)

### 2.1. Xác thực bằng JSON Web Token (JWT)
- **Mã hóa mật khẩu:** Mật khẩu người dùng được băm 1 chiều bằng thuật toán `bcrypt` (10 salt rounds) trước khi lưu vào CSDL.
- **Ký phát sinh Token:** Khi đăng nhập thành công, Server sinh ra chuỗi `accessToken` mang thông tin định danh:
  ```json
  {
    "sub": 14,
    "username": "buyer_hung",
    "role": "customer",
    "iat": 1791791914,
    "exp": 1791878314
  }
  ```
- **Tự động đính kèm Token phía Client:** Axios Interceptor tự động đọc token từ `localStorage` và gắn vào Header:
  `Authorization: Bearer <accessToken>`.

### 2.2. Phân quyền dựa trên vai trò (Role-Based Access Control - RBAC)
- Sử dụng Custom Decorator `@Roles(UserRole.ADMIN)` kết hợp với `RolesGuard`.
- Khi có request gửi đến, `RolesGuard` dùng `Reflector` đọc quyền hạn yêu cầu và so sánh với trường `role` trong payload của Token. Nếu không đủ quyền, chặn đứng ngay với mã lỗi **`403 Forbidden`**.

---

## 3. SO SÁNH LOCALSTORAGE VÀ HTTPONLY COOKIE

Trong quá trình thiết kế hệ thống bảo mật Web, việc lưu trữ Token có 2 trường phái:

| Tiêu chí | Lưu trữ `localStorage` (Hiện tại) | Lưu trữ `HttpOnly Cookie` |
| :--- | :--- | :--- |
| **Tiện dụng** | Cực kỳ tiện cho Single Page Application (React) gọi REST API. | Cần cấu hình CORS phức tạp (`credentials: true`, cùng domain). |
| **Chống XSS** | Dễ bị tấn công nếu ứng dụng có lỗ hổng XSS (chèn script đọc localStorage). | **An toàn tuyệt đối trước XSS** (JavaScript không đọc được cookie HttpOnly). |
| **Chống CSRF** | **Miễn nhiễm với CSRF** vì trình duyệt không tự động gửi localStorage. | Cần thêm CSRF Token để chống tấn công giả mạo yêu cầu. |
| **Chiến lược của dự án** | Sử dụng `localStorage` kết hợp vệ sinh dữ liệu nghiêm ngặt qua NestJS `ValidationPipe`, lọc bỏ mọi thẻ HTML/Script độc hại để triệt tiêu XSS. |
