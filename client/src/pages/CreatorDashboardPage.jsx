import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchAssets, getCurrentUser } from '../services/assetApi';

export default function CreatorDashboardPage() {
  const currentUser = getCurrentUser();
  const [myAssets, setMyAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCreatorData() {
      setIsLoading(true);
      try {
        const allAssets = await fetchAssets();
        if (Array.isArray(allAssets)) {
          if (currentUser?.user_id) {
            // Lọc các asset do user này đăng
            const filtered = allAssets.filter(
              (a) => Number(a.uploader_id) === Number(currentUser.user_id)
            );
            // Nếu user mới chưa có asset nào, nếu là admin hoặc demo hiển thị toàn bộ asset mẫu
            setMyAssets(filtered);
          } else {
            setMyAssets(allAssets.slice(0, 5));
          }
        }
      } catch (err) {
        console.error('Lỗi nạp dashboard creator:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCreatorData();
  }, [currentUser?.user_id]);

  const totalDownloads = myAssets.reduce((acc, a) => acc + (Number(a.downloads_count) || 0), 0);
  const totalEstimatedEarnings = myAssets.reduce((acc, a) => {
    const price = Number(a.price) || 0;
    const downloads = Number(a.downloads_count) || 0;
    return acc + price * downloads;
  }, 0);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '1020px' }}>
          
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2 rounded-pill fw-semibold">
                <i className="bi bi-speedometer2 me-1"></i> Creator Dashboard
              </span>
              <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                Quản Lý Tài Nguyên Đăng Bán
              </h1>
              <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                Theo dõi hiệu quả tải về, doanh thu từ cơ chế Trả-Tùy-Tâm và cập nhật nội dung.
              </p>
            </div>
            <Link to="/upload" className="rn-btn-pill rn-btn-primary px-3.5 shadow-sm text-decoration-none">
              <i className="bi bi-plus-lg me-1"></i> Đăng Tài Nguyên Mới
            </Link>
          </div>

          {/* 3 Thẻ Thống kê nhanh */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-4">
              <div className="rn-theme-card p-3.5 rounded-3 shadow-sm border">
                <div className="small text-muted mb-1">Tổng sản phẩm đã đăng</div>
                <h3 className="fw-bolder mb-0 text-primary">{myAssets.length} Assets</h3>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="rn-theme-card p-3.5 rounded-3 shadow-sm border">
                <div className="small text-muted mb-1">Tổng lượt tải về</div>
                <h3 className="fw-bolder mb-0 text-success">{totalDownloads} Lượt</h3>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="rn-theme-card p-3.5 rounded-3 shadow-sm border">
                <div className="small text-muted mb-1">Doanh thu tích lũy ước tính</div>
                <h3 className="fw-bolder mb-0 text-info">{totalEstimatedEarnings.toLocaleString('vi-VN')} đ</h3>
              </div>
            </div>
          </div>

          {/* Bảng danh sách asset */}
          <div className="rn-theme-card p-4 rounded-4 shadow-sm">
            <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
              Danh sách sản phẩm của bạn
            </h6>

            {isLoading ? (
              <div className="py-4 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="small text-muted mt-2">Đang nạp dữ liệu tài nguyên...</div>
              </div>
            ) : myAssets.length === 0 ? (
              <div className="text-center py-5">
                <div className="display-4 text-muted mb-3"><i className="bi bi-cloud-upload"></i></div>
                <h5 className="fw-bold text-main mb-2">Bạn chưa đăng tải sản phẩm nào</h5>
                <p className="text-muted small mb-4">Bắt đầu chia sẻ mô hình 3D, Sprite 2D hoặc Audio packs đến cộng đồng game dev.</p>
                <Link to="/upload" className="rn-btn-pill rn-btn-primary px-4 text-decoration-none">
                  Đăng Tải Sản Phẩm Đầu Tiên
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle" style={{ color: 'var(--text-main)' }}>
                  <thead>
                    <tr className="small text-muted" style={{ borderBottomColor: 'var(--border-color)' }}>
                      <th>Tên tài nguyên</th>
                      <th>Mã Asset</th>
                      <th>Giá tối thiểu</th>
                      <th>Lượt tải</th>
                      <th>Trạng thái</th>
                      <th className="text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAssets.map((asset) => (
                      <tr key={asset.asset_id} style={{ borderBottomColor: 'var(--border-color)' }}>
                        <td>
                          <div className="fw-bold text-truncate" style={{ maxWidth: '280px' }}>
                            <Link to={`/assets/${asset.asset_id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                              {asset.title}
                            </Link>
                          </div>
                          <span className="small text-muted" style={{ fontSize: '11px' }}>
                            {asset.license || 'Indie Commercial'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary">#{asset.asset_id}</span>
                        </td>
                        <td className="fw-semibold">
                          {Number(asset.price) === 0 ? <span className="text-success">FREE</span> : `${Number(asset.price).toLocaleString('vi-VN')} đ`}
                        </td>
                        <td>{asset.downloads_count || 0}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            Đang mở bán
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Link to={`/assets/${asset.asset_id}`} className="btn btn-outline-info btn-sm rounded-circle p-1" title="Xem trang">
                              <i className="bi bi-eye"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
