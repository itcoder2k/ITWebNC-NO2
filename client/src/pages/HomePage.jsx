import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/HeroBanner';
import FeaturedCategories from '../components/FeaturedCategories';

export default function HomePage() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Thành viên 1: Navbar / Header + AuthModal + CartBadge + UserMenuDropdown */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow-1">
        
        {/* Thành viên 2: HeroBanner chính giữa */}
        <HeroBanner />

        {/* Thành viên 2: Danh mục tài nguyên nổi bật */}
        <div id="assets">
          <FeaturedCategories />
        </div>

        {/* Khung vị trí phân chia công việc cho Thành viên 2, 3, 4 */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h3 className="fw-bold text-dark">Tiến Độ Ghép Nối Phân Hệ</h3>
              <p className="text-muted small">Cấu trúc sẵn sàng để 2 thành viên còn lại ghép nối các component tương ứng</p>
            </div>

            <div className="row g-4">
              
              {/* Vị trí Thành viên 2 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card bg-white border border-light-subtle h-100 p-4 rounded-4 text-center card-hover shadow-sm">
                  <div className="fs-1 text-success mb-2"><i className="bi bi-check-circle-fill"></i></div>
                  <h5 className="text-dark fw-bold">Thành viên 2</h5>
                  <p className="text-muted small mb-3">
                    <code>HeroBanner</code> & <code>FeaturedCategories</code>
                  </p>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill py-2">
                    <i className="bi bi-check2-circle me-1"></i> Đã hoàn thành & Đã hiển thị
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
