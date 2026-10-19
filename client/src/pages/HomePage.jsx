import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Thành viên 1: Navbar / Header + AuthModal + CartBadge + UserMenuDropdown */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow-1">
        
        {/* Hero Section sáng sủa, thanh lịch */}
        <section className="py-5 text-center bg-white border-bottom border-light-subtle position-relative overflow-hidden">
          <div className="container py-5">
            <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3 fw-semibold">
              <i className="bi bi-stars me-1"></i> Sàn Giao Dịch Tài Nguyên Game Trực Tuyến
            </span>
            <h1 className="display-4 fw-bolder text-dark mb-3 tracking-tight">
              Khám Phá & Chia Sẻ <br />
              <span className="text-primary">Tài Nguyên Game Chất Lượng Cao</span>
            </h1>
            <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '680px', fontSize: '1.15rem' }}>
              Nền tảng dành riêng cho Game Developer độc lập với hàng ngàn 2D Sprites, 3D Low-Poly, SFX và UI Kits. Tích hợp thanh toán an toàn và mô hình Trả-Tùy-Tâm (PWYW).
            </p>
            <div className="d-flex justify-content-center gap-3">
              <a href="#sections" className="btn btn-app-primary px-4 py-2 shadow-sm">
                <i className="bi bi-controller me-1"></i> Khám phá tài nguyên
              </a>
              <a href="#sections" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium border-light-subtle text-dark">
                Dành cho Creator
              </a>
            </div>
          </div>
        </section>

        {/* Khung vị trí phân chia công việc cho Thành viên 2, 3, 4 */}
        <section className="py-5" id="sections">
          <div className="container">
            <div className="text-center mb-5">
              <h3 className="fw-bold text-dark">Phân Hệ Tiếp Theo Trên Trang Chủ</h3>
              <p className="text-muted small">Cấu trúc sẵn sàng để 3 thành viên còn lại ghép nối các component tương ứng</p>
            </div>

            <div className="row g-4">
              
              {/* Vị trí Thành viên 2 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card bg-white border border-light-subtle h-100 p-4 rounded-4 text-center card-hover shadow-sm">
                  <div className="fs-1 text-warning mb-2"><i className="bi bi-stars"></i></div>
                  <h5 className="text-dark fw-bold">Thành viên 2</h5>
                  <p className="text-muted small mb-3">
                    <code>HeroBanner</code>, <code>FeaturedCategories</code>, <code>WhyChooseUsSection</code>
                  </p>
                  <span className="badge bg-light text-secondary border border-light-subtle rounded-pill py-2">
                    Chờ ghép Section
                  </span>
                </div>
              </div>

              {/* Vị trí Thành viên 3 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card bg-white border border-light-subtle h-100 p-4 rounded-4 text-center card-hover shadow-sm">
                  <div className="fs-1 text-primary mb-2"><i className="bi bi-collection"></i></div>
                  <h5 className="text-dark fw-bold">Thành viên 3</h5>
                  <p className="text-muted small mb-3">
                    <code>AssetCard</code>, <code>FilterSidebar</code>, <code>CatalogToolbar</code>
                  </p>
                  <span className="badge bg-light text-secondary border border-light-subtle rounded-pill py-2">
                    Chờ ghép Section
                  </span>
                </div>
              </div>

              {/* Vị trí Thành viên 4 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card bg-white border border-light-subtle h-100 p-4 rounded-4 text-center card-hover shadow-sm">
                  <div className="fs-1 text-success mb-2"><i className="bi bi-images"></i></div>
                  <h5 className="text-dark fw-bold">Thành viên 4</h5>
                  <p className="text-muted small mb-3">
                    <code>MediaGallery</code>, <code>ProductBuyBox</code>, <code>ProductSpecTabs</code>
                  </p>
                  <span className="badge bg-light text-secondary border border-light-subtle rounded-pill py-2">
                    Chờ ghép Section
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Thành viên 1: Footer */}
      <Footer />
    </div>
  );
}
