# 🎮 SÀN GIAO DỊCH TÀI NGUYÊN GAME SỐ (GAME ASSET MARKETPLACE)
> **Đồ án môn học:** Thiết kế Web Nâng Cao — Đại học Phenikaa (Phenikaa University)  
> **Kiến trúc phát triển:** Kiến trúc phân lớp (4-Tier Layered Architecture) • Full-Stack (NestJS 12 + React 19 + MySQL 8.0)  
> **Giảng viên hướng dẫn:** ThS. Nguyễn Lệ Thu  
> **Kho lưu trữ (Repository):** [https://github.com/itcoder2k/ITWebNC-NO2](https://github.com/itcoder2k/ITWebNC-NO2)

---

## 👥 THÀNH VIÊN NHÓM & PHÂN CÔNG PHỤ TRÁCH (4 TẦNG)

Mỗi thành viên trong nhóm phụ trách độc lập trọn vẹn đối tượng theo chuẩn **Kiến trúc phân lớp (Controller ➔ Service ➔ Provider/Repo ➔ Entity ➔ DTO)**:

| STT | Họ và Tên | Mã SV | Vai trò | Đối tượng phụ trách chính | Các lớp triển khai theo Kiến trúc 4 tầng |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 1 | **Nguyễn Trọng Hùng** | `23010083` | **Nhóm trưởng** | **`User`** (Người dùng & Ví tiền)<br>& **`Auth`** (Xác thực JWT / RBAC) | • **Presentation:** `user.controller.ts`, `auth.controller.ts`<br>• **Business Logic:** `user.service.ts`, `auth.service.ts`<br>• **Data Access:** `user.provider.ts` (Inject `DATA_SOURCE`)<br>• **Entity & DTO:** `user.entity.ts`, `deposit.dto.ts`, `create-user.dto.ts` |
| 2 | **Nguyễn Hữu Hưng** | `23010124` | **Thành viên** | **`Tag`** & **`AssetMedia`** (Demo Gallery) | • **Presentation:** `tag.controller.ts`<br>• **Business Logic:** `tag.service.ts`<br>• **Data Access:** `tag.provider.ts`, `asset-media.provider.ts`<br>• **Entity & DTO:** `tag.entity.ts`, `asset-media.entity.ts` |
| 3 | **Nguyễn Mạnh Thắng** | `23010098` | **Thành viên** | **`Category`** & **`DatabaseModule`** | • **Presentation:** `category.controller.ts`<br>• **Business Logic:** `category.service.ts`<br>• **Data Access:** `category.provider.ts`, `database.providers.ts`<br>• **Entity & DTO:** `category.entity.ts`, TypeORM DataSource Config |
| 4 | **Vũ Quốc Toản** | `23010003` | **Thành viên** | **`Asset`**, **`Order`** & **`Review`** | • **Presentation:** `asset.controller.ts`, `order.controller.ts`, `review.controller.ts`<br>• **Business Logic:** `asset.service.ts`, `order.service.ts`, `review.service.ts`<br>• **Data Access:** `asset.provider.ts`, `order.provider.ts`, `review.provider.ts`<br>• **Entity & DTO:** `asset.entity.ts`, `order.entity.ts`, `review.entity.ts` |

---

## 📚 TÀI LIỆU KỸ THUẬT CHI TIẾT (SYSTEM DOCUMENTATION)

Để đảm bảo tính chuyên nghiệp và tiêu chuẩn công nghiệp, toàn bộ các bản thiết kế chi tiết được phân tách khoa học trong thư mục **[`docs/`](./docs/)**:

* 📐 **[Kiến trúc 4 Tầng & Bảo mật (ARCHITECTURE.md)](./docs/ARCHITECTURE.md):** Phân tích mô hình 4 tầng, cơ chế xác thực JWT, bảo vệ RBAC Role Guard và so sánh chi tiết phương án lưu trữ LocalStorage vs HttpOnly Cookie.
* 🔄 **[Sơ đồ Luồng Tuần tự (SEQUENCE_DIAGRAMS.md)](./docs/SEQUENCE_DIAGRAMS.md):** Biểu đồ Mermaid chi tiết luồng Đăng nhập, luồng Nạp tiền ví điện tử và luồng Mua tài nguyên Pay What You Want (PWYW).
* 🗄️ **[Thiết kế Cơ sở Dữ liệu & ERD (DATABASE_DESIGN.md)](./docs/DATABASE_DESIGN.md):** Lược đồ 9 bảng, sơ đồ lớp UML Class Diagram và cơ chế đảm bảo tính toàn vẹn giao dịch ACID.
* 🎯 **[Đặc tả Ca Sử Dụng & Actors (USE_CASES.md)](./docs/USE_CASES.md):** Biểu đồ Use Case Diagram tổng thể và ma trận quyền hạn cho 4 tác nhân (Guest, Buyer, Creator, Admin).
* ⚖️ **[Tuân thủ Pháp lý & Đạo đức (LEGAL_AND_ETHICS.md)](./docs/LEGAL_AND_ETHICS.md):** Báo cáo tuân thủ luật bảo vệ dữ liệu GDPR, chính sách Cookie Consent và quản lý bản quyền số tài nguyên game.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Backend:** [NestJS 12](https://nestjs.com/) (Node.js TypeScript), [Passport.js](http://www.passportjs.org/), [JWT](https://jwt.io/), [Bcrypt](https://www.npmjs.com/package/bcrypt), [TypeORM](https://typeorm.io/).
- **Database:** [MySQL 8.0](https://www.mysql.com/) (Quan hệ 3NF, Giao dịch ACID).
- **Frontend:** [React 19](https://react.dev/), [React Router v7](https://reactrouter.com/), [Axios](https://axios-http.com/), Giao diện itch.io Gaming Design System.
- **Testing:** [Vitest](https://vitest.dev/) (Unit testing 20/20 PASS).

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

Tại màn hình đăng nhập `http://localhost:3000/login`, bạn có thể bấm trực tiếp các nút điền 1-click hoặc nhập thông tin sau:

| Vai trò | Tên đăng nhập (Username) | Mật khẩu | Email | Quyền hạn trong hệ thống |
| :--- | :--- | :---: | :--- | :--- |
| 🛒 **Khách mua (Buyer)** | `buyer_hung` | `password123` | `buyer_hung@example.com` | Khám phá tài nguyên, nạp tiền ví điện tử cá nhân. |
| 🎨 **Nhà sáng tạo (Creator)** | `creator_hung` | `password123` | `creator_hung@example.com` | Đăng bán tài nguyên game, quản lý gallery demo. |
| 👑 **Quản trị viên (Admin)** | `admin_test` | `password123` | `admin_test@example.com` | Toàn quyền kiểm soát, quản lý người dùng và danh mục. |

---

## 📡 TỔNG QUAN DANH SÁCH RESTFUL API (PREFIX: `/api`)

* Chi tiết danh sách API endpoints:
  * **Auth & User:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `POST /api/users/wallet/deposit`, `GET /api/users`.
  * **Category & Tag:** `GET /api/category`, `POST /api/category`, `GET /api/tag`, `GET /api/tag/popular`.
  * **Asset & Media:** `GET /api/asset`, `GET /api/asset/:id`, `POST /api/asset`, `GET /api/asset/:id/download`.
  * **Order & Review:** `POST /api/order/checkout`, `GET /api/order/my-library`, `POST /api/review`.

---
© 2026 Nhóm Đồ Án Thiết Kế Web Nâng Cao — Đại học Phenikaa. Bảo lưu mọi quyền.
