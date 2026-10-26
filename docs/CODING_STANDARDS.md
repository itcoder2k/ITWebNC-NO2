# TIÊU CHUẨN MÃ NGUỒN & QUY CHUẨN PHÁT TRIỂN (CODING STANDARDS & COMPLIANCE)
> **Đồ án môn học:** Thiết kế Web Nâng Cao — Đại học Phenikaa  
> **Áp dụng cho:** Toàn bộ thành viên nhóm `ITWebNC-NO2` (Full-Stack: NestJS 12 + React 19 + MySQL 8.0)

---

## 1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (CORE PRINCIPLES)

1. **Separation of Concerns (SoC) - Phân tách tầng trách nhiệm:**
   - Mã nguồn được phân chia chặt chẽ theo **Kiến trúc 4 tầng (4-Tier Layered Architecture)**:
     - **Tầng Trình diễn (Presentation):** `Controller` (Backend) & `Component / Page` (Frontend) — Chỉ nhận request, validate đầu vào và định tuyến dữ liệu, tuyệt đối không chứa business logic hay câu lệnh SQL.
     - **Tầng Nghiệp vụ (Business Logic):** `Service` — Nơi duy nhất xử lý quy tắc nghiệp vụ, tính toán tiền tệ, băm mật khẩu, kiểm tra quyền sở hữu.
     - **Tầng Truy xuất Dữ liệu (Data Access / Persistence):** `Provider / Repository` — Đóng gói việc truy vấn cơ sở dữ liệu qua TypeORM Data Source.
     - **Tầng Thực thể & Dữ liệu (Entity & Database):** `Entity` ánh xạ 1-1 với cấu trúc bảng MySQL 8.0, định nghĩa quan hệ khóa ngoại (Foreign Keys).
2. **SOLID & DRY (Don't Repeat Yourself):**
   - Đảm bảo tính đơn nhiệm (Single Responsibility Principle) cho mỗi class và hàm.
   - Tái sử dụng logic chung qua Custom Decorators, Guards, Pipes (Backend) và Custom Hooks / Services (Frontend).
3. **Fail-Fast & Structured Error Handling:**
   - Bắt và xử lý lỗi ngay tại ranh giới đầu vào (Runtime boundary).
   - Luôn sử dụng các HTTP Exception có sẵn của NestJS (`BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `ConflictException`) với mã HTTP và thông điệp lỗi có cấu trúc.

---

## 2. TIÊU CHUẨN MÃ NGUỒN BACKEND (NESTJS & TYPESCRIPT)

### 2.1. Quy ước Đặt tên (Naming Conventions)
* **Classes, DTOs, Entities, Interfaces:** Dùng `PascalCase`  
  *Ví dụ:* `UserController`, `CreateAssetDto`, `UserEntity`, `JwtPayload`.
* **Methods, Functions, Variables, Properties:** Dùng `camelCase`  
  *Ví dụ:* `findMyLibrary()`, `checkoutAsset()`, `walletBalance`.
* **Constants, Enums:** Dùng `UPPER_SNAKE_CASE`  
  *Ví dụ:* `UserRole.ADMIN`, `JWT_SECRET`, `MAX_PAY_AMOUNT`.
* **Tên file & Thư mục:** Dùng `kebab-case` kèm hậu tố loại file  
  *Ví dụ:* `user.controller.ts`, `create-asset.dto.ts`, `jwt-auth.guard.ts`.

### 2.2. Tính Nghiêm Ngặt về Kiểu Dữ Liệu (Strict Type Safety)
* **Tuyệt đối không dùng kiểu `any`:** Mọi tham số, giá trị trả về của hàm và biến phải được định kiểu rõ ràng (`string`, `number`, `Promise<User>`, `Order[]`).
* **Validation đầu vào 100% qua DTO:**
  * Mọi payload gửi lên từ Client qua `POST`, `PUT`, `PATCH` phải có DTO class tương ứng.
  * Sử dụng thư viện `class-validator` và `class-transformer` với các decorators: `@IsNotEmpty()`, `@IsString()`, `@IsNumber()`, `@Min()`, `@MaxLength()`, `@IsOptional()`.
  * Bật `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` toàn cục để tự động loại bỏ mọi trường lạ inject vào payload (chống Mass Assignment).

### 2.3. Quy tắc Bảo mật Cơ sở Dữ liệu & Transaction
* **Không ghép chuỗi SQL thủ công:** Luôn sử dụng TypeORM Repository API hoặc QueryBuilder có parameterized bindings (`where: { user_id: userId }` hoặc `.where('user.id = :id', { id })`) để triệt tiêu lỗ hổng SQL Injection.
* **Bắt buộc dùng Database Transaction cho luồng nhạy cảm:**
  * Mọi quy trình liên quan đến tiền bạc, thanh toán hoặc cập nhật nhiều bảng cùng lúc (như `OrderService.checkout`) phải được bọc trong `QueryRunner` với Transaction:
    ```typescript
    await queryRunner.startTransaction();
    try {
      // 1. Trừ ví người mua
      // 2. Cộng ví người bán
      // 3. Tạo Order & OrderDetails
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    ```

---

## 3. TIÊU CHUẨN GIAO DIỆN & FRONTEND (REACT 19)

### 3.1. Chuẩn Anti-UI-Slop & Vòng Đời 4 Trạng Thái (UI Lifecycle States)
Mọi Component hoặc Trang tải dữ liệu từ API bắt buộc phải xử lý trọn vẹn **4 trạng thái**:
1. **Loading State:** Sử dụng hiệu ứng Shimmer Skeleton loader (`rn-skeleton`), không dùng chữ "Loading..." trơ trọi làm xô lệch khung trang.
2. **Empty State:** Hiển thị minh họa trực quan, tiêu đề thân thiện và **luôn có nút hành động cụ thể** (Call-to-Action) điều hướng người dùng (Ví dụ: Giỏ hàng trống $\rightarrow$ Nút "Khám phá Asset ngay").
3. **Error State:** Hiển thị thông báo lỗi rõ ràng, dễ hiểu kèm **nút "Thử lại" (Retry)** để người dùng tải lại dữ liệu mà không cần F5 trình duyệt.
4. **Success State:** Dữ liệu thật từ CSDL được hiển thị mạch lạc, căn chỉnh lưới chuẩn mực.

### 3.2. Tiêu chuẩn Hệ Thống Màu & Trợ Năng (Accessibility - WCAG 2.1 AA)
* **Không hardcode mã màu cố định:** Tuyệt đối không viết cứng mã màu `#ffffff` hay `#000000` trong style. Toàn bộ màu sắc phải sử dụng biến CSS Tokens định nghĩa trong [`theme.css`](../client/src/styles/theme.css):
  * Nền: `var(--bg-body)`, `var(--card-bg)`, `var(--bg-secondary)`.
  * Viền: `var(--border-color)`, `var(--card-border)`.
  * Chữ: `var(--text-main)`, `var(--text-muted)`.
  * Nút bấm: `var(--primary-color)`, `var(--primary-hover)`.
* **Độ tương phản cao (Contrast Ratio $\ge 4.5:1$):** Đảm bảo chữ phụ trên nền tối luôn đọc rõ ràng, bảo vệ mắt người dùng ở cả 2 chế độ Sáng (Light) và Tối (Dark).
* **Trợ năng (a11y):** Các nút bấm chỉ có icon bắt buộc phải có thuộc tính `title` hoặc `aria-label` để hỗ trợ trình đọc màn hình.

### 3.3. Tách Biệt Tầng Dịch Vụ API (Service Layer)
* Không gọi trực tiếp `axios.get()` hay `fetch()` trong component React.
* Mọi tương tác mạng phải đi qua tầng Service tập trung [`client/src/services/assetApi.js`](../client/src/services/assetApi.js) và [`cartService.js`](../client/src/services/cartService.js).
* Tự động đính kèm `Bearer Token` JWT từ `localStorage` qua cấu hình xác thực đồng bộ.

---

## 4. TIÊU CHUẨN AN TOÀN & BẢO MẬT (OWASP TOP 10 COMPLIANCE)

| Mục tiêu bảo mật | Tiêu chuẩn triển khai trong dự án |
| :--- | :--- |
| **Quản lý Khóa & Bí mật** | Không bao giờ commit `.env`, token JWT, mật khẩu DB lên Git. Luôn sử dụng `.env.example` làm mẫu cấu hình. |
| **Mật khẩu người dùng** | Mã hóa 1 chiều bằng thuật toán `bcrypt` với Salt Round tối thiểu là 10. Không bao giờ lưu hay trả về mật khẩu dạng văn bản thô (Plaintext). |
| **Phân quyền chặt chẽ (RBAC)** | Sử dụng `@UseGuards(JwtAuthGuard, RolesGuard)` và `@Roles(...)` để bảo vệ các endpoint nhạy cảm (`/api/users`, `POST /api/assets`, v.v.). |
| **Phòng chống IDOR** | Mọi thao tác sửa/xóa tài nguyên hoặc tải tệp tin phải kiểm tra quyền sở hữu (`uploader_id === currentUser.id`) trước khi thực hiện. |
| **Phòng chống XSS** | React tự động escape HTML khi render dữ liệu; dữ liệu đầu vào phía backend được kiểm tra định dạng qua validator DTO. |
| **Phòng chống CSRF** | Kiến trúc SPA gọi REST API sử dụng `Authorization: Bearer <token>` trong header (không phụ thuộc vào cookie session tự động gửi của trình duyệt). |

---

## 5. TIÊU CHUẨN QUẢN LÝ MÃ NGUỒN & QUY TRÌNH GIT (GIT FLOW)

### 5.1. Quy ước Viết Commit Message (Conventional Commits)
Cú pháp chuẩn: `<type>(<scope>): <mô tả ngắn gọn bằng tiếng Anh hoặc tiếng Việt>`
* `feat`: Thêm một tính năng mới cho người dùng.  
  *Ví dụ:* `feat(cart): add pay-what-you-want tip adjustment`
* `fix`: Sửa một lỗi phần mềm hoặc vá lỗ hổng.  
  *Ví dụ:* `fix(security): sanitize public user profile endpoint`
* `docs`: Thêm hoặc chỉnh sửa tài liệu kỹ thuật, README.  
  *Ví dụ:* `docs: update api specification and coding standards`
* `style`: Chỉnh sửa giao diện, CSS, format code không đổi logic nghiệp vụ.  
  *Ví dụ:* `style(theme): enhance dark mode contrast with deep slate palette`
* `refactor`: Tối ưu cấu trúc code mà không thay đổi tính năng.  
  *Ví dụ:* `refactor(auth): extract jwt extraction to auth helper`
* `test`: Thêm mới hoặc cập nhật các test case tự động.  
  *Ví dụ:* `test(asset): add unit tests for asset download validation`

### 5.2. Tiêu chuẩn Tích hợp & Kiểm thử (CI / Code Verification)
Trước khi tạo Pull Request hoặc đẩy code lên nhánh chính (`main`):
1. **Kiểm tra Backend:** Chạy `npm test` trong thư mục `server/` $\rightarrow$ **Toàn bộ Unit Test phải ĐẠT 100% (Green)**.
2. **Kiểm tra Frontend:** Chạy `npm run build` trong thư mục `client/` $\rightarrow$ **Biên dịch thành công với 0 LỖI và 0 CẢNH BÁO ESLint**.
