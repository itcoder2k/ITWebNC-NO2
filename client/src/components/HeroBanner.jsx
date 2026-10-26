import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function HeroBanner() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const quickTags = [
    { label: '#PixelArt', query: 'pixel' },
    { label: '#3DModels', query: '3d' },
    { label: '#Unity', query: 'unity' },
    { label: '#Godot', query: 'godot' },
    { label: '#AudioSFX', query: 'audio' },
    { label: '#FreePWYW', cat: 'free' }
  ];

  return (
    <section 
      className="text-center position-relative overflow-hidden py-5"
      style={{
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.25s ease',
        paddingTop: '85px',
        paddingBottom: '75px'
      }}
    >
      {/* Hiệu ứng ánh sáng nền Ambient Glow */}
      <div className="rn-glow-bg"></div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        
        {/* Badge Pill Phát Sáng */}
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-4 shadow-sm"
          style={{
            background: 'rgba(2, 132, 199, 0.1)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            color: 'var(--primary-color)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}
        >
          <span className="spinner-grow spinner-grow-sm text-info" style={{ width: '8px', height: '8px' }} role="status"></span>
          <span>NỀN TẢNG TÀI NGUYÊN GAME INDIE CHUẨN ENGINE 2026</span>
        </div>

        {/* Tiêu đề chính với hiệu ứng Gradient Text */}
        <h1 className="rn-hero-title mb-3">
          Sàn Giao Dịch & Quản Lý <br />
          <span className="rn-gradient-text">Tài Nguyên Game Trực Tuyến</span>
        </h1>

        {/* Mô tả phụ */}
        <p className="rn-hero-desc mb-4" style={{ fontSize: '1.1rem' }}>
          Hơn 10,000+ 2D Sprites, 3D Models, Âm thanh SFX và UI Kits bản quyền tối ưu cho Unity, Godot & Unreal Engine.
          Tích hợp cơ chế Trả-Tùy-Tâm (PWYW) và ví điện tử an toàn 100%.
        </p>

        {/* Thanh Tìm Kiếm Lớn Trọng Tâm (Central Hero Search Bar) */}
        <form onSubmit={handleSearch} className="rn-hero-search mb-3">
          <i className="bi bi-search fs-5 text-muted"></i>
          <input 
            type="text"
            placeholder="Tìm kiếm kiếm sĩ pixel, mô hình vũ khí 3D, âm thanh SFX..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-inline-flex align-items-center gap-1.5"
            style={{ height: '42px', fontSize: '14px' }}
          >
            <span>Tìm kiếm</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </form>

        {/* Các Tag gợi ý tìm nhanh */}
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap mb-5">
          <span className="small text-muted fw-semibold me-1">Gợi ý nhanh:</span>
          {quickTags.map((tag, idx) => (
            <Link 
              key={idx} 
              to={tag.cat ? `/catalog?cat=${tag.cat}` : `/catalog?search=${tag.query}`} 
              className="rn-chip"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        {/* Nút Call To Action */}
        <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mb-5">
          <Link to="/catalog" className="rn-btn-pill rn-btn-primary shadow-sm" style={{ minWidth: '190px' }}>
            <i className="bi bi-compass"></i> Khám phá kho Asset
          </Link>
          <a href="#demo-preview" className="rn-btn-pill rn-btn-secondary shadow-sm" style={{ minWidth: '190px' }}>
            <i className="bi bi-play-circle"></i> Xem Demo tương tác
          </a>
        </div>

        {/* Hàng Thống kê tạo lòng tin (Trust & Stats Bar) */}
        <div className="row g-3 justify-content-center pt-2" style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-4 border text-start" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-box-seam fs-5 text-info"></i>
                <span className="fw-bolder fs-5" style={{ color: 'var(--text-main)' }}>10,000+</span>
              </div>
              <div className="small text-muted" style={{ fontSize: '12px' }}>Tài nguyên đã chuẩn hóa</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-4 border text-start" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-shield-check fs-5 text-success"></i>
                <span className="fw-bolder fs-5" style={{ color: 'var(--text-main)' }}>100%</span>
              </div>
              <div className="small text-muted" style={{ fontSize: '12px' }}>Bản quyền CC & Thương mại</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-4 border text-start" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-currency-dollar fs-5 text-warning"></i>
                <span className="fw-bolder fs-5" style={{ color: 'var(--text-main)' }}>0% Sàn</span>
              </div>
              <div className="small text-muted" style={{ fontSize: '12px' }}>Cơ chế Trả-Tùy-Tâm (PWYW)</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-4 border text-start" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-lightning-charge fs-5 text-primary"></i>
                <span className="fw-bolder fs-5" style={{ color: 'var(--text-main)' }}>Tức thì</span>
              </div>
              <div className="small text-muted" style={{ fontSize: '12px' }}>Tải file & Import trực tiếp</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
