import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#141518',
      borderTop: '1px solid #2e3035',
      padding: '60px 0 30px',
      color: '#9aa0a6',
      fontSize: '14px'
    }}>
      <div className="container">
        {/* 4 Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px' }}>🕹️</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                GAME<span style={{ color: '#00d2ff' }}>ASSET</span>
              </span>
            </div>
            <p style={{ lineHeight: '1.6', fontSize: '13px' }}>
              Nền tảng chia sẻ và giao dịch tài nguyên đồ họa, âm thanh và mã nguồn dành riêng cho các Game Developer độc lập.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Khám Phá
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/blank?cat=2d" style={{ color: '#9aa0a6' }}>2D Sprites & Tilesets</Link></li>
              <li><Link to="/blank?cat=3d" style={{ color: '#9aa0a6' }}>3D Models & Low-poly</Link></li>
              <li><Link to="/blank?cat=audio" style={{ color: '#9aa0a6' }}>Âm thanh & Hiệu ứng SFX</Link></li>
              <li><Link to="/blank?cat=free" style={{ color: '#9aa0a6' }}>Tài nguyên Miễn phí</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Dành Cho Creator
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/blank?p=creator-guidelines" style={{ color: '#9aa0a6' }}>Quy định đăng tải Asset</Link></li>
              <li><Link to="/blank?p=pwyw" style={{ color: '#9aa0a6' }}>Cơ chế giá Trả-Tùy-Tâm (PWYW)</Link></li>
              <li><Link to="/blank?p=wallet" style={{ color: '#9aa0a6' }}>Ví điện tử & Rút tiền</Link></li>
              <li><Link to="/blank?p=revenue" style={{ color: '#9aa0a6' }}>Chính sách chiết khấu (0%)</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Cộng Đồng & Đồ Án
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><span style={{ color: '#d1d5db' }}>Môn: Thiết Kế Web Nâng Cao</span></li>
              <li><span style={{ color: '#d1d5db' }}>Đề tài: Game Asset Marketplace</span></li>
              <li><Link to="/blank?p=contact" style={{ color: '#9aa0a6' }}>Nhóm phát triển NO2</Link></li>
              <li><Link to="/blank?p=terms" style={{ color: '#9aa0a6' }}>Điều khoản & Bản quyền</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid #24252a',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px'
        }}>
          <div>© {new Date().getFullYear()} Game Asset Marketplace. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/blank?p=privacy" style={{ color: '#6b7280' }}>Chính sách bảo mật</Link>
            <Link to="/blank?p=license" style={{ color: '#6b7280' }}>Giấy phép CC-BY / Commercial</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
