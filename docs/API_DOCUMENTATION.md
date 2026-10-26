# TÀI LIỆU ĐẶC TẢ RESTFUL API (API SPECIFICATION & DOCUMENTATION)
> **Phiên bản API:** v1.0.0  
> **Cơ chế Base URL:** `http://localhost:5000/api`  
> **Định dạng dữ liệu:** `application/json` (UTF-8)  
> **Chuẩn Xác thực:** JSON Web Token (JWT Bearer Token qua Header `Authorization: Bearer <token>`)

---

## 📑 MỤC LỤC DANH MỤC ENDPOINTS

1. [Phân Hệ Xác Thực (Authentication APIs)](#1-phân-hệ-xác-thực-authentication-apis)
2. [Phân Hệ Người Dùng & Ví Tiền (User & Wallet APIs)](#2-phân-hệ-người-dùng--ví-tiền-user--wallet-apis)
3. [Phân Hệ Danh Mục (Category APIs)](#3-phân-hệ-danh-mục-category-apis)
4. [Phân Hệ Thẻ Phân Loại (Tag APIs)](#4-phân-hệ-thẻ-phân-loại-tag-apis)
5. [Phân Hệ Tài Nguyên Game (Asset APIs)](#5-phân-hệ-tài-nguyên-game-asset-apis)
6. [Phân Hệ Đa Phương Tiện Demo (Asset Media APIs)](#6-phân-hệ-đa-phương-tiện-demo-asset-media-apis)
7. [Phân Hệ Đơn Hàng & Thư Viện (Order & Library APIs)](#7-phân-hệ-đơn-hàng--thư-viện-order--library-apis)
8. [Phân Hệ Đánh Giá & Chấm Sao (Review APIs)](#8-phân-hệ-đánh-giá--chấm-sao-review-apis)
9. [Bảng Mã Lỗi Chuẩn (Standard HTTP Status & Error Codes)](#9-bảng-mã-lỗi-chuẩn-standard-http-status--error-codes)

---

## 1. PHÂN HỆ XÁC THỰC (AUTHENTICATION APIS)

### 1.1. Đăng ký tài khoản mới (Register)
* **Endpoint:** `POST /api/auth/register`
* **Quyền truy cập:** Public (Không yêu cầu Token)
* **Request Body:**
  ```json
  {
    "username": "buyer_hung",
    "email": "buyer_hung@example.com",
    "password": "password123",
    "display_name": "Nguyễn Trọng Hùng"
  }
  ```
* **Validation Rules:**
  * `username`: Bắt buộc, chuỗi 3 - 50 ký tự, duy nhất.
  * `email`: Bắt buộc, định dạng email chuẩn, duy nhất.
  * `password`: Bắt buộc, tối thiểu 6 ký tự.
  * `display_name`: Tùy chọn, tối đa 100 ký tự.
* **Response (HTTP 201 Created):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 14,
      "username": "buyer_hung",
      "email": "buyer_hung@example.com",
      "display_name": "Nguyễn Trọng Hùng",
      "role": "customer",
      "balance": "0.00"
    }
  }
  ```

### 1.2. Đăng nhập hệ thống (Login)
* **Endpoint:** `POST /api/auth/login`
* **Quyền truy cập:** Public
* **Request Body:**
  ```json
  {
    "username": "buyer_hung",
    "password": "password123"
  }
  ```
* **Response (HTTP 200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 14,
      "username": "buyer_hung",
      "email": "buyer_hung@example.com",
      "display_name": "Nguyễn Trọng Hùng",
      "role": "customer",
      "balance": "50000.00"
    }
  }
  ```
* **Error Response (HTTP 401 Unauthorized):**
  ```json
  {
    "statusCode": 401,
    "message": "Tên đăng nhập hoặc mật khẩu không chính xác"
  }
  ```

### 1.3. Lấy thông tin tài khoản hiện tại (Get Profile)
* **Endpoint:** `GET /api/auth/profile`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)
* **Headers:** `Authorization: Bearer <accessToken>`
* **Response (HTTP 200 OK):**
  ```json
  {
    "user_id": 14,
    "username": "buyer_hung",
    "email": "buyer_hung@example.com",
    "display_name": "Nguyễn Trọng Hùng",
    "role": "customer",
    "balance": 50000,
    "bio": "Indie game enthusiast and pixel art collector.",
    "avatar_url": null,
    "created_at": "2026-10-24T08:30:00.000Z"
  }
  ```

---

## 2. PHÂN HỆ NGƯỜI DÙNG & VÍ TIỀN (USER & WALLET APIS)

### 2.1. Danh sách toàn bộ người dùng (Admin Only)
* **Endpoint:** `GET /api/users`
* **Quyền truy cập:** Chỉ dành riêng cho Quản trị viên (`JwtAuthGuard`, `RolesGuard`, `@Roles(admin)`)
* **Headers:** `Authorization: Bearer <adminToken>`
* **Response (HTTP 200 OK):**
  ```json
  [
    {
      "user_id": 1,
      "username": "admin_test",
      "email": "admin_test@example.com",
      "display_name": "Hệ Thống Quản Trị",
      "role": "admin",
      "balance": "1000000.00",
      "created_at": "2026-10-20T00:00:00.000Z"
    }
  ]
  ```

### 2.2. Lấy hồ sơ công khai của một người dùng
* **Endpoint:** `GET /api/users/:id`
* **Quyền truy cập:** Public (Đã khử bỏ thông tin nhạy cảm: `password_hash`, `balance`)
* **Response (HTTP 200 OK):**
  ```json
  {
    "user_id": 2,
    "username": "creator_hung",
    "display_name": "Hung Pixel Studio",
    "avatar_url": "https://images.unsplash.com/...",
    "bio": "Chuyên thiết kế 2D Spritesheets & Tilesets phong cách 16-bit",
    "created_at": "2026-10-22T04:12:00.000Z"
  }
  ```

### 2.3. Cập nhật hồ sơ cá nhân (Update Profile)
* **Endpoint:** `PUT /api/users/profile`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)
* **Request Body (Whitelist enforced):**
  ```json
  {
    "display_name": "Nguyễn Trọng Hùng (Dev)",
    "bio": "Game Developer sử dụng Unity & Godot Engine.",
    "avatar_url": "https://example.com/avatar.png"
  }
  ```
* **Response (HTTP 200 OK):** Trả về thông tin User sau khi đã cập nhật.

### 2.4. Nạp tiền vào ví điện tử GameAsset (Deposit Wallet)
* **Endpoint:** `POST /api/users/wallet/deposit`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)
* **Request Body:**
  ```json
  {
    "amount": 100000
  }
  ```
* **Validation Rules:** `amount` là số dương $\ge 1.000$ VNĐ, tối đa $100.000.000$ VNĐ.
* **Response (HTTP 201 Created):**
  ```json
  {
    "user_id": 14,
    "balance": 150000,
    "message": "Nạp tiền thành công"
  }
  ```

---

## 3. PHÂN HỆ DANH MỤC (CATEGORY APIS)

### 3.1. Lấy tất cả danh mục tài nguyên
* **Endpoint:** `GET /api/categories`
* **Quyền truy cập:** Public
* **Response (HTTP 200 OK):**
  ```json
  [
    {
      "category_id": 1,
      "name": "2D Game Assets",
      "slug": "2d-game-assets",
      "description": "Sprites, nhân vật pixel, tilesets bản đồ và hình nền parallax"
    },
    {
      "category_id": 2,
      "name": "3D Models",
      "slug": "3d-models",
      "description": "Mô hình low-poly, vũ khí, xe cộ và nhân vật 3D rigging"
    }
  ]
  ```

### 3.2. Lấy chi tiết một danh mục
* **Endpoint:** `GET /api/categories/:id`
* **Quyền truy cập:** Public

### 3.3. Tạo danh mục mới (Admin Only)
* **Endpoint:** `POST /api/categories`
* **Quyền truy cập:** Admin (`@Roles(admin)`)
* **Request Body:**
  ```json
  {
    "name": "Shaders & VFX",
    "slug": "shaders-vfx",
    "description": "Hiệu ứng hạt particle và shader đồ họa"
  }
  ```

---

## 4. PHÂN HỆ THẺ PHÂN LOẠI (TAG APIS)

### 4.1. Danh sách tất cả các Thẻ Tags
* **Endpoint:** `GET /api/tags`
* **Quyền truy cập:** Public
* **Response (HTTP 200 OK):**
  ```json
  [
    { "tag_id": 1, "name": "Pixel Art", "slug": "pixel-art" },
    { "tag_id": 2, "name": "Low Poly", "slug": "low-poly" },
    { "tag_id": 3, "name": "Chiptune SFX", "slug": "chiptune-sfx" }
  ]
  ```

### 4.2. Danh sách Thẻ Tags thịnh hành (Popular Tags)
* **Endpoint:** `GET /api/tags/popular`
* **Quyền truy cập:** Public

---

## 5. PHÂN HỆ TÀI NGUYÊN GAME (ASSET APIS)

### 5.1. Lấy danh sách tài nguyên (Catalog Browse)
* **Endpoint:** `GET /api/assets`
* **Quyền truy cập:** Public
* **Response (HTTP 200 OK):**
  ```json
  [
    {
      "asset_id": 1,
      "title": "Retro Pixel RPG Knight 2D Character Spritesheet",
      "short_description": "Trọn bộ 8 hướng di chuyển, 4 đòn đánh kiếm và hoạt ảnh phép thuật.",
      "price": "0.00",
      "thumbnail_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      "file_size": 48200000,
      "license": "CC-BY 4.0 (Commercial)",
      "views_count": 1250,
      "downloads_count": 142,
      "status": "approved",
      "uploader_id": 2,
      "category_id": 1
    }
  ]
  ```

### 5.2. Lấy chi tiết tài nguyên
* **Endpoint:** `GET /api/assets/:id`
* **Quyền truy cập:** Public
* **Response (HTTP 200 OK):** Toàn bộ thông tin mô tả chi tiết Markdown, thông số kỹ thuật và giấy phép.

### 5.3. Đăng tải tài nguyên mới (Upload Asset)
* **Endpoint:** `POST /api/assets`
* **Quyền truy cập:** Chỉ dành cho Creator hoặc Admin (`@Roles(creator, admin)`)
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "title": "Cyberpunk City Tileset 32x32",
    "short_description": "Bộ gạch ngói xây dựng thành phố tương lai neon cyberpunk.",
    "description": "Chi tiết bao gồm hơn 120 tilesets 32x32, định dạng PNG kèm file cấu hình Tilemap Tiled.",
    "price": 49000,
    "thumbnail_url": "https://example.com/thumbnail.png",
    "file_url": "https://drive.google.com/uc?id=cyberpunk_tileset.zip",
    "file_size": 35000000,
    "license": "Indie Commercial License",
    "category_id": 1
  }
  ```
* **Response (HTTP 201 Created):** Trả về đối tượng Asset vừa được tạo kèm `asset_id`.

### 5.4. Lấy link tải file tài nguyên (Secure Download)
* **Endpoint:** `GET /api/assets/:id/download`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)
* **Logic kiểm tra quyền:** Nếu `price == 0` (miễn phí) hoặc người dùng đã mua tài nguyên này trong bảng `orders` $\rightarrow$ Trả về link tải gốc; nếu chưa thanh toán $\rightarrow$ Chặn với mã `403 Forbidden`.
* **Response (HTTP 200 OK):**
  ```json
  {
    "file_url": "https://storage.gameassets.vn/downloads/knight_pack_v1.zip",
    "file_name": "knight_pack_v1.zip",
    "message": "Xác nhận quyền tải thành công"
  }
  ```

---

## 6. PHÂN HỆ ĐA PHƯƠNG TIỆN DEMO (ASSET MEDIA APIS)

### 6.1. Lấy danh sách ảnh/audio/video xem trước của Asset
* **Endpoint:** `GET /api/asset-media/asset/:id`
* **Quyền truy cập:** Public
* **Response (HTTP 200 OK):**
  ```json
  [
    {
      "media_id": 1,
      "asset_id": 1,
      "media_url": "https://example.com/knight-run.gif",
      "media_type": "image",
      "display_order": 1
    }
  ]
  ```

### 6.2. Thêm media xem trước mới (Chống IDOR)
* **Endpoint:** `POST /api/asset-media`
* **Quyền truy cập:** Creator sở hữu asset hoặc Admin (`JwtAuthGuard`)
* **Request Body:**
  ```json
  {
    "asset_id": 1,
    "media_url": "https://example.com/sound-preview.mp3",
    "media_type": "audio",
    "display_order": 2
  }
  ```

---

## 7. PHÂN HỆ ĐƠN HÀNG & THƯ VIỆN (ORDER & LIBRARY APIS)

### 7.1. Thanh toán đơn hàng tài nguyên (Checkout PWYW)
* **Endpoint:** `POST /api/order/checkout`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "asset_id": 2,
    "pay_amount": 50000
  }
  ```
* **Quy trình nghiệp vụ thực hiện (ACID Transaction):**
  1. Kiểm tra tài nguyên có tồn tại hay không.
  2. Kiểm tra người dùng đã sở hữu asset này chưa (nếu đã sở hữu ném `409 Conflict`).
  3. Kiểm tra số tiền trả `pay_amount >= asset.price`.
  4. Kiểm tra số dư ví người mua `balance >= pay_amount`.
  5. Mở Transaction: Trừ ví người mua $\rightarrow$ Cộng ví tác giả $\rightarrow$ Tạo `orders` (Completed) $\rightarrow$ Tạo `order_details`.
* **Response (HTTP 201 Created):**
  ```json
  {
    "order_id": 105,
    "user_id": 14,
    "total_amount": "50000.00",
    "payment_method": "Wallet",
    "status": "Completed",
    "created_at": "2026-10-26T07:45:00.000Z"
  }
  ```

### 7.2. Lấy kho tài nguyên đã sở hữu (My Library)
* **Endpoint:** `GET /api/order/my-library`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)
* **Response (HTTP 200 OK):**
  ```json
  [
    {
      "asset_id": 2,
      "title": "Low Poly Fantasy Weapons Pack (30+ Models)",
      "thumbnail_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
      "file_url": "https://storage.gameassets.vn/downloads/weapons_pack.zip",
      "license": "Indie Commercial License",
      "price_at_purchase": 50000,
      "purchased_at": "2026-10-26T07:45:00.000Z"
    }
  ]
  ```

### 7.3. Lịch sử hóa đơn cá nhân (My Orders)
* **Endpoint:** `GET /api/order/my-orders`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)

---

## 8. PHÂN HỆ ĐÁNH GIÁ & CHẤM SAO (REVIEW APIS)

### 8.1. Lấy danh sách đánh giá của một Asset
* **Endpoint:** `GET /api/reviews/asset/:id`
* **Quyền truy cập:** Public
* **Response (HTTP 200 OK):**
  ```json
  [
    {
      "review_id": 1,
      "user_id": 14,
      "asset_id": 1,
      "rating": 5,
      "comment": "Asset vẽ pixel cực kỳ tỉ mỉ và khung hình chuyển động rất mượt mà!",
      "created_at": "2026-10-25T14:10:00.000Z",
      "user": {
        "display_name": "Nguyễn Trọng Hùng"
      }
    }
  ]
  ```

### 8.2. Gửi đánh giá sao mới (Verified Review)
* **Endpoint:** `POST /api/reviews`
* **Quyền truy cập:** Yêu cầu đăng nhập (`JwtAuthGuard`)
* **Request Body:**
  ```json
  {
    "asset_id": 1,
    "rating": 5,
    "comment": "Tuyệt vời, tác giả hỗ trợ format Unity rất tốt!"
  }
  ```
* **Validation Rules:** `rating` số nguyên từ 1 đến 5; `comment` tối đa 1000 ký tự.
* **Response (HTTP 201 Created):** Trả về đối tượng Review vừa tạo.

---

## 9. BẢNG MÃ LỖI CHUẨN (STANDARD HTTP STATUS & ERROR CODES)

Mọi phản hồi lỗi từ Server đều tuân theo cấu trúc JSON chuẩn:
```json
{
  "statusCode": 400,
  "message": "Thông điệp mô tả lỗi chi tiết",
  "error": "Tên loại lỗi (Bad Request / Unauthorized / Forbidden / NotFound)"
}
```

| Mã HTTP | Ý nghĩa chuẩn | Ngữ cảnh trả về trong hệ thống |
| :---: | :--- | :--- |
| **`200 OK`** | Thành công | Lấy dữ liệu danh sách, thông tin chi tiết, đăng nhập. |
| **`201 Created`** | Tạo thành công | Đăng ký tài khoản, đăng bán asset, thanh toán đơn hàng. |
| **`400 Bad Request`** | Dữ liệu đầu vào sai | Thiếu trường bắt buộc, số tiền nạp âm, sai định dạng email. |
| **`401 Unauthorized`** | Chưa xác thực | Không truyền JWT token hoặc token hết hạn/không hợp lệ. |
| **`403 Forbidden`** | Không có quyền | Khách thường cố gọi API Admin, hoặc tải file chưa thanh toán. |
| **`404 Not Found`** | Không tìm thấy | Không tìm thấy `asset_id` hoặc `user_id` trong CSDL. |
| **`409 Conflict`** | Xung đột dữ liệu | Trùng tên tài khoản/email, hoặc mua trùng tài nguyên đã có. |
| **`500 Internal Error`**| Lỗi máy chủ nội bộ | Lỗi mất kết nối MySQL hoặc lỗi ngoại lệ chưa xử lý. |
