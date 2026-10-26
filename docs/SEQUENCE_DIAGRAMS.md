# SƠ ĐỒ TUẦN TỰ HỆ THỐNG (SEQUENCE DIAGRAMS)
## CÁC LUỒNG DỮ LIỆU ĐẶC TRƯNG CỦA SÀN TÀI NGUYÊN GAME (GAMEASSET)

> Tài liệu này mô tả chi tiết các tương tác tuần tự giữa **Client (Frontend)**, **Guards (Bảo mật RBAC)**, **Controllers (Presentation Tier)**, **Services (Business Logic Tier)**, **Providers/Repositories (Data Access Tier)** và **MySQL Database (Persistence Tier)** theo chuẩn phân tích thiết kế phần mềm UML 2.0.

---

### BẢNG ÁNH XẠ LUỒNG TUẦN TỰ THEO THÀNH VIÊN VÀ USE CASE

| STT | Luồng nghiệp vụ tuần tự | Tương ứng Use Case | Thành viên phụ trách chính | Mục tiêu kỹ thuật bảo vệ đồ án |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Xác thực & Cấp phát JWT** | `UC4` | **Nguyễn Trọng Hùng** | Băm mật khẩu bcrypt 10 rounds, mã hóa JWT payload, đồng bộ trạng thái Client. |
| **2** | **Nạp tiền vào ví điện tử** | `UC6` | **Nguyễn Trọng Hùng** | Xác thực `JwtAuthGuard`, kiểm tra DTO, cập nhật số dư ví trong giao dịch an toàn. |
| **3** | **Đăng bán & Upload tài nguyên** | `UC13` | **Bùi Quốc Toản** | Kiểm tra quyền Creator, lưu trữ thông tin sản phẩm và liên kết media demo. |
| **4** | **Thanh toán đơn hàng (PWYW Checkout)** | `UC7, UC8` | **Nguyễn Quốc Hưng** | Kiểm tra giá sàn PWYW, kiểm tra số dư ví, thực thi ACID Transaction trừ ví mua/cộng ví bán. |
| **5** | **Tải file gốc an toàn & Chặn IDOR** | `UC11` | **Bùi Quốc Toản & Nguyễn Quốc Hưng** | Ngăn chặn truy cập tệp lậu (IDOR defense), kiểm tra quyền sở hữu trong CSDL trước khi stream file. |
| **6** | **Đánh giá & Chấm sao xác thực** | `UC12` | **Phạm Văn Thắng** | Kiểm tra điều kiện "đã mua hàng" (Verified Review), chặn review trùng lặp, tính điểm sao trung bình. |
| **7** | **Quản trị & Kiểm duyệt vi phạm** | `UC17, UC18` | **Nguyễn Trọng Hùng** | Phân quyền RBAC (`RolesGuard`), gỡ bỏ sản phẩm vi phạm hoặc khóa người dùng. |

---

## 1. LUỒNG XÁC THỰC & ĐĂNG NHẬP (AUTHENTICATION FLOW - UC4)
* **Thành viên phụ trách:** Nguyễn Trọng Hùng
* **Ý nghĩa:** Định danh người dùng vào hệ thống, bảo vệ mật khẩu và cấp Token không lưu session phía server.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng (Client)
    participant AuthC as AuthController
    participant AuthS as AuthService
    participant UserP as UserProvider
    participant DB as MySQL Database

    User->>AuthC: POST /api/auth/login { username, password }
    AuthC->>AuthS: validateUser(username, password)
    AuthS->>UserP: findByUsername / findByEmail
    UserP->>DB: SELECT * FROM users WHERE username = ? OR email = ?
    DB-->>UserP: Trả về bản ghi user (kèm password_hash)
    UserP-->>AuthS: User Entity
    
    AuthS->>AuthS: bcrypt.compare(password, password_hash)
    alt Mật khẩu chính xác
        AuthS->>AuthS: jwtService.sign({ sub: user_id, username, role })
        AuthS-->>AuthC: { accessToken, user }
        AuthC-->>User: HTTP 200 OK + Token & User Info
        User->>User: Lưu accessToken vào localStorage & phát event 'auth-changed'
    else Mật khẩu sai hoặc không tồn tại tài khoản
        AuthS-->>AuthC: null
        AuthC-->>User: HTTP 401 Unauthorized ("Sai tài khoản hoặc mật khẩu")
    end
```

---

## 2. LUỒNG NẠP TIỀN VÍ ĐIỆN TỬ (WALLET DEPOSIT FLOW - UC6)
* **Thành viên phụ trách:** Nguyễn Trọng Hùng
* **Ý nghĩa:** Tăng số dư tài khoản phục vụ mua hàng linh hoạt không cần nhập thẻ nhiều lần.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UserC as UserController
    participant Guard as JwtAuthGuard
    participant UserS as UserService
    participant UserP as UserProvider
    participant DB as MySQL Database

    User->>UserC: POST /api/users/wallet/deposit { amount: 50000 }
    Note over UserC: Header: Authorization: Bearer <accessToken>
    UserC->>Guard: Kiểm tra tính hợp lệ của Token
    Guard->>Guard: jwt.verify(token) -> Lấy user_id từ payload
    Guard-->>UserC: Gán req.user = { user_id: 14, ... }
    
    UserC->>UserS: deposit(14, 50000)
    UserS->>UserP: findOne(14)
    UserP->>DB: SELECT balance FROM users WHERE user_id = 14
    DB-->>UserP: balance = 0
    UserP-->>UserS: User Entity
    
    UserS->>UserS: newBalance = Number(balance) + 50000
    UserS->>UserP: update(14, { balance: newBalance })
    UserP->>DB: UPDATE users SET balance = 50000 WHERE user_id = 14
    DB-->>UserP: Cập nhật thành công
    UserP-->>UserS: Updated User Entity
    UserS-->>UserC: Trả về thông tin user với số dư mới
    UserC-->>User: HTTP 200 OK { balance: 50000 }
```

---

## 3. LUỒNG ĐĂNG BÁN & UPLOAD TÀI NGUYÊN (ASSET & MEDIA CREATION - UC13)
* **Thành viên phụ trách:** Bùi Quốc Toản
* **Ý nghĩa:** Cho phép Creator niêm yết sản phẩm đồ họa/âm thanh, đính kèm link tải file gốc an toàn và gallery preview.

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Nhà sáng tạo (Creator)
    participant AC as AssetController
    participant Guard as JwtAuthGuard & RolesGuard
    participant AS as AssetService
    participant AR as AssetRepository
    participant AMC as AssetMediaController
    participant AMS as AssetMediaService
    participant DB as MySQL Database

    Creator->>AC: POST /api/assets (Payload thông tin tài nguyên)
    Note over AC: Header: Bearer <token> | Role: CREATOR / ADMIN
    AC->>Guard: canActivate(context)
    Guard-->>AC: Token hợp lệ & Vai trò = 'creator'

    AC->>AS: create(createAssetDto, uploaderId)
    AS->>AR: create({ ...dto, uploader_id: uploaderId, status: 'active' })
    AR->>DB: INSERT INTO assets (title, price, file_url, license, uploader_id, ...)
    DB-->>AR: Trả về Asset record (id: 10)
    AR-->>AS: Asset Entity
    AS-->>AC: Asset Entity
    AC-->>Creator: HTTP 201 Created { asset_id: 10, title: "Pixel Knight Sprite" }

    opt Tải lên các file Gallery xem trước / Audio nghe thử
        Creator->>AMC: POST /api/asset-media { asset_id: 10, media_type: 'image', media_url: '...' }
        AMC->>Guard: Kiểm tra Token & Xác minh quyền tác giả
        Guard-->>AMC: Quyền hợp lệ
        AMC->>AMS: create(createAssetMediaDto, uploaderId)
        AMS->>DB: INSERT INTO asset_media (asset_id, media_url, media_type, ...)
        DB-->>AMS: Trả về AssetMedia record
        AMS-->>AMC: AssetMedia Entity
        AMC-->>Creator: HTTP 201 Created { media_id: 45 }
    end
```

---

## 4. LUỒNG THANH TOÁN ĐƠN HÀNG & PWYW (PAY WHAT YOU WANT & CHECKOUT - UC7, UC8)
* **Thành viên phụ trách:** Nguyễn Quốc Hưng
* **Ý nghĩa:** Trọng tâm thương mại điện tử, áp dụng mô hình Pay What You Want và đảm bảo tính toàn vẹn số dư qua Database Transaction.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Người mua (Client App)
    participant C as OrderController (Presentation)
    participant S as OrderService (Business Logic)
    participant P as OrderProvider / Repo (Data Access)
    participant DB as MySQL Database (Persistence)

    Client->>C: POST /api/order/checkout { asset_id: 10, pay_amount: 120000 } + JWT
    C->>C: Xác thực JWT & Kiểm tra CheckoutDto
    C->>S: checkout(buyerId, checkoutDto)
    
    S->>P: Truy vấn thông tin người mua (User) & Số dư ví
    P->>DB: SELECT * FROM users WHERE user_id = buyerId
    DB-->>P: User record (balance = 200000 đ)
    P-->>S: User Entity
    
    S->>P: Truy vấn thông tin tài nguyên (Asset)
    P->>DB: SELECT * FROM assets WHERE asset_id = 10
    DB-->>P: Asset record (price = 50000 đ, uploader_id = 2)
    P-->>S: Asset Entity
    
    Note over S: Kiểm tra nghiệp vụ định giá linh hoạt (PWYW):
    Note over S: 1. Số tiền trả (120.000 đ) >= Giá sàn tối thiểu (50.000 đ) => HỢP LỆ
    Note over S: 2. Số dư ví (200.000 đ) >= Số tiền trả (120.000 đ) => HỢP LỆ
    Note over S: Bắt đầu giao dịch cơ sở dữ liệu (ACID Transaction)
    
    S->>P: Trừ ví người mua & Cộng ví tác giả
    P->>DB: UPDATE users SET balance = balance - 120000 WHERE user_id = buyerId
    P->>DB: UPDATE users SET balance = balance + 120000 WHERE user_id = uploaderId
    
    S->>P: Lưu hóa đơn Order (total = 120.000 đ) & OrderDetail (asset_id = 10, price = 120.000 đ)
    P->>DB: INSERT INTO orders ... và INSERT INTO order_details ...
    DB-->>P: Ghi nhận thành công
    P-->>S: Order Entity (status = 'Completed')
    
    S-->>C: Trả về thông tin đơn hàng thành công & quyền tải
    C-->>Client: HTTP 201 Created { success: true, orderId: 105, libraryUrl: '/library' }
```

---

## 5. LUỒNG TẢI FILE GỐC AN TOÀN & CHẶN IDOR (SECURE FILE DOWNLOAD - UC11)
* **Thành viên phụ trách:** Bùi Quốc Toản & Nguyễn Quốc Hưng
* **Ý nghĩa:** Phòng vệ lỗ hổng IDOR (Insecure Direct Object Reference) - Kiểm tra tính hợp lệ của quyền sở hữu trong CSDL trước khi cho phép tải file nén `.zip` gốc.

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Người mua (Client)
    participant AC as AssetController
    participant Guard as JwtAuthGuard
    participant AS as AssetService
    participant DB as MySQL Database

    Buyer->>AC: GET /api/assets/:id/download
    Note over AC: Header: Authorization: Bearer <accessToken>
    AC->>Guard: Xác thực Token
    Guard-->>AC: req.user = { user_id: 14 }
    
    AC->>AS: getDownload(asset_id: 10, user_id: 14)
    AS->>DB: SELECT * FROM assets WHERE asset_id = 10 AND status = 'active'
    DB-->>AS: Asset Entity (price = 50000, uploader_id = 2)

    Note over AS: Kiểm tra điều kiện cấp quyền tải:
    Note over AS: 1. Có phải chính tác giả không? (uploader_id === 14)
    Note over AS: 2. Tài nguyên có miễn phí không? (price === 0)
    Note over AS: 3. Người dùng đã mua đơn hàng thành công chưa?

    AS->>DB: SELECT od.order_detail_id FROM OrderDetails od INNER JOIN Orders o ON o.order_id = od.order_id WHERE o.user_id = 14 AND od.asset_id = 10 AND o.status = 'Completed' LIMIT 1
    DB-->>AS: Kết quả truy vấn đơn hàng đã mua

    alt Đã mua hàng hợp lệ (Hoặc là tác giả / tài nguyên miễn phí)
        AS->>DB: UPDATE assets SET downloads_count = downloads_count + 1 WHERE asset_id = 10
        AS-->>AC: { asset_id: 10, file_url: "https://...", license: "Standard" }
        AC-->>Buyer: HTTP 200 OK + URL tải file gốc
    else Chưa mua hàng (Không có quyền truy cập)
        AS-->>AC: Ném ngoại lệ ForbiddenException
        AC-->>Buyer: HTTP 403 Forbidden ("Bạn cần mua tài nguyên trước khi tải xuống")
    end
```

---

## 6. LUỒNG ĐÁNH GIÁ & CHẤM SAO XÁC THỰC (VERIFIED REVIEW & RATING SYNC - UC12)
* **Thành viên phụ trách:** Phạm Văn Thắng
* **Ý nghĩa:** Ngăn chặn đánh giá rác (Spam Reviews). Chỉ người dùng đã thực sự sở hữu sản phẩm qua đơn hàng mới được phép gửi review và chấm sao.

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Người mua (Client)
    participant RC as ReviewController
    participant Guard as JwtAuthGuard
    participant RS as ReviewService
    participant RR as ReviewRepository
    participant DB as MySQL Database

    Buyer->>RC: POST /api/reviews { asset_id: 10, rating: 5, comment: "Sprite rất mượt!" }
    Note over RC: Header: Authorization: Bearer <accessToken>
    RC->>Guard: Xác thực JWT
    Guard-->>RC: req.user = { user_id: 14 }
    
    RC->>RS: create(userId: 14, createReviewDto)
    RS->>DB: SELECT asset_id FROM assets WHERE asset_id = 10
    DB-->>RS: Asset tồn tại

    Note over RS: Kiểm tra quyền Đánh giá xác thực (Verified Purchase):
    RS->>DB: SELECT od.order_detail_id FROM OrderDetails od INNER JOIN Orders o ON o.order_id = od.order_id WHERE o.user_id = 14 AND od.asset_id = 10 AND o.status = 'Completed'
    DB-->>RS: Trả về bản ghi đơn hàng

    alt Chưa mua hàng
        RS-->>RC: Ném ngoại lệ ForbiddenException
        RC-->>Buyer: HTTP 403 Forbidden ("Chỉ người đã mua mới có thể đánh giá tài nguyên")
    else Đã mua hàng
        RS->>RR: findOneBy({ user_id: 14, asset_id: 10 })
        RR->>DB: SELECT * FROM reviews WHERE user_id = 14 AND asset_id = 10
        DB-->>RR: Kiểm tra trùng lặp
        
        alt Đã từng đánh giá trước đó
            RS-->>RC: Ném ngoại lệ ConflictException
            RC-->>Buyer: HTTP 409 Conflict ("Bạn đã đánh giá tài nguyên này")
        else Lần đầu đánh giá
            RS->>RR: save({ user_id: 14, asset_id: 10, rating: 5, comment: "..." })
            RR->>DB: INSERT INTO reviews (user_id, asset_id, rating, comment, ...)
            DB-->>RR: Lưu review thành công
            RR-->>RS: Review Entity
            RS-->>RC: Review Entity
            RC-->>Buyer: HTTP 201 Created (Đánh giá được ghi nhận thành công)
        end
    end
```

---

## 7. LUỒNG QUẢN TRỊ & KIỂM DUYỆT VI PHẠM (ADMIN MODERATION - UC17, UC18)
* **Thành viên phụ trách:** Nguyễn Trọng Hùng
* **Ý nghĩa:** Bảo vệ nền tảng trước các nội dung độc hại, tệp tin vi phạm bản quyền DMCA hoặc tài khoản gian lận dựa trên Role-Based Access Control (RBAC).

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên (Admin)
    participant AC as AssetController / UserController
    participant Guard as JwtAuthGuard & RolesGuard
    participant AS as AssetService / UserService
    participant DB as MySQL Database

    Admin->>AC: DELETE /api/assets/:id (Yêu cầu gỡ bỏ tài nguyên vi phạm bản quyền)
    Note over AC: Header: Bearer <token>
    AC->>Guard: Kiểm tra @Roles(UserRole.ADMIN)
    Guard->>Guard: Xác thực token và so sánh role === 'admin'
    
    alt Vai trò không phải Admin hoặc không có Token
        Guard-->>AC: Từ chối truy cập
        AC-->>Admin: HTTP 403 Forbidden ("Access Denied: Admin role required")
    else Vai trò Admin hợp lệ
        Guard-->>AC: Cho phép tiếp tục
        AC->>AS: remove(id, actorId, isAdmin = true)
        AS->>DB: SELECT * FROM assets WHERE asset_id = :id
        DB-->>AS: Asset Record
        
        Note over AS: Bỏ qua kiểm tra uploader_id vì có cờ isAdmin = true
        AS->>DB: DELETE FROM assets WHERE asset_id = :id (hoặc UPDATE status = 'banned')
        DB-->>AS: Xóa thành công
        AS-->>AC: { message: "Đã xóa tài nguyên vi phạm thành công" }
        AC-->>Admin: HTTP 200 OK
    end
```
