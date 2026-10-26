# 🎮 SÀN GIAO DỊCH TÀI NGUYÊN GAME SỐ (GAME ASSET MARKETPLACE)
> **Đồ án môn học:** Thiết kế Web Nâng Cao — Đại học Phenikaa (Phenikaa University)  
> **Kiến trúc phát triển:** Kiến trúc phân lớp (4-Tier Layered Architecture) • Full-Stack (NestJS 12 + React 19 + MySQL 8.0)  
> **Giảng viên hướng dẫn:** ThS. Nguyễn Lệ Thu  
> **Kho lưu trữ (Repository):** [https://github.com/itcoder2k/ITWebNC-NO2](https://github.com/itcoder2k/ITWebNC-NO2)

---

## 👥 THÀNH VIÊN NHÓM & PHÂN CÔNG PHỤ TRÁCH (FULL-STACK 4 TẦNG)

Mỗi thành viên trong nhóm phụ trách độc lập trọn vẹn một luồng nghiệp vụ theo chuẩn **Kiến trúc phân lớp Full-Stack (Database ➔ Provider/Repo ➔ Service ➔ Controller ➔ React UI)**:

| STT | Họ và Tên | Mã SV | Vai trò | Luồng nghiệp vụ phụ trách | Backend (Kiến trúc 4 tầng NestJS) | Frontend (Màn hình React phụ trách) |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- |
| **1** | **Nguyễn Trọng Hùng** | `23010083` | **Nhóm trưởng** | **Hệ Thống, Định Danh & Ví Điện Tử**<br>*(Auth, User, Wallet & Architecture)* | • `auth.controller.ts`, `auth.service.ts`<br>• `user.controller.ts`, `user.service.ts`<br>• `user.provider.ts`, `user.entity.ts`<br>• Bảo vệ bảo mật (JWT Guards, RBAC Admin) | • Thiết kế khung Design System (`theme.css` Light/Dark)<br>• Khung Layout chung: `Navbar`, `Footer`, `ScrollToTop`<br>• Modal Đăng nhập/Đăng ký (`AuthModal`)<br>• Hồ sơ cá nhân & Nạp ví tiền (`ProfilePage`) |
| **2** | **Vũ Quốc Toản** | `23010003` | **Thành viên** | **Tài Nguyên Game & Creator Hub**<br>*(Assets & Creator Management)* | • `asset.controller.ts`, `asset.service.ts`<br>• `asset.provider.ts`, `asset.entity.ts`<br>• Xử lý cấp phép (Licenses), kiểm duyệt, link tải an toàn | • Trang chủ giới thiệu Game Asset (`HomePage`)<br>• Form Đăng bán tài nguyên mới (`UploadAssetPage`)<br>• Quản lý hiệu quả bán hàng (`CreatorDashboardPage`) |
| **3** | **Nguyễn Hữu Hưng** | `23010124` | **Thành viên** | **Đơn Hàng, Thanh Toán & Thư Viện**<br>*(Orders, ACID Checkout & Library)* | • `order.controller.ts`, `order.service.ts`<br>• `order.provider.ts`, `order.entity.ts`<br>• Xử lý Transaction ACID thanh toán PWYW, nạp kho `my-library` | • Quản lý giỏ hàng (`CartPage`, `cartService.js`)<br>• Thanh toán & Cổng ví (`CheckoutPage`)<br>• Kho game đã sở hữu tải file zip (`MyLibraryPage`) |
| **4** | **Nguyễn Mạnh Thắng** | `23010098` | **Thành viên** | **Danh Mục, Phân Loại & Đánh Giá**<br>*(Catalog, Media, Tags & Reviews)* | • `category.controller.ts`, `category.service.ts`<br>• `tag.controller.ts`, `tag.service.ts`<br>• `asset-media.controller.ts`, `asset-media.service.ts`<br>• `review.controller.ts`, `review.service.ts` | • Bộ lọc & Tìm kiếm đa chiều (`CatalogPage`)<br>• Trang Chi tiết tài nguyên (`AssetDetailPage`): Media Gallery demo & Tab bình luận/chấm sao |

---

## 📚 TÀI LIỆU KỸ THUẬT CHI TIẾT (SYSTEM DOCUMENTATION)

Để đảm bảo tính chuyên nghiệp và tiêu chuẩn công nghiệp, toàn bộ các bản thiết kế chi tiết được phân tách khoa học trong thư mục **[`docs/`](./docs/)**:

* 📖 **[Đặc tả Toàn bộ RESTful API (API_DOCUMENTATION.md)](./docs/API_DOCUMENTATION.md):** Danh mục 8 nhóm API (Auth, User, Category, Tag, Asset, Media, Order, Review) với Request/Response Schemas, HTTP Status Codes và mô phỏng payload JSON.
* 📋 **[Tiêu chuẩn Mã nguồn & Tuân thủ Code (CODING_STANDARDS.md)](./docs/CODING_STANDARDS.md):** Quy chuẩn kiến trúc 4 tầng, tiêu chuẩn code NestJS/React, kiểm soát lỗi runtime, Anti-UI-Slop 4 trạng thái, chuẩn trợ năng WCAG 2.1 AA và quy ước Git Conventional Commits.
* 📐 **[Kiến trúc 4 Tầng & Bảo mật (ARCHITECTURE.md)](./docs/ARCHITECTURE.md):** Phân tích mô hình 4 tầng, cơ chế xác thực JWT, bảo vệ RBAC Role Guard và so sánh chi tiết phương án lưu trữ LocalStorage vs HttpOnly Cookie.
* 🔄 **[Sơ đồ Luồng Tuần tự (SEQUENCE_DIAGRAMS.md)](./docs/SEQUENCE_DIAGRAMS.md):** Biểu đồ Mermaid chi tiết luồng Đăng nhập, luồng Nạp tiền ví điện tử và luồng Mua tài nguyên Pay What You Want (PWYW).
* 🗄️ **[Thiết kế Cơ sở Dữ liệu & ERD (DATABASE_DESIGN.md)](./docs/DATABASE_DESIGN.md):** Lược đồ 9 bảng, sơ đồ lớp UML Class Diagram và cơ chế đảm bảo tính toàn vẹn giao dịch ACID.
* 🎯 **[Đặc tả Ca Sử Dụng & Actors (USE_CASES.md)](./docs/USE_CASES.md):** Biểu đồ Use Case Diagram tổng thể và ma trận quyền hạn cho 4 tác nhân (Guest, Buyer, Creator, Admin).
* ⚖️ **[Tuân thủ Pháp lý & Đạo đức (LEGAL_AND_ETHICS.md)](./docs/LEGAL_AND_ETHICS.md):** Báo cáo tuân thủ luật bảo vệ dữ liệu GDPR, chính sách Cookie Consent và quản lý bản quyền số tài nguyên game.
* 📜 **[Giấy phép Bản quyền Mã nguồn (LICENSE)](./LICENSE):** MIT License chính thức bảo hộ bản quyền cho 4 thành viên thuộc Đại học Phenikaa.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Backend:** [NestJS 12](https://nestjs.com/) (Node.js TypeScript), [Passport.js](http://www.passportjs.org/), [JWT](https://jwt.io/), [Bcrypt](https://www.npmjs.com/package/bcrypt), [TypeORM](https://typeorm.io/).
- **Database:** [MySQL 8.0](https://www.mysql.com/) (Quan hệ 3NF, Giao dịch ACID chuẩn).
- **Frontend:** [React 19](https://react.dev/), [React Router v7](https://reactrouter.com/), [Axios](https://axios-http.com/), Design Tokens itch.io Style hỗ trợ 2 chế độ Dark/Light Mode chuẩn WCAG AA.
- **Testing:** [Vitest](https://vitest.dev/) (Unit testing **68/68 PASS - 100% Green**).

---

## ⚡ HƯỚNG DẪN KHỞI CHẠY NHANH TRONG 3 BƯỚC (QUICK START)

### Bước 1: Khởi tạo Cơ sở Dữ liệu MySQL
1. Đảm bảo dịch vụ MySQL đang chạy trên cổng `3306`.
2. Mở file **[`database/gameassets.sql`](./database/gameassets.sql)** trong MySQL Workbench / DBeaver và chạy thực thi. Cơ sở dữ liệu `GameAssetDB` cùng đầy đủ 9 bảng và dữ liệu mẫu sẽ được tạo ngay lập tức.

### Bước 2: Khởi chạy Máy chủ Backend (NestJS Server)
```bash
cd server
cp .env.example .env     # Cập nhật DB_PASSWORD nếu cần
npm install
npm run start:dev
```
> Server sẽ khởi chạy tại: **`http://localhost:5000/api`**.

### Bước 3: Khởi chạy Giao diện Frontend (React Client)
Mở một cửa sổ dòng lệnh riêng biệt:
```bash
cd client
npm install
npm start
```
> Trình duyệt sẽ tự động mở giao diện tại: **`http://localhost:3000`**.

---

## 🔑 TÀI KHOẢN TRẢI NGHIỆM NHANH (DEMO CREDENTIALS)

Tại màn hình đăng nhập `http://localhost:3000`, bấm nút Đăng nhập trên thanh điều hướng hoặc nhập thông tin sau:

| Vai trò | Tên đăng nhập (Username) | Mật khẩu | Email | Quyền hạn trong hệ thống |
| :--- | :--- | :---: | :--- | :--- |
| 🛒 **Khách mua (Buyer)** | `buyer_hung` | `password123` | `buyer_hung@example.com` | Khám phá tài nguyên, nạp tiền ví điện tử cá nhân, mua asset & tải file từ thư viện. |
| 🎨 **Nhà sáng tạo (Creator)** | `creator_hung` | `password123` | `creator_hung@example.com` | Đăng bán tài nguyên game mới, xem thống kê dashboard, theo dõi lượt tải. |
| 👑 **Quản trị viên (Admin)** | `admin_test` | `password123` | `admin_test@example.com` | Toàn quyền kiểm soát, quản lý người dùng và danh mục tài nguyên. |

---

## 📡 TỔNG QUAN DANH SÁCH RESTFUL API (PREFIX: `/api`)

* Chi tiết danh sách API endpoints:
  * **Auth & User:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `PUT /api/users/profile`, `POST /api/users/wallet/deposit`, `GET /api/users` (Admin).
  * **Category & Tag:** `GET /api/categories`, `GET /api/categories/:id`, `POST /api/categories`, `GET /api/tags`, `GET /api/tags/popular`.
  * **Asset & Media:** `GET /api/assets`, `GET /api/assets/:id`, `POST /api/assets` (Creator/Admin), `GET /api/assets/:id/download`, `GET /api/asset-media/asset/:id`.
  * **Order & Library:** `POST /api/order/checkout`, `GET /api/order/my-library`, `GET /api/order/my-orders`.
  * **Review & Rating:** `GET /api/reviews/asset/:id`, `POST /api/reviews` (Buyer đã sở hữu).

---
© 2026 Nhóm Đồ Án Thiết Kế Web Nâng Cao — Đại học Phenikaa. Bảo lưu mọi quyền.
