import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  getCartItems,
  removeFromCart,
  updateCartTip,
  clearCart,
  getCartTotals,
} from '../services/cartService';

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `$${num.toFixed(2)}`;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const [totals, setTotals] = useState(() => getCartTotals());

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCartItems());
      setTotals(getCartTotals());
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const handleTipChange = (id, newTip) => {
    const val = Math.max(0, parseFloat(newTip) || 0);
    updateCartTip(id, val);
  };

  const handleQuickTip = (id, addAmount) => {
    updateCartTip(id, addAmount);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
      clearCart();
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
                <i className="bi bi-cart3 me-1"></i> Giỏ Hàng Mua Sắm
              </span>
              <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                Tài Nguyên Game Chuẩn Bị Tải
              </h1>
              <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                Cơ chế <strong>Pay-What-You-Want (PWYW)</strong>: Bạn có thể chọn mức ủng hộ thêm để khích lệ tác giả phát triển cộng đồng indie game.
              </p>
            </div>
            <div className="d-flex gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="btn btn-outline-danger rounded-pill btn-sm px-3"
                  title="Xóa sạch giỏ hàng"
                >
                  <i className="bi bi-trash3 me-1"></i> Xóa tất cả
                </button>
              )}
              <Link to="/catalog" className="btn btn-outline-secondary rounded-pill btn-sm px-3">
                <i className="bi bi-arrow-left me-1"></i> Tiếp tục chọn Asset
              </Link>
            </div>
          </div>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
              <div className="display-3 mb-3 text-muted"><i className="bi bi-cart-x"></i></div>
              <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Giỏ hàng của bạn đang trống</h4>
              <p className="small mb-4 text-muted" style={{ maxWidth: '480px', margin: '0 auto' }}>
                Khám phá hàng ngàn 2D/3D Sprites, Audio SFX và Game UI Kits chất lượng cao sẵn sàng cho dự án Unity, Godot hay Unreal Engine của bạn.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/catalog" className="rn-btn-pill rn-btn-primary px-4 shadow-sm text-decoration-none">
                  <i className="bi bi-grid-fill me-1"></i> Khám Phá Kho Asset Ngay
                </Link>
                <Link to="/library" className="btn btn-outline-secondary rounded-pill px-4 text-decoration-none">
                  <i className="bi bi-collection-play me-1"></i> Kho Game Của Tôi
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {/* Cột trái: Danh sách mặt hàng */}
              <div className="col-12 col-lg-8">
                <div className="rn-theme-card p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
                      Các mục trong giỏ ({totals.itemCount})
                    </h6>
                    <span className="small text-muted">
                      Đảm bảo giao dịch ACID 100%
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {cartItems.map((item) => {
                      const basePrice = Number(item.price) || 0;
                      const tip = Number(item.tipAmount) || 0;
                      const itemTotal = basePrice + tip;

                      return (
                        <div 
                          key={item.id} 
                          className="p-3.5 rounded-3 border d-flex flex-column gap-3"
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                        >
                          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                            {/* Thông tin Asset */}
                            <div className="d-flex align-items-center gap-3">
                              <img 
                                src={item.thumbnail} 
                                alt={item.title} 
                                className="rounded-3 object-fit-cover flex-shrink-0"
                                style={{ width: '75px', height: '75px', border: '1px solid var(--border-color)' }}
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80';
                                }}
                              />
                              <div>
                                <h6 className="fw-bold mb-1" style={{ fontSize: '15.5px', color: 'var(--text-main)' }}>
                                  <Link to={`/assets/${item.id}`} className="text-decoration-none" style={{ color: 'var(--text-main)' }}>
                                    {item.title}
                                  </Link>
                                </h6>
                                <div className="small text-muted mb-1.5 d-flex align-items-center gap-2">
                                  <span><i className="bi bi-person-fill me-1"></i>{item.author}</span>
                                  <span>•</span>
                                  <span className="badge bg-secondary-subtle text-secondary py-0.5">{item.license}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="badge bg-info-subtle text-info border border-info-subtle fw-semibold">
                                    Giá gốc: {basePrice === 0 ? 'FREE' : formatCurrency(basePrice)}
                                  </span>
                                  {tip > 0 && (
                                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                                      + Tip PWYW: {formatCurrency(tip)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Nút xóa & tổng mục */}
                            <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3">
                              <div className="text-sm-end">
                                <div className="small text-muted" style={{ fontSize: '11px' }}>Thành tiền mục:</div>
                                <span className="fw-bolder fs-6 text-primary">
                                  {formatCurrency(itemTotal)}
                                </span>
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

                          {/* Bộ điều khiển Pay-What-You-Want Tip */}
                          <div 
                            className="p-2.5 rounded-3 border d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2"
                            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', fontSize: '12.5px' }}
                          >
                            <div className="d-flex align-items-center gap-1.5 text-muted">
                              <i className="bi bi-heart-fill text-danger"></i>
                              <span className="fw-semibold">Ủng hộ thêm Creator (PWYW):</span>
                            </div>

                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              {/* Quick tip buttons */}
                              <div className="btn-group btn-group-sm">
                                {[0, 2, 5, 10].map((amt) => (
                                  <button
                                    key={amt}
                                    type="button"
                                    className={`btn btn-sm ${tip === amt ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    style={{ fontSize: '11.5px', padding: '2px 8px' }}
                                    onClick={() => handleQuickTip(item.id, amt)}
                                  >
                                    {amt === 0 ? 'Gốc ($0)' : `+$${amt}`}
                                  </button>
                                ))}
                              </div>

                              {/* Custom input */}
                              <div className="input-group input-group-sm" style={{ width: '110px' }}>
                                <span className="input-group-text py-0" style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-muted)' }}>$</span>
                                <input 
                                  type="number" 
                                  min="0" 
                                  step="0.5"
                                  className="form-control py-0"
                                  value={item.tipAmount || 0}
                                  onChange={(e) => handleTipChange(item.id, e.target.value)}
                                  style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)', fontSize: '12px' }}
                                />
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
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
                    <span>Số lượng sản phẩm:</span>
                    <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{totals.itemCount} asset</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                    <span>Giá niêm yết gốc:</span>
                    <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{formatCurrency(totals.baseTotal)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3 small" style={{ color: 'var(--text-muted)' }}>
                    <span>Ủng hộ thêm tác giả (PWYW):</span>
                    <span className="fw-semibold text-success">+{formatCurrency(totals.tipTotal)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-4 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="fw-bold" style={{ color: 'var(--text-main)' }}>Tổng thanh toán:</span>
                    <span className="fw-bolder fs-4 text-primary">{formatCurrency(totals.grandTotal)}</span>
                  </div>

                  <Link 
                    to="/checkout" 
                    className="rn-btn-pill rn-btn-primary w-100 text-center py-2.5 shadow-sm d-block text-decoration-none fw-bold"
                  >
                    <i className="bi bi-shield-lock-fill me-1.5"></i> Tiến Hành Thanh Toán
                  </Link>

                  <div className="text-center mt-3 d-flex flex-column gap-1">
                    <span className="small text-muted" style={{ fontSize: '11.5px' }}>
                      <i className="bi bi-check-circle-fill text-success me-1"></i> Tải file .zip ngay sau thanh toán
                    </span>
                    <span className="small text-muted" style={{ fontSize: '11.5px' }}>
                      <i className="bi bi-arrow-repeat text-info me-1"></i> Cập nhật phiên bản mới trọn đời
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
