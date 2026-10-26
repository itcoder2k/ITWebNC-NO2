# ĐẶC TẢ CÁC CA SỬ DỤNG (USE CASE SPECIFICATION)
## SÀN GIAO DỊCH TÀI NGUYÊN GAME TRỰC TUYẾN

> Tài liệu này mô tả chi tiết các tác nhân (Actors) và các kịch bản sử dụng (Use Cases) của hệ thống theo chuẩn phân tích thiết kế phần mềm UML.

---

## 1. BIỂU ĐỒ USE CASE TỔNG THỂ (UML USE CASE DIAGRAM)

Biểu đồ được thiết kế theo bố cục chuẩn UML:
* **Cột trái:** Tác nhân người dùng cuối (**👤 Khách vãng lai** và **👤 Người mua**).
* **Cột giữa:** Khung biên giới hệ thống (**System Boundary**) chứa đầy đủ 14 Use Cases chi tiết được xếp dọc theo 4 phân hệ chức năng.
* **Cột phải:** Tác nhân đối tác & quản trị (**👤 Nhà sáng tạo - Creator** và **👑 Quản trị viên - Admin**).
* **Đường nối liên kết:** Thể hiện rõ ràng quyền hạn truy cập của từng tác nhân vào từng Use Case cụ thể.

```mermaid
flowchart LR
    classDef actorStyle fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px;
    classDef adminStyle fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px;
    classDef usecaseStyle fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;
    classDef groupStyle fill:#141e33,stroke:#26354d,stroke-width:1.5px,color:#94a3b8;

    subgraph ACTORS_LEFT [" "]
        direction TB
        Guest["👤<br><b>Khách vãng lai</b><br><i>(Guest)</i>"]:::actorStyle
        Buyer["👤<br><b>Người mua</b><br><i>(Buyer / Customer)</i>"]:::actorStyle
        Guest ~~~ Buyer
    end

    subgraph SYSTEM_BOUNDARY ["📦 HỆ THỐNG SÀN GIAO DỊCH GAME ASSET"]
        direction TB

        subgraph G1 ["🔍 1. KHÁM PHÁ & ĐỊNH DANH"]
            direction TB
            UC1(["UC1: Xem & Tìm kiếm tài nguyên"]):::usecaseStyle
            UC2(["UC2: Lọc theo Category & Tags"]):::usecaseStyle
            UC3(["UC3: Xem trước Demo Gallery & Audio"]):::usecaseStyle
            UC4(["UC4: Đăng ký / Đăng nhập (JWT)"]):::usecaseStyle
            UC1 ~~~ UC2 ~~~ UC3 ~~~ UC4
        end

        subgraph G2 ["🛒 2. MUA HÀNG & THƯ VIỆN"]
            direction TB
            UC5(["UC5: Nạp tiền vào ví điện tử"]):::usecaseStyle
            UC6(["UC6: Mua tài nguyên (Ủng hộ PWYW)"]):::usecaseStyle
            UC7(["UC7: Kho game của tôi (My Library)"]):::usecaseStyle
            UC8(["UC8: Tải file gốc an toàn (.zip)"]):::usecaseStyle
            UC9(["UC9: Đánh giá & Chấm sao (Review)"]):::usecaseStyle
            UC5 ~~~ UC6 ~~~ UC7 ~~~ UC8 ~~~ UC9
        end

        subgraph G3 ["🎨 3. KÊNH NHÀ SÁNG TẠO (CREATOR)"]
            direction TB
            UC10(["UC10: Đăng bán tài nguyên mới"]):::usecaseStyle
            UC11(["UC11: Quản lý giá sàn & Giấy phép"]):::usecaseStyle
            UC12(["UC12: Dashboard thống kê doanh thu"]):::usecaseStyle
            UC10 ~~~ UC11 ~~~ UC12
        end

        subgraph G4 ["👑 4. QUẢN TRỊ HỆ THỐNG (ADMIN)"]
            direction TB
            UC13(["UC13: Quản lý Danh mục & Thẻ Tags"]):::usecaseStyle
            UC14(["UC14: Quản lý & Phân quyền User"]):::usecaseStyle
            UC13 ~~~ UC14
        end

        G1 ~~~ G2 ~~~ G3 ~~~ G4
    end

    subgraph ACTORS_RIGHT [" "]
        direction TB
        Creator["👤<br><b>Nhà sáng tạo</b><br><i>(Creator)</i>"]:::actorStyle
        Admin["👑<br><b>Quản trị viên</b><br><i>(Admin)</i>"]:::adminStyle
        Creator ~~~ Admin
    end

    style ACTORS_LEFT fill:none,stroke:none
    style ACTORS_RIGHT fill:none,stroke:none
    style G1 class:groupStyle
    style G2 class:groupStyle
    style G3 class:groupStyle
    style G4 class:groupStyle

    %% Liên kết Khách vãng lai (Guest)
    Guest --- UC1
    Guest --- UC2
    Guest --- UC3
    Guest --- UC4

    %% Liên kết Người mua (Buyer)
    Buyer --- UC1
    Buyer --- UC2
    Buyer --- UC3
    Buyer --- UC5
    Buyer --- UC6
    Buyer --- UC7
    Buyer --- UC8
    Buyer --- UC9

    %% Liên kết Nhà sáng tạo (Creator)
    UC10 --- Creator
    UC11 --- Creator
    UC12 --- Creator

    %% Liên kết Quản trị viên (Admin)
    UC13 --- Admin
    UC14 --- Admin
```

---

## 2. PHÂN TÍCH CHI TIẾT TỪNG TÁC NHÂN (ACTORS)

### 2.1. Khách vãng lai (Guest)
- Người dùng chưa đăng nhập vào hệ thống.
- **Quyền hạn:**
  - Duyệt trang chủ, khám phá các gói tài nguyên nổi bật.
  - Tìm kiếm game, tài nguyên theo từ khóa, danh mục (2D, 3D, Audio) và thẻ tag (`#pixel-art`, `#roguelike`).
  - Xem trước demo đa phương tiện (ảnh GIF chuyển động nhân vật, nghe thử nhạc SFX).
  - Đăng ký tài khoản mới hoặc Đăng nhập.

### 2.2. Khách mua / Nhà phát triển (Buyer / Customer)
- Kế thừa toàn bộ quyền của Khách vãng lai sau khi xác thực thành công bằng JWT.
- **Quyền hạn bổ sung:**
  - **Quản lý Ví điện tử:** Nạp tiền vào ví cá nhân theo các mức cố định hoặc tùy chọn.
  - **Mua tài nguyên linh hoạt:** Áp dụng mô hình **Pay What You Want (PWYW)** — có quyền trả thêm tiền trên mức giá sàn để ủng hộ tác giả.
  - **Thư viện cá nhân (My Library):** Sở hữu vĩnh viễn các gói tài nguyên đã mua, được phép tải lại file bất cứ lúc nào.
  - **Tải file an toàn:** Nhận luồng file nén gốc thông qua cơ chế kiểm duyệt quyền sở hữu từ server.
  - **Đánh giá xác thực (Verified Review):** Chấm điểm 1-5 sao và để lại nhận xét công khai nếu đã sở hữu tài nguyên.

### 2.3. Nhà sáng tạo / Nghệ sĩ (Creator / Artist)
- Người dùng đăng ký với vai trò sáng tạo nội dung số.
- **Quyền hạn:**
  - Đăng bán gói tài nguyên mới: Tải lên tệp tin nén gốc (`.zip`), ảnh bìa, gallery ảnh chụp màn hình, ảnh động GIF, file nghe thử.
  - Thiết lập giá bán tối thiểu (Minimum Price) hoặc cho phép tải miễn phí ($0.00).
  - Lựa chọn loại giấy phép bản quyền (CC0, CC-BY, Commercial License).
  - Theo dõi số dư ví tiền kiếm được từ việc bán tài nguyên và nhận donate.

### 2.4. Quản trị viên (Admin)
- Người nắm quyền tối cao trong hệ thống.
- **Quyền hạn:**
  - Quản lý danh mục cấp cao (Categories) và cây thẻ gắn (Tags).
  - Quản lý và kiểm duyệt người dùng, khóa tài khoản vi phạm bản quyền hoặc gian lận.
  - Xem báo cáo tổng quan toàn hệ thống.
