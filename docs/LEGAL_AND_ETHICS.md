# TUÂN THỦ PHÁP LÝ, ĐẠO ĐỨC NGHỀ NGHIỆP & BẢO VỆ DỮ LIỆU
## TIÊU CHUẨN: LEGAL, ETHICAL, SOCIAL & PROFESSIONAL ASPECTS

> Tài liệu phân tích việc áp dụng các tiêu chuẩn pháp lý, đạo đức và quy định bảo vệ dữ liệu người dùng trong Sàn giao dịch tài nguyên game.

---

## 1. QUẢN LÝ QUYỀN RIÊNG TƯ & DỮ LIỆU CÁ NHÂN (DATA PROTECTION - GDPR)

Theo quy định chung về bảo vệ dữ liệu (General Data Protection Regulation - GDPR):
1. **Thu thập dữ liệu tối thiểu (Data Minimization):** Hệ thống chỉ yêu cầu các thông tin tối thiểu cần thiết để phục vụ định danh (`username`, `email`) và giao dịch ví. Không thu thập số CMND/CCCD hoặc thông tin nhạy cảm khi chưa cần thiết.
2. **Quyền được lãng quên & Kiểm soát thông tin cá nhân:** Người dùng có quyền truy cập, chỉnh sửa thông tin cá nhân (`PUT /api/users/profile`) hoặc yêu cầu xóa dữ liệu thông qua quản trị viên.
3. **Mã hóa dữ liệu nhạy cảm:** Mật khẩu người dùng bắt buộc mã hóa bằng thuật toán `bcrypt` trước khi lưu vào CSDL. Quản trị viên hệ thống cũng không thể đọc được mật khẩu thô của người dùng.

---

## 2. CHÍNH SÁCH COOKIE CONSENT (OPT-IN / OPT-OUT)

Căn cứ theo chỉ thị quyền riêng tư điện tử (ePrivacy Directive & PECR):
- Mọi trang web sử dụng công nghệ lưu trữ phía Client (Cookies, LocalStorage) đều phải thông báo minh bạch cho người dùng.
- Hệ thống tích hợp **Cookie & Storage Consent Banner** trên giao diện:
  - Thông báo rõ ràng việc lưu trữ JWT trong `localStorage` chỉ nhằm mục đích kỹ thuật thiết yếu (Strictly Necessary): duy trì phiên đăng nhập và bảo mật ví tài khoản.
  - Người dùng có nút xác nhận **"Đã hiểu & Đồng ý"** trước khi sử dụng các dịch vụ có đăng nhập.

---

## 3. BẢN QUYỀN SỐ VÀ CẤP PHÉP TÀI NGUYÊN GAME (DIGITAL INTELLECTUAL PROPERTY & LICENSING)

Đặc thù của tài nguyên game số (2D Sprites, 3D Models, Music FX) đòi hỏi tính minh bạch cao về quyền sở hữu trí tuệ:
1. **Minh bạch loại giấy phép (License Transparency):** Mỗi tài nguyên đăng tải trên sàn đều phải được gắn nhãn giấy phép rõ ràng:
   - **CC0 (Creative Commons Zero):** Tác giả từ bỏ toàn bộ bản quyền, người tải được tự do sử dụng cho mục đích cá nhân lẫn thương mại.
   - **CC-BY (Creative Commons Attribution):** Được phép sử dụng thương mại trong game, nhưng bắt buộc phải ghi tên tác giả trong phần Credits.
   - **Commercial Indie License:** Chỉ được tích hợp vào sản phẩm game hoàn chỉnh, nghiêm cấm hành vi đóng gói lại và bán lại (Resale) tệp gốc.
2. **Cơ chế tải file bảo vệ (Protected Download Streaming):** Hệ thống không public link tệp gốc (`.zip`) ra ngoài Internet để ngăn chặn hành vi tải lậu (Hotlinking / Leeching). Chỉ những tài khoản đã mua hợp lệ mới được cấp luồng stream file từ server.
