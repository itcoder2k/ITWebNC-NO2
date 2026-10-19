import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: '2d',
    title: '2D Sprites & Pixel Art',
    desc: 'Nhân vật, tileset bản đồ, hoạt ảnh chuyển động cắt nhỏ cho Unity, Godot & Unreal.',
    icon: '👾',
    count: '1,240+ assets',
    tag: 'Phổ biến',
    color: '#0284c7',
    badgeBg: 'rgba(2, 132, 199, 0.1)'
  },
  {
    id: '3d',
    title: '3D Models & Low-Poly',
    desc: 'Mô hình vật thể 3D, xe cộ, vũ khí, texture PBR chuẩn định dạng .FBX, .OBJ, .GLTF.',
    icon: '🧊',
    count: '850+ models',
    tag: 'Trending',
    color: '#8b5cf6',
    badgeBg: 'rgba(139, 92, 246, 0.1)'
  },
  {
    id: 'audio',
    title: 'Âm thanh & SFX Bản quyền',
    desc: 'Nhạc nền vòng lặp (BGM), hiệu ứng chém, bắn súng, âm thanh môi trường chuẩn wav/mp3.',
    icon: '🎵',
    count: '2,100+ tracks',
    tag: 'Royalty-Free',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.1)'
  },
  {
    id: 'uikit',
    title: 'Game UI Kits & HUD',
    desc: 'Giao diện bảng máu, nút bấm, menu cài đặt, khung hội thoại và font chữ game retro.',
    icon: '🖼️',
    count: '620+ packs',
    tag: 'Vector & PSD',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.1)'
  }
];

export default function FeaturedCategories() {
  return (
    <section 
      id="categories" 
      className="py-5"
      style={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '65px 0' 
      }}
    >
      <div className="container">
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <span 
            className="badge rounded-pill px-3 py-2 fw-semibold mb-2"
            style={{
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              color: '#0284c7',
              border: '1px solid rgba(2, 132, 199, 0.2)'
            }}
          >
            <i className="bi bi-grid-fill me-1"></i> Khám Phá Thư Viện
          </span>
          <h2 className="fw-bolder text-dark mb-2" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
            Danh Mục Tài Nguyên Trọng Tâm
          </h2>
          <p className="text-muted" style={{ fontSize: '15px', maxWidth: '580px', margin: '0 auto' }}>
            Được phân loại khoa học giúp lập trình viên game tìm kiếm nhanh chóng và chính xác
          </p>
        </div>

        {/* Grid 4 Cards */}
        <div className="row g-4">
          {categories.map((cat) => (
            <div key={cat.id} className="col-12 col-sm-6 col-lg-3">
              <Link
                to={`/blank?cat=${cat.id}`}
                className="card h-100 p-4 rounded-4 text-decoration-none shadow-sm card-hover"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cat.color;
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 12px 24px -6px ${cat.badgeBg.replace('0.1', '0.25')}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05)';
                }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontSize: '36px' }}>{cat.icon}</span>
                    <span 
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        backgroundColor: cat.badgeBg,
                        color: cat.color,
                        border: `1px solid ${cat.color}30`
                      }}
                    >
                      {cat.tag}
                    </span>
                  </div>
                  
                  <h3 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>
                    {cat.title}
                  </h3>
                  
                  <p className="text-muted small mb-4" style={{ lineHeight: '1.5', minHeight: '42px' }}>
                    {cat.desc}
                  </p>
                </div>

                <div 
                  className="d-flex justify-content-between align-items-center pt-3 small"
                  style={{ borderTop: '1px solid #f1f5f9' }}
                >
                  <span className="text-muted fw-medium">{cat.count}</span>
                  <span className="fw-bold d-flex align-items-center gap-1" style={{ color: cat.color }}>
                    Xem ngay <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
