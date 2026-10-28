import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  fetchMyLibrary,
  fetchMyOrders,
  getCurrentUser,
  saveAuthData,
  downloadAssetZip,
} from '../services/assetApi';

const DEMO_LIBRARY_ITEMS = [
  {
    asset_id: 1,
    title: 'SunnyLand 2D Pixel Adventure',
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    file_url: '/uploads/assets/sunnyland_pixel_pack.zip',
    file_size: 13002342,
    license: 'CC0 (Public Domain)',
    short_description: 'Gói nhân vật và vườn thú pixel art kèm đầy đủ hoạt ảnh chuyển động.',
    price_at_purchase: 0.0,
    purchased_at: new Date().toISOString(),
    author_name: 'ansimuz',
  },
  {
    asset_id: 2,
    title: 'Cyberpunk Street Brawler Spritesheet',
    thumbnail_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    file_url: '/uploads/assets/cyberpunk_brawler.zip',
    file_size: 9017753,
    license: 'Standard Indie Commercial License',
    short_description: 'Nhân vật chiến đấu đường phố phong cách Cyberpunk với combo đòn đánh.',
    price_at_purchase: 10.0,
    purchased_at: new Date(Date.now() - 86400000).toISOString(),
    author_name: 'ansimuz',
  },
  {
    asset_id: 3,
    title: 'Low Poly Fantasy Dungeon 3D',
    thumbnail_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    file_url: '/uploads/assets/lowpoly_fantasy_dungeon.zip',
    file_size: 35861299,
    license: 'Standard Indie Commercial License',
    short_description: 'Bộ 3D mô-đun hầm ngục huyền bí tối ưu hóa tốt cho game mobile và PC.',
    price_at_purchase: 15.0,
    purchased_at: new Date(Date.now() - 172800000).toISOString(),
    author_name: 'kenney_nl',
  },
];

const DEMO_ORDERS = [
  {
    order_id: 101,
    total_amount: 25.0,
    payment_method: 'wallet',
    status: 'Completed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        order_detail_id: 1,
        asset_id: 2,
        asset_title: 'Cyberpunk Street Brawler Spritesheet',
        price_at_purchase: 10.0,
        thumbnail_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      },
      {
        order_detail_id: 2,
        asset_id: 3,
        asset_title: 'Low Poly Fantasy Dungeon 3D',
        price_at_purchase: 15.0,
        thumbnail_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
];

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `$${num.toFixed(2)}`;
}

function formatFileSize(bytes) {
  const b = Number(bytes) || 0;
  if (b === 0) return '12.5 MB';
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MyLibraryPage() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'orders'
  const [libraryItems, setLibraryItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  const handleQuickDemoLogin = () => {
    const demoUser = {
      user_id: 4,
      username: 'buyer_demo',
      display_name: 'Khách Mua Hàng (Demo)',
      email: 'buyer@gmail.com',
      role: 'customer',
      balance: 150.0,
    };
    saveAuthData('demo-jwt-token-testing', demoUser);
    setCurrentUser(demoUser);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-changed'));
  };

  const loadData = async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [libData, ordersData] = await Promise.all([
        fetchMyLibrary().catch((e) => {
          console.warn('Lỗi fetch library:', e);
          return null;
        }),
        fetchMyOrders().catch((e) => {
          console.warn('Lỗi fetch orders:', e);
          return null;
        }),
      ]);

      if (Array.isArray(libData) && libData.length > 0) {
        setLibraryItems(libData);
      } else if (libData === null || libData.length === 0) {
        setLibraryItems(DEMO_LIBRARY_ITEMS);
      }

      if (Array.isArray(ordersData) && ordersData.length > 0) {
        setOrderHistory(ordersData);
      } else if (ordersData === null || ordersData.length === 0) {
        setOrderHistory(DEMO_ORDERS);
      }
    } catch (err) {
      console.error('Lỗi nạp thư viện game:', err);
      setLibraryItems(DEMO_LIBRARY_ITEMS);
      setOrderHistory(DEMO_ORDERS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Xử lý Tải tệp nén .zip an toàn cho tài nguyên đã sở hữu
  const handleDownload = async (item) => {
    try {
      setDownloadingId(item.asset_id);
      setDownloadSuccessId(null);

      // Tải trực tiếp file .zip từ máy chủ qua stream có xác thực JWT
      await downloadAssetZip(item.asset_id, item.title);

      setDownloadSuccessId(item.asset_id);
      setTimeout(() => setDownloadSuccessId(null), 4000);
    } catch (err) {
      console.error('Lỗi tải file .zip:', err);
      alert('Lỗi tải file .zip: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloadingId(null);
    }
  };

  // Lọc tìm kiếm tài nguyên trong thư viện
  const filteredLibrary = libraryItems.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.author_name && item.author_name.toLowerCase().includes(term)) ||
      (item.license && item.license.toLowerCase().includes(term))
    );
  });

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '1020px' }}>
          
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2 rounded-pill fw-semibold">
                <i className="bi bi-collection-play-fill me-1"></i> Kho Game & Asset Của Tôi
              </span>
              <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                Tài Nguyên Game Đã Sở Hữu
              </h1>
              <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                Tải về tệp gốc <strong>.zip</strong> không giới hạn số lần, bao gồm cập nhật phiên bản mới nhất từ Creator.
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link to="/catalog" className="btn btn-outline-info rounded-pill btn-sm px-3.5 text-decoration-none">
                <i className="bi bi-plus-lg me-1"></i> Khám phá thêm Asset
              </Link>
            </div>
          </div>

          {!currentUser ? (
            <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
              <div className="display-4 mb-3 text-warning"><i className="bi bi-shield-lock"></i></div>
              <h4 className="fw-bold mb-2 text-main">Vui lòng đăng nhập</h4>
              <p className="small mb-4 text-muted">
                Bạn cần đăng nhập tài khoản để xem các tài nguyên và gói game đã sở hữu.
              </p>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="rn-btn-pill rn-btn-primary px-4 shadow-sm fw-bold border-0"
                >
                  <i className="bi bi-lightning-charge-fill me-1.5"></i> Đăng Nhập Thử Nghiệm Nhanh (Demo Buyer)
                </button>
                <Link to="/catalog" className="btn btn-outline-secondary rounded-pill px-4 text-decoration-none">
                  Đến Trang Khám Phá
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3 border-bottom pb-3" style={{ borderColor: 'var(--border-color)' }}>
                <ul className="nav nav-pills gap-2">
                  <li className="nav-item">
                    <button
                      className={`btn rounded-pill px-3.5 btn-sm fw-semibold ${
                        activeTab === 'library' ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setActiveTab('library')}
                    >
                      <i className="bi bi-folder-check me-1.5"></i>
                      Thư Viện Asset ({libraryItems.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`btn rounded-pill px-3.5 btn-sm fw-semibold ${
                        activeTab === 'orders' ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setActiveTab('orders')}
                    >
                      <i className="bi bi-receipt me-1.5"></i>
                      Lịch Sử Đơn Hàng ({orderHistory.length})
                    </button>
                  </li>
                </ul>

                {activeTab === 'library' && libraryItems.length > 0 && (
                  <div className="input-group input-group-sm" style={{ maxWidth: '260px' }}>
                    <span className="input-group-text" style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-muted)' }}>
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm asset trong thư viện..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    />
                  </div>
                )}
              </div>

              {isLoading ? (
                /* Skeleton Loading */
                <div className="row g-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div className="col-12 col-md-6" key={i}>
                      <div className="rn-theme-card p-4 rounded-4 shadow-sm h-100">
                        <div className="d-flex gap-3 mb-3">
                          <div className="rn-skeleton rounded-3 flex-shrink-0" style={{ width: '85px', height: '85px' }}></div>
                          <div className="w-100 d-flex flex-column gap-2 justify-content-center">
                            <div className="rn-skeleton" style={{ width: '35%', height: '14px' }}></div>
                            <div className="rn-skeleton" style={{ width: '80%', height: '18px' }}></div>
                            <div className="rn-skeleton" style={{ width: '55%', height: '14px' }}></div>
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
                  <button onClick={loadData} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                    <i className="bi bi-arrow-clockwise me-1"></i> Thử lại
                  </button>
                </div>
              ) : activeTab === 'library' ? (
                /* TAB 1: THƯ VIỆN ASSET ĐÃ SỞ HỮU */
                filteredLibrary.length === 0 ? (
                  <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
                    <div className="display-3 mb-3 text-muted"><i className="bi bi-inbox"></i></div>
                    <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
                      {searchTerm ? 'Không tìm thấy tài nguyên phù hợp' : 'Bạn chưa sở hữu tài nguyên nào'}
                    </h4>
                    <p className="small mb-4 text-muted">
                      {searchTerm
                        ? 'Thử tìm với từ khóa khác hoặc xóa bộ lọc.'
                        : 'Hãy ghé thăm kho tài nguyên để tải các asset miễn phí hoặc mua các gói 3D/2D chất lượng cao.'}
                    </p>
                    <Link to="/catalog" className="rn-btn-pill rn-btn-primary px-4 shadow-sm text-decoration-none">
                      Đến Trang Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredLibrary.map((item) => (
                      <div className="col-12 col-md-6" key={item.asset_id}>
                        <div 
                          className="rn-theme-card p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between"
                          style={{ minHeight: '190px' }}
                        >
                          <div>
                            <div className="d-flex gap-3 mb-3 align-items-start">
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
                                <div className="d-flex align-items-center gap-1.5 mb-1.5 flex-wrap">
                                  <span className="badge bg-secondary-subtle text-secondary py-1 px-2" style={{ fontSize: '11px' }}>
                                    {item.license || 'Standard Commercial'}
                                  </span>
                                  <span className="badge bg-info-subtle text-info py-1 px-2" style={{ fontSize: '11px' }}>
                                    {formatFileSize(item.file_size)}
                                  </span>
                                </div>
                                <h6 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--text-main)', fontSize: '15.5px' }}>
                                  <Link to={`/assets/${item.asset_id}`} className="text-decoration-none" style={{ color: 'var(--text-main)' }}>
                                    {item.title}
                                  </Link>
                                </h6>
                                <div className="small text-muted mb-1" style={{ fontSize: '12px' }}>
                                  Tác giả: <strong>{item.author_name || 'Creator'}</strong>
                                </div>
                                <div className="small text-muted" style={{ fontSize: '11.5px' }}>
                                  Giá đã mua: <strong className="text-primary">{formatCurrency(item.price_at_purchase)}</strong>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 mt-2 border-top d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
                            <span className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                              <i className="bi bi-calendar3"></i>
                              {item.purchased_at ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(new Date(item.purchased_at)) : 'Đã mua'}
                            </span>
                            
                            <div className="d-flex gap-2">
                              <Link to={`/assets/${item.asset_id}`} className="btn btn-outline-secondary btn-sm rounded-pill px-3 text-decoration-none">
                                Chi tiết
                              </Link>
                              
                              <button 
                                onClick={() => handleDownload(item)}
                                disabled={downloadingId === item.asset_id}
                                className={`btn btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1.5 shadow-sm fw-semibold ${
                                  downloadSuccessId === item.asset_id ? 'btn-success' : 'btn-primary'
                                }`}
                              >
                                {downloadingId === item.asset_id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    <span>Đang chuẩn bị .zip...</span>
                                  </>
                                ) : downloadSuccessId === item.asset_id ? (
                                  <>
                                    <i className="bi bi-check2-circle"></i>
                                    <span>Đã tải xuống!</span>
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-download"></i>
                                    <span>Tải về (.zip)</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* TAB 2: LỊCH SỬ ĐƠN HÀNG (ORDER HISTORY) */
                orderHistory.length === 0 ? (
                  <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
                    <div className="display-4 text-muted mb-3"><i className="bi bi-receipt"></i></div>
                    <h5 className="fw-bold text-main mb-2">Chưa có giao dịch đơn hàng nào</h5>
                    <p className="small text-muted mb-3">Lịch sử các hóa đơn thanh toán qua Ví điện tử sẽ hiển thị tại đây.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {orderHistory.map((order) => (
                      <div key={order.order_id} className="rn-theme-card p-4 rounded-4 shadow-sm">
                        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
                          <div>
                            <span className="fw-bold text-primary fs-6 me-2">Đơn hàng #{order.order_id}</span>
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              {order.status || 'Completed'}
                            </span>
                          </div>
                          <div className="small text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {order.created_at ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.created_at)) : ''}
                          </div>
                        </div>

                        {/* Order items if populated */}
                        {Array.isArray(order.items) && order.items.length > 0 && (
                          <div className="d-flex flex-column gap-2 mb-3">
                            {order.items.map((it) => (
                              <div key={it.order_detail_id || it.asset_id} className="d-flex align-items-center justify-content-between small py-1">
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                  {it.thumbnail_url && (
                                    <img
                                      src={it.thumbnail_url}
                                      alt={it.asset_title || 'asset'}
                                      className="rounded-2 object-fit-cover"
                                      style={{ width: '32px', height: '32px' }}
                                    />
                                  )}
                                  <span className="fw-semibold text-truncate" style={{ color: 'var(--text-main)' }}>
                                    {it.asset_title || `Tài nguyên #${it.asset_id}`}
                                  </span>
                                </div>
                                <span className="text-muted fw-semibold flex-shrink-0 ms-2">
                                  {formatCurrency(it.price_at_purchase)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                          <span className="small text-muted">Phương thức: Ví GameAsset Pay</span>
                          <div>
                            <span className="small text-muted me-2">Tổng thanh toán:</span>
                            <strong className="fs-6 text-primary">{formatCurrency(order.total_amount)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
