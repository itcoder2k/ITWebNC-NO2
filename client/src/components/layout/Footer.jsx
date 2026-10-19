import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-top border-light-subtle text-muted py-5 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div 
                className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '32px', height: '32px' }}
              >
                <i className="bi bi-controller fs-5"></i>
              </div>
              <span className="fs-5 fw-bold text-dark">
                GAME<span className="text-primary">MARKET</span>
              </span>
            </Link>
            <p className="small text-muted mb-3 pe-md-4" style={{ lineHeight: '1.6' }}>
              Nền tảng giao dịch và chia sẻ tài nguyên game trực tuyến dành riêng cho các Game Developer độc lập. Hỗ trợ mô hình PWYW và ví nội bộ an toàn.
            </p>
            <div className="d-flex gap-3 fs-5">
              <a href="#github" className="text-muted hover-primary"><i className="bi bi-github"></i></a>
              <a href="#discord" className="text-muted hover-primary"><i className="bi bi-discord"></i></a>
              <a href="#twitter" className="text-muted hover-primary"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>

          {/* Links 1: Danh mục */}
          <div className="col-6 col-md-2">
            <h6 className="text-dark fw-bold text-uppercase small mb-3">Danh Mục</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/blank?cat=2d" className="text-muted text-decoration-none">2D Sprites</Link></li>
              <li><Link to="/blank?cat=3d" className="text-muted text-decoration-none">3D Models</Link></li>
              <li><Link to="/blank?cat=audio" className="text-muted text-decoration-none">Âm thanh & SFX</Link></li>
              <li><Link to="/blank?cat=uikit" className="text-muted text-decoration-none">UI & HUD Kits</Link></li>
              <li><Link to="/blank?cat=free" className="text-primary text-decoration-none fw-semibold">Miễn phí (Freebies)</Link></li>
            </ul>
          </div>

          {/* Links 2: Dành cho Creator */}
          <div className="col-6 col-md-3">
            <h6 className="text-dark fw-bold text-uppercase small mb-3">Dành Cho Creator</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/blank?p=creator-guide" className="text-muted text-decoration-none">Hướng dẫn đăng bán</Link></li>
              <li><Link to="/blank?p=pwyw" className="text-muted text-decoration-none">Cơ chế Trả-Tùy-Tâm (PWYW)</Link></li>
              <li><Link to="/blank?p=wallet" className="text-muted text-decoration-none">Rút tiền & Ví điện tử</Link></li>
              <li><Link to="/blank?p=policy" className="text-muted text-decoration-none">Chính sách phí sàn (0%)</Link></li>
            </ul>
          </div>

          {/* Links 3: Đồ án Phenikaa */}
          <div className="col-12 col-md-3">
            <h6 className="text-dark fw-bold text-uppercase small mb-3">Đồ Án Web Nâng Cao</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li className="text-dark">Nhóm: <span className="text-primary fw-semibold">ITWebNC-NO2</span></li>
              <li className="text-dark">Trường: <span className="text-muted">Đại học Phenikaa</span></li>
              <li><Link to="/blank?p=about" className="text-muted text-decoration-none">Thông tin thành viên</Link></li>
              <li><Link to="/blank?p=terms" className="text-muted text-decoration-none">Điều khoản & Pháp lý</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-top border-light-subtle pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-muted">
          <div>© {new Date().getFullYear()} Game Asset Marketplace. All rights reserved.</div>
          <div className="d-flex gap-3">
            <Link to="/blank?p=privacy" className="text-muted text-decoration-none">Bảo mật</Link>
            <Link to="/blank?p=license" className="text-muted text-decoration-none">Giấy phép tài nguyên</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
