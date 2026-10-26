import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/assetApi';

// Icon và màu sắc trang trí tương ứng theo từng slug danh mục từ database
const categoryStyles = {
  '2d-game-assets': { icon: '👾', color: '#0284c7', tag: '2D Assets' },
  '3d-models': { icon: '🧊', color: '#8b5cf6', tag: '3D Models' },
  'audio-sfx': { icon: '🎵', color: '#10b981', tag: 'Âm thanh' },
  'gui-fonts': { icon: '🖼️', color: '#f59e0b', tag: 'UI & Fonts' },
  'visual-effects': { icon: '✨', color: '#ec4899', tag: 'Hiệu ứng VFX' }
};

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchCategories();
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Lỗi tải danh mục thực tế từ backend:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section 
      id="categories" 
      className="py-5"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        borderTop: '1px solid var(--border-color)',
        padding: '65px 0' 
      }}
    >
      <div className="container">
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <span 
            className="badge rounded-pill px-3 py-1.5 fw-semibold mb-2"
            style={{
              backgroundColor: 'rgba(2, 132, 199, 0.12)',
              color: 'var(--primary-color)',
              border: '1px solid rgba(2, 132, 199, 0.25)'
            }}
          >
            <i className="bi bi-grid-fill me-1"></i> Khám Phá Thư Viện
          </span>
          <h2 className="fw-bolder mb-2" style={{ fontSize: '28px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Danh Mục Tài Nguyên
          </h2>
          <p className="small mb-0" style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '580px', margin: '0 auto' }}>
            Dữ liệu danh mục thực tế được lấy từ cơ sở dữ liệu hệ thống
          </p>
        </div>

        {/* Lưới hiển thị danh mục thật */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2 small" style={{ color: 'var(--text-muted)' }}>Đang kết nối danh mục thực tế...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Chưa có danh mục nào trong cơ sở dữ liệu.</p>
          </div>
        ) : (
          <div className="row g-4">
            {categories.map((cat) => {
              const style = categoryStyles[cat.slug] || {
                icon: '🎮',
                color: '#0284c7',
                tag: 'Game Asset'
              };

              return (
                <div key={cat.category_id} className="col-12 col-sm-6 col-lg-3">
                  <Link
                    to={`/catalog?cat=${cat.slug || cat.category_id}`}
                    className="rn-theme-card h-100 p-4 text-decoration-none shadow-sm d-flex flex-column justify-content-between"
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontSize: '36px' }}>{style.icon}</span>
                        <span 
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            backgroundColor: `${style.color}18`,
                            color: style.color,
                            border: `1px solid ${style.color}35`
                          }}
                        >
                          {style.tag}
                        </span>
                      </div>
                      
                      <h3 className="fw-bold mb-2" style={{ fontSize: '17px', color: 'var(--text-main)' }}>
                        {cat.name}
                      </h3>
                      
                      <p className="small mb-4" style={{ color: 'var(--text-muted)', lineHeight: '1.5', minHeight: '42px' }}>
                        {cat.description || 'Khám phá các gói tài nguyên thuộc danh mục này.'}
                      </p>
                    </div>

                    <div 
                      className="d-flex justify-content-between align-items-center pt-3 small"
                      style={{ borderTop: '1px solid var(--border-color)' }}
                    >
                      <span className="fw-medium text-muted d-inline-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                        <i className="bi bi-box-seam"></i> Gói tài nguyên
                      </span>
                      <span className="fw-bold d-flex align-items-center gap-1" style={{ color: style.color }}>
                        Xem ngay <i className="bi bi-arrow-right"></i>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
