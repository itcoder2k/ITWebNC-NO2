import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getCartItems, removeFromCart, updateCartTip } from '../services/cartService';

export default function CartPage() {
  const [cartItems, setCartItems] = useState(() => getCartItems());

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCartItems());
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const handleTipChange = (id, newTip) => {
    const updated = updateCartTip(id, newTip);
    setCartItems(updated);
  };

  const handleRemove = (id) => {
    const updated = removeFromCart(id);
    setCartItems(updated);
  };

  // Tính tổng tiền = Giá sản phẩm + Tiền ủng hộ thêm (PWYW)
  const totalBasePrice = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const totalTip = cartItems.reduce((acc, item) => acc + (Number(item.tipAmount) || 0), 0);
  const grandTotal = totalBasePrice + totalTip;

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '960px' }}>
          
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2 rounded-pill fw-semibold">
                <i className="bi bi-cart3 me-1"></i> Giỏ Hàng Mua Sắm
              </span>
              <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                Tài Nguyên Game Chuẩn Bị Tải
              </h1>
              <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                Cơ chế Pay-What-You-Want: Bạn có thể ủng hộ thêm cho tác giả để phát triển cộng đồng indie game.
              </p>
            </div>
            <Link to="/catalog" className="btn btn-outline-secondary rounded-pill btn-sm px-3">
              <i className="bi bi-arrow-left me-1"></i> Tiếp tục chọn Asset
            </Link>
          </div>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
              <div className="display-3 mb-3 text-muted"><i className="bi bi-cart-x"></i></div>
              <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Giỏ hàng của bạn đang trống</h4>
              <p className="small mb-4 text-muted">
                Hãy khám phá hàng ngàn 2D/3D Sprites, Audio và UI Kits sẵn sàng cho tựa game của bạn.
              </p>
              <Link to="/catalog" className="rn-btn-pill rn-btn-primary px-4 shadow-sm text-decoration-none">
                Khám Phá Kho Asset Ngay
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {/* Cột trái: Danh sách mặt hàng */}
              <div className="col-12 col-lg-8">
                <div className="rn-theme-card p-4 rounded-4 shadow-sm">
                  <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                    Các mục trong giỏ ({cartItems.length})
                  </h6>

                  <div className="d-flex flex-column gap-3">
                    {cartItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3 rounded-3 border d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title} 
                            className="rounded-2 object-fit-cover"
                            style={{ width: '70px', height: '70px', border: '1px solid var(--border-color)' }}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          <div>
                            <h6 className="fw-bold mb-1" style={{ fontSize: '15px', color: 'var(--text-main)' }}>
                              <Link to={`/assets/${item.id}`} className="text-decoration-none" style={{ color: 'var(--text-main)' }}>
                                {item.title}
                              </Link>
                            </h6>
                            <div className="small text-muted mb-1">Tác giả: {item.author}</div>
                            <span className="badge bg-info-subtle text-info border border-info-subtle">
                              Giá gốc: {Number(item.price) === 0 ? 'FREE' : `${Number(item.price).toLocaleString('vi-VN')} đ`}
                            </span>
                          </div>
                        </div>

                        {/* Input PWYW Tip ủng hộ thêm */}
                        <div className="d-flex align-items-center gap-3 justify-content-between justify-content-sm-end">
                          <div>
                            <label className="small fw-semibold d-block mb-1" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                              Ủng hộ thêm (PWYW):
                            </label>
                            <div className="input-group input-group-sm" style={{ width: '130px' }}>
                              <input 
                                type="number" 
                                min="0" 
                                step="5000"
                                className="form-control"
                                value={item.tipAmount || 0}
                                onChange={(e) => handleTipChange(item.id, e.target.value)}
                                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                              />
                              <span className="input-group-text" style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-muted)' }}>đ</span>
                            </div>
                          </div>

                          <button 
                            className="btn btn-outline-danger btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => handleRemove(item.id)}
                            title="Xóa khỏi giỏ"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Cột phải: Tổng kết đơn hàng & Checkout */}
              <div className="col-12 col-lg-4">
                <div className="rn-theme-card p-4 rounded-4 shadow-sm position-sticky" style={{ top: '85px' }}>
                  <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                    Tổng kết đơn hàng
                  </h6>

                  <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                    <span>Giá niêm yết:</span>
                    <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{totalBasePrice.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3 small" style={{ color: 'var(--text-muted)' }}>
                    <span>Ủng hộ thêm (PWYW):</span>
                    <span className="fw-semibold text-info">+{totalTip.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <div className="d-flex justify-content-between mb-4 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="fw-bold" style={{ color: 'var(--text-main)' }}>Tổng thanh toán:</span>
                    <span className="fw-bolder fs-5 text-primary">{grandTotal.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <Link 
                    to="/checkout" 
                    className="rn-btn-pill rn-btn-primary w-100 text-center py-2.5 shadow-sm d-block text-decoration-none"
                  >
                    <i className="bi bi-shield-lock-fill me-1"></i> Tiến Hành Thanh Toán
                  </Link>

                  <div className="text-center mt-3">
                    <span className="small text-muted" style={{ fontSize: '11.5px' }}>
                      <i className="bi bi-check-circle-fill text-success me-1"></i> Tải ngay lập tức sau thanh toán
                    </span>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
