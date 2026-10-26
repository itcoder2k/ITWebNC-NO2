# SƠ ĐỒ TUẦN TỰ HỆ THỐNG (SEQUENCE DIAGRAMS)
## CÁC LUỒNG DỮ LIỆU ĐẶC TRƯNG CỦA SÀN TÀI NGUYÊN GAME

> Tài liệu mô tả các tương tác tuần tự giữa Client, Controllers, Services, Providers và Database theo chuẩn UML.

---

## 1. LUỒNG XÁC THỰC & ĐĂNG NHẬP (AUTHENTICATION FLOW)

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
        User->>User: Lưu accessToken vào localStorage & phát event auth-changed
    else Mật khẩu sai
        AuthS-->>AuthC: null
        AuthC-->>User: HTTP 401 Unauthorized (Sai tài khoản hoặc mật khẩu)
    end
```

---

## 2. LUỒNG NẠP TIỀN VÍ ĐIỆN TỬ (WALLET DEPOSIT FLOW)

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

## 3. LUỒNG MUA TÀI NGUYÊN (PAY WHAT YOU WANT & CHECKOUT FLOW)

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
    Note over S: Mở Database Transaction (ACID)
    
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
