import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section 
      className="py-5 text-center position-relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(2, 132, 199, 0.08) 0%, rgba(255, 255, 255, 0) 70%), #ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '75px 16px 65px'
      }}
    >
      <div className="container">
        
        {/* 1. Icon Game / Tay cầm lớn ở chính giữa */}
        <div 
          className="d-inline-flex align-items-center justify-content-center shadow-lg mb-4"
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
            boxShadow: '0 12px 28px -6px rgba(2, 132, 199, 0.35)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
        >
          <i className="bi bi-controller text-white" style={{ fontSize: '48px' }}></i>
        </div>

        {/* 2. Dòng chữ to tiêu đề */}
        <h1 
          className="fw-bolder mb-3"
          style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)',
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.25
          }}
        >
          Sàn Giao Dịch & Quản Lý <br />
          <span 
            style={{
              background: 'linear-gradient(90deg, #0284c7 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Tài Nguyên Game
          </span>
        </h1>

        {/* Đoạn mô tả súc tích */}
        <p 
          className="mx-auto mb-4"
          style={{
            maxWidth: '640px',
            fontSize: '1.1rem',
            color: '#64748b',
            lineHeight: 1.6
          }}
        >
          Khám phá hàng ngàn 2D Sprites, 3D Models, Âm thanh SFX và UI Kits bản quyền 
          từ cộng đồng sáng tạo game độc lập.
        </p>

        {/* 3. Hai nút bo tròn (Pill Buttons) */}
        <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
          {/* Nút 1: Khám phá ngay (trỏ về #assets) */}
          <a
            href="#assets"
            className="btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
            style={{
              backgroundColor: '#0284c7',
              borderColor: '#0284c7',
              color: '#ffffff',
              fontSize: '15px',
              padding: '11px 28px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0369a1';
              e.currentTarget.style.borderColor = '#0369a1';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(2, 132, 199, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0284c7';
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="bi bi-compass fs-6"></i>
            Khám phá ngay
          </a>

          {/* Nút 2: Tải lên tài nguyên (trỏ về /blank) */}
          <Link
            to="/blank"
            className="btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#1e293b',
              fontSize: '15px',
              padding: '11px 28px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className="bi bi-cloud-arrow-up fs-6 text-primary"></i>
            Tải lên tài nguyên
          </Link>
        </div>

      </div>
    </section>
  );
}
