import React from 'react';
import { Link } from 'react-router-dom';

export default function FrameworkCards() {
  const cards = [
    {
      title: 'Hỗ Trợ Đa Game Engine',
      desc: 'Tương thích tức thì với Unity, Unreal Engine, Godot và Cocos Creator thông qua các tệp xuất chuẩn .FBX, .GLTF, .PNG Atlas và .WAV.',
      icon: 'bi-controller',
      color: '#087ea4',
      bg: 'rgba(8, 126, 164, 0.12)',
      link: '/catalog'
    },
    {
      title: 'Tự Do Bản Quyền & Thương Mại',
      desc: 'Minh bạch giấy phép sử dụng CC-BY và Commercial License. Sử dụng cho cả sản phẩm cá nhân lẫn game thương mại phát hành trên Steam, Google Play, App Store.',
      icon: 'bi-shield-check',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      link: '/blank?topic=terms'
    },
    {
      title: 'Cơ Chế Trả-Tùy-Tâm (PWYW)',
      desc: 'Người mua có thể tự do đặt giá cao hơn để ủng hộ tác giả. Kết hợp ví điện tử nội bộ nạp/rút tức thì và chính sách chiết khấu 0% bảo vệ trọn vẹn Creator.',
      icon: 'bi-wallet2',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.12)',
      link: '/blank?topic=conduct'
    }
  ];

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="container py-4">
        
        {/* Section title */}
        <div className="text-center mb-5">
          <h2 className="fw-bolder mb-2" style={{ fontSize: '32px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Nền Tảng Vững Chắc Cho Mọi Dự Án Game
          </h2>
          <p className="small mb-0" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15px', color: 'var(--text-muted)' }}>
            Giảm thiểu 70% thời gian dựng hình ảnh và làm âm thanh để bạn tập trung hoàn toàn vào gameplay cốt lõi.
          </p>
        </div>

        {/* 3 Columns matching React Native Expo / Framework cards */}
        <div className="row g-4">
          {cards.map((card, idx) => (
            <div className="col-12 col-md-4" key={idx}>
              <div className="rn-theme-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3" 
                    style={{ backgroundColor: card.bg, height: '70px', borderRadius: '14px' }}
                  >
                    <i className={`bi ${card.icon}`} style={{ fontSize: '32px', color: card.color }}></i>
                  </div>
                  <h4 className="fw-bold mb-2" style={{ fontSize: '18px', color: 'var(--text-main)' }}>
                    {card.title}
                  </h4>
                  <p className="small mb-3" style={{ lineHeight: '1.6', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    {card.desc}
                  </p>
                </div>
                <Link to={card.link || '/catalog'} className="fw-semibold text-decoration-none small d-inline-flex align-items-center gap-1" style={{ color: card.color }}>
                  Tìm hiểu thêm <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
