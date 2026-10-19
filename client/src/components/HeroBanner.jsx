import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section style={{
      padding: '70px 0 60px',
      textAlign: 'center',
      background: 'radial-gradient(circle at 50% 20%, rgba(0, 210, 255, 0.12) 0%, rgba(24, 25, 26, 0) 70%)',
      borderBottom: '1px solid #2e3035'
    }}>
      <div className="container">
        {/* Placeholder: Icon game tỏa hào quang (Hưng sẽ hoàn thiện thêm animation) */}
        <div style={{
          width: '90px',
          height: '90px',
          margin: '0 auto 24px',
          borderRadius: '26px',
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(58, 123, 213, 0.2) 100%)',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '44px',
          boxShadow: '0 0 35px rgba(0, 210, 255, 0.25)'
        }}>
          🎮
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '44px',
          fontWeight: '800',
          letterSpacing: '-1px',
          lineHeight: '1.2',
          marginBottom: '18px',
          color: '#ffffff'
        }}>
          Sàn Giao Dịch & Quản Lý <br />
          <span style={{
            background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Tài Nguyên Game Trực Tuyến
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '17px',
          color: '#9aa0a6',
          maxWidth: '680px',
          margin: '0 auto 32px',
          lineHeight: '1.6'
        }}>
          Khám phá hàng ngàn 2D Sprites, 3D Models, Âm thanh & UI Kit chất lượng cao từ cộng đồng Game Developer. Tối ưu quy trình phát triển game độc lập của bạn.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a href="#categories" className="btn-pill btn-primary" style={{ padding: '12px 30px', fontSize: '15px' }}>
            Khám phá tài nguyên →
          </a>
          <Link to="/blank?role=creator" className="btn-pill btn-secondary" style={{ padding: '12px 30px', fontSize: '15px' }}>
            Dành cho Nhà phát triển (Creator)
          </Link>
        </div>
      </div>
    </section>
  );
}
