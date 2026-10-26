import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchMyLibrary, getCurrentUser, requestAssetDownload } from '../services/assetApi';

export default function MyLibraryPage() {
  const currentUser = getCurrentUser();
  const [libraryItems, setLibraryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const loadLibrary = async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchMyLibrary();
      if (Array.isArray(data)) {
        setLibraryItems(data);
      }
    } catch (err) {
      console.error('Lỗi nạp thư viện game:', err);
      setErrorMessage(err.response?.data?.message || 'Không thể kết nối đến máy chủ để lấy kho tài nguyên.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = async (item) => {
    try {
      setDownloadingId(item.asset_id);
      if (item.file_url && item.file_url.startsWith('http')) {
        // Mở hoặc tải link trực tiếp
        window.open(item.file_url, '_blank');
      } else {
        const res = await requestAssetDownload(item.asset_id);
        if (res?.file_url) {
          window.open(res.file_url, '_blank');
        } else {
          alert('Không tìm thấy link tải trực tiếp cho file này.');
        }
      }
    } catch (err) {
      alert('Lỗi tải file: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '980px' }}>
          
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2 rounded-pill fw-semibold">
                <i className="bi bi-collection-play me-1"></i> Kho Game Của Tôi
              </span>
              <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                Tài Nguyên Game Đã Sở Hữu
              </h1>
              <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                Tải về không giới hạn số lần, bao gồm cập nhật phiên bản mới nhất từ Creator.
              </p>
            </div>
            <Link to="/catalog" className="btn btn-outline-info rounded-pill btn-sm px-3.5 text-decoration-none">
              <i className="bi bi-plus-lg me-1"></i> Khám phá thêm Asset
            </Link>
          </div>

          {!currentUser ? (
            <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
              <div className="display-4 mb-3 text-warning"><i className="bi bi-shield-lock"></i></div>
              <h4 className="fw-bold mb-2 text-main">Vui lòng đăng nhập</h4>
              <p className="small mb-4 text-muted">
                Bạn cần đăng nhập tài khoản để xem các tài nguyên và gói game đã sở hữu.
              </p>
              <Link to="/catalog" className="rn-btn-pill rn-btn-primary px-4 text-decoration-none shadow-sm">
                Đến Trang Khám Phá
              </Link>
            </div>
          ) : isLoading ? (
            /* Loading Skeleton */
            <div className="row g-4">
              {[1, 2, 3, 4].map((i) => (
                <div className="col-12 col-md-6" key={i}>
                  <div className="rn-theme-card p-3 rounded-4 shadow-sm h-100">
                    <div className="d-flex gap-3 mb-3">
                      <div className="rn-skeleton rounded-3 flex-shrink-0" style={{ width: '85px', height: '85px' }}></div>
                      <div className="w-100 d-flex flex-column gap-2 justify-content-center">
                        <div className="rn-skeleton" style={{ width: '40%', height: '16px' }}></div>
                        <div className="rn-skeleton" style={{ width: '85%', height: '20px' }}></div>
                        <div className="rn-skeleton" style={{ width: '60%', height: '14px' }}></div>
                      </div>
                    </div>
                    <div className="rn-skeleton" style={{ width: '100%', height: '36px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="rn-theme-card p-4 text-center rounded-4 border-danger border my-4">
              <i className="bi bi-exclamation-circle text-danger fs-3 mb-2 d-block"></i>
              <h5 className="fw-bold text-main mb-2">Không thể tải kho tài nguyên</h5>
              <p className="small text-muted mb-3">{errorMessage}</p>
              <button onClick={loadLibrary} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                <i className="bi bi-arrow-clockwise me-1"></i> Thử lại
              </button>
            </div>
          ) : libraryItems.length === 0 ? (
            <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
              <div className="display-3 mb-3 text-muted"><i className="bi bi-inbox"></i></div>
              <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Bạn chưa sở hữu tài nguyên nào</h4>
              <p className="small mb-4 text-muted">
                Hãy ghé thăm kho tài nguyên để tải các asset miễn phí hoặc mua các gói 3D/2D chất lượng cao.
              </p>
              <Link to="/catalog" className="rn-btn-pill rn-btn-primary px-4 shadow-sm text-decoration-none">
                Đến Trang Catalog
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {libraryItems.map((item) => (
                <div className="col-12 col-md-6" key={item.asset_id}>
                  <div className="rn-theme-card p-3.5 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex gap-3 mb-3">
                        <img 
                          src={item.thumbnail_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80'} 
                          alt={item.title} 
                          className="rounded-3 object-fit-cover flex-shrink-0"
                          style={{ width: '85px', height: '85px', border: '1px solid var(--border-color)' }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="overflow-hidden flex-grow-1">
                          <span className="badge bg-secondary-subtle text-secondary small mb-1">
                            {item.license || 'Standard Commercial'}
                          </span>
                          <h6 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--text-main)' }}>
                            <Link to={`/assets/${item.asset_id}`} className="text-decoration-none" style={{ color: 'var(--text-main)' }}>
                              {item.title}
                            </Link>
                          </h6>
                          <div className="small text-muted mb-1">
                            Giá đã thanh toán: <span className="text-primary fw-semibold">{Number(item.price_at_purchase || 0).toLocaleString('vi-VN')} đ</span>
                          </div>
                          <div className="small text-muted" style={{ fontSize: '11.5px' }}>
                            Trạng thái: <span className="text-success fw-semibold"><i className="bi bi-check2-circle"></i> Đã kích hoạt</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-top d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="small text-muted" style={{ fontSize: '12px' }}>
                        {item.purchased_at ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(new Date(item.purchased_at)) : 'Đã mua'}
                      </span>
                      <div className="d-flex gap-2">
                        <Link to={`/assets/${item.asset_id}`} className="btn btn-outline-secondary btn-sm rounded-pill px-3 text-decoration-none">
                          Chi tiết
                        </Link>
                        <button 
                          onClick={() => handleDownload(item)}
                          disabled={downloadingId === item.asset_id}
                          className="btn btn-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 shadow-sm"
                        >
                          {downloadingId === item.asset_id ? (
                            <><span className="spinner-border spinner-border-sm"></span> Đang nạp link...</>
                          ) : (
                            <><i className="bi bi-download"></i> Tải về (.zip)</>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
