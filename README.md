# Báo Cáo Dự Án: Thiết Kế Web Nâng Cao

## 1. Thông tin Nhóm sinh viên
- **Link Github Repo:** `https://github.com/itcoder2k/ITWebNC-NO2`
- **Giảng viên hướng dẫn:** @lethunguyen

**Danh sách thành viên & Phân công nhiệm vụ:**
1. **Nguyễn Trọng Hùng** - `23010083` 
2. **Nguyễn Hữu Hưng** - `23010124` 
3. **Nguyễn Mạnh Thắng** - `23010098` 
4. **Vũ Quốc Toản** - `23010003` 

---

## 2. Xây dựng nội dung dự án cuối kỳ

**Tên dự án:** Xây dựng hệ thống quản lý và giao dịch tài nguyên trò chơi trực tuyến (Game Asset Marketplace).

**Mô tả chi tiết:** 
Dự án là một nền tảng thương mại điện tử đặc thù (Marketplace) dành riêng cho cộng đồng phát triển game và thiết kế đồ họa. Hệ thống giải quyết bài toán lưu trữ, hiển thị và giao dịch các tệp tài nguyên số (Digital Assets).
- **Góc độ người mua (Khách hàng/Developer):** Có thể tìm kiếm, xem trước (preview), thêm vào giỏ hàng, thanh toán và tải xuống các tài nguyên như mô hình 3D (.obj, .fbx), file animation (.skel, .atlas), hiệu ứng âm thanh, và mã nguồn (scripts).
- **Góc độ người bán (Creator/Modder):** Có công cụ để tải file lên, quản lý kho tài nguyên cá nhân, định giá bán và theo dõi doanh thu.
- **Góc độ quản trị (Admin):** Kiểm duyệt nội dung tải lên, quản lý người dùng, xử lý khiếu nại và quản lý danh mục hệ thống.

---

## 3. Phân tích bài toán chi tiết

### 3.1. Các quy trình nghiệp vụ cốt lõi (Business Workflows)
Hệ thống vận hành dựa trên 2 luồng nghiệp vụ chính:
- **Luồng mua hàng (Dành cho Khách hàng):** Tìm kiếm/Lọc tài nguyên theo danh mục -> Xem chi tiết tài nguyên (ảnh preview, mô tả) -> Thêm vào giỏ hàng (Cart) -> Tiến hành thanh toán tạo Đơn hàng (Order) -> Mở khóa quyền tải xuống (Download) các tệp tài nguyên.
- **Luồng bán hàng (Dành cho Creator/Modder):** Đăng nhập -> Tải lên tệp tài nguyên (Upload) -> Nhập metadata (tên, mô tả, giá bán, ảnh thumbnail) -> Xuất bản (Publish) -> Theo dõi lượt mua và đánh giá từ người dùng.

### 3.2. Phân tích các đối tượng (Entities) và Thuộc tính
Hệ thống được thiết kế với 6 thực thể cốt lõi:

1. **User (Người dùng):** Quản lý thông tin xác thực và định danh.
   - `user_id` (PK): Định danh duy nhất.
   - `username`, `email`, `password_hash`: Thông tin đăng nhập.
   - `role`: Phân quyền (`Admin`, `Creator`, `Customer`).
   - `balance`: Số dư ví (nếu áp dụng thanh toán nội bộ).

2. **Category (Danh mục):** Phân cấp và phân loại tài nguyên.
   - `category_id` (PK): Định danh danh mục.
   - `name`: Tên danh mục (VD: 3D Models, 2D Characters, UI Elements).
   - `slug`: Đường dẫn URL thân thiện (VD: `3d-models`).

3. **Asset (Tài nguyên Game):** Trọng tâm của hệ thống, lưu trữ thông tin sản phẩm.
   - `asset_id` (PK), `uploader_id` (FK), `category_id` (FK).
   - `title`, `description`: Tiêu đề và mô tả chi tiết.
   - `price`: Giá bán (bằng 0 nếu là tài nguyên miễn phí).
   - `thumbnail_url`: Ảnh xem trước của tài nguyên.
   - `file_url`: Đường dẫn tới tệp vật lý chứa tài nguyên gốc (.zip, .rar).
   - `downloads_count`: Thống kê số lượt đã tải.

4. **Review (Đánh giá & Phản hồi):** Cho phép người mua để lại nhận xét.
   - `review_id` (PK), `user_id` (FK), `asset_id` (FK).
   - `rating`: Điểm đánh giá (1 - 5 sao).
   - `comment`: Nội dung nhận xét.
   - `created_at`: Thời gian đánh giá.

5. **Order (Đơn hàng):** Ghi nhận các phiên giao dịch mua bán.
   - `order_id` (PK), `user_id` (FK - Người mua).
   - `total_amount`: Tổng giá trị thanh toán.
   - `payment_method`: Phương thức thanh toán (VNPay, Momo, Credit Card).
   - `status`: Trạng thái (`Pending`, `Completed`, `Failed`).

6. **OrderDetail (Chi tiết đơn hàng):** Bóc tách các mặt hàng trong một đơn hàng.
   - `order_detail_id` (PK), `order_id` (FK), `asset_id` (FK).
   - `price_at_purchase`: Giá tại thời điểm mua (Tránh sai lệch doanh thu nếu sau này Creator đổi giá).

### 3.3. Các ràng buộc nghiệp vụ (Business Rules)
- **Ràng buộc tải xuống:** Một tài khoản Customer chỉ được phép gọi hàm `download()` đối với các `Asset` có tồn tại trong `OrderDetail` thuộc về một `Order` có trạng thái là `Completed` của người đó (đã thanh toán thành công).
- **Ràng buộc đánh giá:** Chỉ người dùng đã mua tài nguyên mới được phép tạo `Review` cho tài nguyên đó (Verified Purchase).
- **Ràng buộc xóa tài khoản:** Nếu xóa một tài khoản `Creator`, các `Asset` của họ không bị xóa hoàn toàn khỏi DB mà sẽ chuyển trạng thái sang `Archived` để đảm bảo những khách hàng cũ vẫn có thể tải lại file họ đã mua.

### 3.4. Sơ đồ chức năng tổng thể (UML Class Diagram)
*Biểu đồ thể hiện chi tiết các lớp, thuộc tính, phương thức và số lượng bản số (Multiplicity) giữa các thực thể.*

```mermaid
classDiagram
    class User {
        +int user_id
        +String username
        +String email
        +String password_hash
        +enum role
        +float balance
        +register()
        +login()
        +updateProfile()
    }
    
    class Category {
        +int category_id
        +String name
        +String slug
        +getAssets()
    }
    
    class Asset {
        +int asset_id
        +String title
        +float price
        +String thumbnail_url
        +String file_url
        +int downloads_count
        +int uploader_id
        +int category_id
        +uploadAsset()
        +download(user_id)
        +incrementDownloadCount()
    }
    
    class Review {
        +int review_id
        +int rating
        +String comment
        +DateTime created_at
        +int user_id
        +int asset_id
        +checkIfUserPurchased()
    }
    
    class Order {
        +int order_id
        +float total_amount
        +enum status
        +String payment_method
        +DateTime created_at
        +int user_id
        +processPayment()
        +updateStatus()
    }
    
    class OrderDetail {
        +int order_detail_id
        +float price_at_purchase
        +int order_id
        +int asset_id
        +getAssetDetails()
    }

    User "1" -- "0..*" Asset : Uploads
    User "1" -- "0..*" Order : Places
    User "1" -- "0..*" Review : Writes
    Category "1" -- "0..*" Asset : Contains
    Asset "1" -- "0..*" Review : Has
    Order "1" *-- "1..*" OrderDetail : Composed of
    Asset "1" -- "0..*" OrderDetail : Included in
