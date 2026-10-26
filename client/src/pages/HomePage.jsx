import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/HeroBanner';
import InteractiveDemo from '../components/InteractiveDemo';
import FeaturedCategories from '../components/FeaturedCategories';
import FrameworkCards from '../components/FrameworkCards';
import { fetchAssets } from '../services/assetApi';

export default function HomePage() {
  const [featuredAssets, setFeaturedAssets] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetsError, setAssetsError] = useState('');

  const loadAssets = async () => {
    setIsLoadingAssets(true);
    setAssetsError('');
    try {
      const data = await fetchAssets();
      if (Array.isArray(data)) {
        // Lấy tối đa 8 sản phẩm thật mới nhất từ CSDL
        setFeaturedAssets(data.slice(0, 8));
      }
    } catch (err) {
      console.error('Không kết nối được API /assets thật:', err);
      setAssetsError('Không thể kết nối đến máy chủ Backend hoặc CSDL MySQL. Vui lòng kiểm tra lại dịch vụ.');
    } finally {
      setIsLoadingAssets(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 1. Header Navbar */}
      <Navbar />

      <main className="flex-grow-1">
        {/* 2. Hero Section */}
        <HeroBanner />

        {/* 3. Interactive Showcase (Mockup trực quan) */}
        <InteractiveDemo />

        {/* 4. Giá trị cốt lõi / Phân hệ chức năng */}
        <FrameworkCards />

        {/* 5. Danh mục tài nguyên thật (Gọi API /categories) */}
        <div id="assets">
          <FeaturedCategories />
        </div>

        {/* 6. Showcase Sản phẩm THẬT (Gọi API /assets từ Backend) */}
        <section className="py-5" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container py-3">
            <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
              <div>
                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 mb-2 fw-semibold">
                  <i className="bi bi-fire me-1"></i> Kho Dữ Liệu Thực Tế
                </span>
                <h2 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Tài Nguyên Game Trong Hệ Thống
                </h2>
                <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                  Dữ liệu tài nguyên được tải trực tiếp từ cơ sở dữ liệu MySQL thông qua API NestJS
                </p>
              </div>
              <Link to="/catalog" className="btn btn-outline-info rounded-pill px-4 btn-sm fw-semibold d-inline-flex align-items-center gap-2">
                Xem toàn bộ kho hàng <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {/* Trạng thái tải dữ liệu với Skeleton Shimmer chuẩn UX */}
            {isLoadingAssets ? (
              <div className="row g-4">
                {[1, 2, 3, 4].map((i) => (
                  <div className="col-12 col-sm-6 col-lg-3" key={i}>
                    <div className="card h-100 rn-theme-card overflow-hidden shadow-sm p-0">
                      <div className="rn-skeleton" style={{ height: '175px', borderRadius: '16px 16px 0 0' }}></div>
                      <div className="p-3">
                        <div className="rn-skeleton mb-2" style={{ height: '14px', width: '55%' }}></div>
                        <div className="rn-skeleton mb-2" style={{ height: '18px', width: '85%' }}></div>
                        <div className="rn-skeleton mb-3" style={{ height: '34px', width: '100%' }}></div>
                        <div className="d-flex justify-content-between pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                          <div className="rn-skeleton" style={{ height: '14px', width: '35%' }}></div>
                          <div className="rn-skeleton" style={{ height: '14px', width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : assetsError ? (
              /* Hiển thị thông báo khi lỗi kết nối */
              <div className="text-center py-5 my-4 rn-theme-card p-4 border border-danger-subtle">
                <div className="display-4 mb-3 text-danger"><i className="bi bi-exclamation-triangle-fill"></i></div>
                <h5 className="fw-bold text-danger mb-2">Lỗi Kết Nối Dữ Liệu</h5>
                <p className="small mb-3" style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                  {assetsError}
                </p>
                <button onClick={loadAssets} className="btn btn-outline-danger rounded-pill px-4 btn-sm mt-3 fw-semibold">
                  <i className="bi bi-arrow-clockwise me-1"></i> Thử lại kết nối
                </button>
              </div>
            ) : featuredAssets.length === 0 ? (
              /* Hiển thị thông báo khi CSDL rỗng */
              <div className="text-center py-5 my-4 rn-theme-card p-4">
                <div className="display-4 mb-3 text-muted"><i className="bi bi-inbox"></i></div>
                <h5 className="fw-bold" style={{ color: 'var(--text-main)' }}>Chưa có tài nguyên nào trong cơ sở dữ liệu</h5>
                <p className="small mb-3" style={{ color: 'var(--text-muted)' }}>
                  Hãy khởi động Backend và thêm các asset đầu tiên qua API hoặc trang Đăng bán.
                </p>
                <Link to="/catalog" className="btn btn-primary rounded-pill px-4 btn-sm">
                  Truy cập Catalog
                </Link>
              </div>
            ) : (
              /* Lưới hiển thị các sản phẩm THẬT 100% */
              <div className="row g-4">
                {featuredAssets.map((asset) => {
                  const priceNum = Number(asset.price);
                  const isFree = !priceNum || priceNum === 0;
                  return (
                    <div className="col-12 col-sm-6 col-lg-3" key={asset.asset_id}>
                      <div className="card h-100 rn-theme-card overflow-hidden shadow-sm">
                        <Link to={`/assets/${asset.asset_id}`} className="position-relative d-block overflow-hidden bg-light" style={{ height: '175px' }}>
                          <img
                            src={asset.thumbnail_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}
                            alt={asset.title}
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <span 
                            className="badge position-absolute top-0 start-0 m-2 rounded-pill px-2.5 py-1 shadow-sm fw-semibold"
                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', color: '#ffffff', fontSize: '11px' }}
                          >
                            <i className="bi bi-controller me-1"></i> Asset #{asset.asset_id}
                          </span>
                          <span
                            className={`badge position-absolute top-0 end-0 m-2 rounded-pill px-2.5 py-1.5 shadow-sm fw-bold ${
                              isFree ? 'bg-success text-white' : 'bg-primary text-white'
                            }`}
                          >
                            {isFree ? 'FREE (PWYW)' : `${priceNum.toLocaleString('vi-VN')} đ +`}
                          </span>
                        </Link>
                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex align-items-center justify-content-between small mb-1" style={{ color: 'var(--text-muted)' }}>
                              <span className="d-flex align-items-center gap-1 text-truncate" style={{ maxWidth: '140px' }}>
                                <i className="bi bi-person-circle"></i>
                                {asset.uploader_name || (asset.uploader_id ? `Creator #${asset.uploader_id}` : 'Indie Creator')}
                              </span>
                              <span className="text-warning small fw-semibold">
                                <i className="bi bi-star-fill me-0.5"></i> 4.9
                              </span>
                            </div>
                            <h6 className="card-title fw-bold mb-1 text-truncate">
                              <Link to={`/assets/${asset.asset_id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                                {asset.title}
                              </Link>
                            </h6>
                            <div className="d-flex align-items-center gap-1 mb-2">
                              <span className="badge rounded-pill bg-info-subtle text-info border border-info-subtle" style={{ fontSize: '9.5px', padding: '2px 7px' }}>Unity</span>
                              <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '9.5px', padding: '2px 7px' }}>Godot</span>
                              <span className="badge rounded-pill bg-secondary-subtle text-secondary" style={{ fontSize: '9.5px', padding: '2px 7px' }}>CC-BY</span>
                            </div>
                            <p className="card-text small line-clamp-2 mb-3" style={{ color: 'var(--text-muted)', minHeight: '38px', fontSize: '13px' }}>
                              {asset.short_description || asset.description || 'Gói tài nguyên game chất lượng cao.'}
                            </p>
                          </div>
                          <div className="d-flex align-items-center justify-content-between pt-2 small" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                            <span><i className="bi bi-download me-1"></i>{asset.downloads_count || 0} tải</span>
                            <Link to={`/assets/${asset.asset_id}`} className="text-info fw-semibold text-decoration-none d-inline-flex align-items-center gap-1">
                              Chi tiết <i className="bi bi-chevron-right small"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 7. CTA Banner cuối trang (Kêu gọi Creator & Game Dev itch.io style) */}
        <section className="py-5" style={{ backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container py-2">
            <div 
              className="p-4 p-md-5 rounded-4 position-relative overflow-hidden shadow-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(8, 126, 164, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
                border: '1.5px solid var(--border-color)'
              }}
            >
              <div className="row align-items-center g-4">
                <div className="col-12 col-lg-8">
                  <span className="badge bg-primary text-white px-3 py-1.5 rounded-pill mb-3 fw-bold">
                    <i className="bi bi-stars me-1"></i> Cộng Đồng Game Indie
                  </span>
                  <h2 className="fw-bolder mb-2" style={{ fontSize: '28px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    Sẵn Sàng Phát Triển Tựa Game Trong Mơ?
                  </h2>
                  <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '640px' }}>
                    Cho dù bạn là Game Developer đang tìm kiếm asset chất lượng cao, hay Creator muốn đăng bán kiếm thêm thu nhập với 0% chiết khấu sàn — GameAsset luôn đồng hành cùng bạn.
                  </p>
                </div>
                <div className="col-12 col-lg-4 text-lg-end">
                  <div className="d-flex flex-wrap gap-2.5 justify-content-lg-end">
                    <Link to="/upload" className="rn-btn-pill rn-btn-primary px-4 py-2.5 shadow-sm text-decoration-none">
                      <i className="bi bi-cloud-arrow-up me-1"></i> Bắt đầu Đăng bán
                    </Link>
                    <Link to="/catalog" className="rn-btn-pill rn-btn-secondary px-4 py-2.5 shadow-sm text-decoration-none">
                      <i className="bi bi-compass me-1"></i> Khám phá kho
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
