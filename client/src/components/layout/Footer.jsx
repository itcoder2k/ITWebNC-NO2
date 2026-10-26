import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="rn-footer py-5 mt-auto">
      <div className="container py-3">
        
        {/* 4 Cột chuẩn giao diện React Native Docs */}
        <div className="row g-4 mb-5">
          
          {/* Cột 1: DEVELOP / PHÁT TRIỂN */}
          <div className="col-6 col-md-3">
            <h6>PHÁT TRIỂN</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/blank?topic=showcase">Hướng dẫn tích hợp</Link></li>
              <li><Link to="/catalog?cat=2d-game-assets">2D Sprites</Link></li>
              <li><Link to="/catalog?cat=3d-models">3D Models</Link></li>
              <li><Link to="/catalog?cat=audio-sfx">Âm thanh & SFX</Link></li>
              <li><Link to="/catalog?cat=gui-fonts">UI Kits & HUD</Link></li>
            </ul>
          </div>

          {/* Cột 2: PARTICIPATE / CỘNG ĐỒNG (Đã gán Route cụ thể đến trang thông tin chuyên biệt) */}
          <div className="col-6 col-md-3">
            <h6>CỘNG ĐỒNG</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/blank?topic=showcase">Showcase sản phẩm</Link></li>
              <li><Link to="/blank?topic=contribute">Đóng góp tài nguyên</Link></li>
              <li><Link to="/blank?topic=forum">Diễn đàn Game Dev</Link></li>
              <li><Link to="/blank?topic=conduct">Quy tắc ứng xử</Link></li>
            </ul>
          </div>

          {/* Cột 3: FIND US / KẾT NỐI */}
          <div className="col-6 col-md-3">
            <h6>KẾT NỐI</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <i className="bi bi-box-arrow-up-right small"></i></a></li>
              <li><a href="https://discord.com" target="_blank" rel="noreferrer">Discord <i className="bi bi-box-arrow-up-right small"></i></a></li>
              <li><a href="https://x.com" target="_blank" rel="noreferrer">Twitter (X) <i className="bi bi-box-arrow-up-right small"></i></a></li>
              <li><Link to="/blank?topic=forum">Blog tin tức</Link></li>
            </ul>
          </div>

          {/* Cột 4: LEGAL / PHÁP LÝ & ĐỒ ÁN */}
          <div className="col-6 col-md-3">
            <h6>ĐỒ ÁN PHENIKAA</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li className="fw-semibold" style={{ color: 'var(--footer-title)' }}>
                Nhóm: ITWebNC-NO2
              </li>
              <li style={{ color: 'var(--footer-text)' }}>
                Đại học Phenikaa
              </li>
              <li><Link to="/blank?topic=privacy">Chính sách bảo mật</Link></li>
              <li><Link to="/blank?topic=terms">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

        </div>

        {/* Dòng bản quyền dưới cùng + Nút cuộn lên đầu trang */}
        <div 
          className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 pt-4"
          style={{ borderTop: '1.5px solid var(--footer-border)' }}
        >
          <div className="d-flex align-items-center gap-2 fw-bold" style={{ color: 'var(--footer-title)' }}>
            <i className="bi bi-controller fs-5" style={{ color: 'var(--primary-color)' }}></i>
            <span>GameAsset Marketplace</span>
          </div>

          <p className="small mb-0 text-center text-md-start" style={{ color: 'var(--footer-text)' }}>
            Copyright © {new Date().getFullYear()} GameAsset. Đồ án môn Thiết kế Web Nâng Cao.
          </p>

          <button 
            type="button" 
            onClick={scrollToTop}
            className="btn btn-sm rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center gap-1.5"
            style={{ 
              backgroundColor: 'var(--card-header-bg)', 
              color: 'var(--footer-title)', 
              border: '1px solid var(--border-color)',
              fontSize: '12.5px'
            }}
            title="Cuộn lên đầu trang"
          >
            <i className="bi bi-arrow-up"></i> Đầu trang
          </button>
        </div>

      </div>
    </footer>
  );
}
