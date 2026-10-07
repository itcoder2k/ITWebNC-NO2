# HƯỚNG DẪN QUẢN TRỊ CƠ SỞ DỮ LIỆU (DATABASE GUIDE)
# DỰ ÁN: GAME ASSET MARKETPLACE (ITCH.IO SIMULATION)

Thư mục này quản lý toàn bộ cấu trúc và dữ liệu mẫu của Cơ sở dữ liệu **MySQL** (`GameAssetDB`) phục vụ đồ án môn học.

---

## 1. CẤU TRÚC THƯ MỤC DATABASE

```
database/
├── gameassets.sql # [1-CLICK] Bản gộp toàn diện Schema + Seeds (9 bảng)
├── schema.sql     # [DDL] Kịch bản tạo cấu trúc 9 bảng, khóa chính, khóa ngoại, chỉ mục
├── seeds.sql      # [DML] Kịch bản nạp dữ liệu mẫu phong phú (Users, Categories, Tags, Assets, Media...)
└── README.md      # Hướng dẫn chi tiết cách cài đặt và kết nối
```

Tất cả các tài nguyên cơ sở dữ liệu đều được lưu trữ tập trung và quy chuẩn bên trong thư mục `database/` này.

---

## 2. HƯỚNG DẪN KHỞI TẠO CSDL TRÊN MÁY CỤC BỘ (LOCAL SETUP)

### Cách 1: Sử dụng MySQL Workbench (Khuyến nghị)
1. Khởi động **MySQL Workbench** và kết nối tới Local MySQL Instance (Port 3306).
2. Vào menu **File** ➔ **Open SQL Script...** (hoặc ấn `Ctrl + Shift + O`).
3. Chọn file `schema.sql` (để tạo bảng), sau đó chọn biểu tượng **Tia sét (Execute)**.
4. Mở tiếp file `seeds.sql` (để nạp dữ liệu mẫu) và bấm **Execute**.
5. Nhìn vào bảng **SCHEMAS** bên trái, bấm nút **Refresh** để thấy database `GameAssetDB` cùng 9 bảng dữ liệu.

---

### Cách 2: Sử dụng Dòng lệnh (Command Line / Terminal)
Mở Terminal tại thư mục `database/` và chạy lệnh:
```bash
# Đăng nhập và tạo bảng
mysql -u root -p < schema.sql

# Nạp dữ liệu mẫu
mysql -u root -p < seeds.sql
```
*(Hệ thống sẽ hỏi mật khẩu root của MySQL trên máy bạn).*

---

## 3. TÀI KHOẢN MẪU DÙNG ĐỂ ĐĂNG NHẬP THỬ NGHIỆM

Tất cả tài khoản mẫu ban đầu đều có mật khẩu mặc định là: **`123456`**

| Tên đăng nhập (`username`) | Email | Vai trò (`role`) | Số dư ví ban đầu | Đặc điểm tài khoản |
| :--- | :--- | :---: | :---: | :--- |
| `admin` | `admin@gameasset.vn` | **Admin** | `$0.00` | Quản trị viên tối cao, duyệt danh mục |
| `ansimuz` | `ansimuz@creator.io` | **Creator** | `$320.00` | Tác giả Pixel Art bán SunnyLand, Cyberpunk |
| `kenney_nl` | `kenney@assets.org` | **Creator** | `$580.00` | Tác giả 3D Low-Poly và Audio SFX |
| `gamer_john` | `john@indiegamer.com` | **Customer** | `$45.00` | Khách mua hàng, đã mua asset #1 và #2 |
| `dev_sarah` | `sarah@scifigames.net` | **Customer** | `$120.00` | Khách mua hàng, đã mua asset #3 |

---

## 4. DANH SÁCH 9 BẢNG TRONG HỆ THỐNG

1. **`Users`**: Tài khoản người dùng, hồ sơ tác giả và số dư ví nội bộ.
2. **`Categories`**: Danh mục lớn (2D, 3D, Audio, VFX, GUI, Templates).
3. **`Tags`**: Thẻ gắn phân loại itch.io (`#pixel-art`, `#animated`, `#low-poly`...).
4. **`Assets`**: Bảng trung tâm lưu trữ thông tin sản phẩm, giá bán, đường dẫn tệp gốc an toàn.
5. **`AssetMedia`**: Gallery đa phương tiện xem trước (Ảnh chụp màn hình, ảnh động GIF, demo audio).
6. **`AssetTags`**: Bảng liên kết nhiều-nhiều giữa Asset và Tags.
7. **`Orders`**: Lịch sử đơn hàng và phiên giao dịch.
8. **`OrderDetails`**: Chi tiết món hàng trong đơn và lưu vết giá tại thời điểm mua.
9. **`Reviews`**: Đánh giá 1-5 sao và phản hồi từ những người mua thực tế (Verified Purchase).
