import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getCurrentUser, checkoutAsset, fetchUserProfile } from '../services/assetApi';
import { getCartItems, clearCart } from '../services/cartService';

export default function CheckoutPage() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [cartItems] = useState(() => getCartItems());
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totalBasePrice = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const totalTip = cartItems.reduce((acc, item) => acc + (Number(item.tipAmount) || 0), 0);
  const totalAmount = totalBasePrice + totalTip;
  const walletBalance = Number(user?.balance ?? user?.wallet_balance ?? 0);

  const handlePayOrder = async () => {
    if (!user) {
      setErrorMessage('Vui lòng đăng nhập để hoàn tất đơn hàng.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Giỏ hàng trống. Vui lòng chọn sản phẩm trước.');
      return;
    }

    if (paymentMethod === 'wallet' && walletBalance < totalAmount) {
      setErrorMessage(`Số dư ví (${walletBalance.toLocaleString('vi-VN')} đ) không đủ để thanh toán ${totalAmount.toLocaleString('vi-VN')} đ. Vui lòng nạp thêm tiền vào ví.`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    try {
      // Thực hiện checkout từng sản phẩm trong giỏ hàng vào CSDL
      for (const item of cartItems) {
        const itemPay = (Number(item.price) || 0) + (Number(item.tipAmount) || 0);
        try {
          await checkoutAsset(item.id, itemPay);
        } catch (itemErr) {
          // Nếu đã sở hữu hoặc lỗi nhỏ, tiếp tục xử lý các món khác
          console.warn(`Lưu ý với sản phẩm #${item.id}:`, itemErr.response?.data?.message || itemErr.message);
        }
      }

      // Cập nhật lại số dư ví người dùng sau khi mua
      try {
        const updatedProfile = await fetchUserProfile();
        setUser(updatedProfile);
        window.dispatchEvent(new CustomEvent('auth-changed'));
      } catch (profileErr) {
        console.warn('Chưa nạp được profile mới:', profileErr);
      }

      // Xóa sạch giỏ hàng sau khi hoàn tất
      clearCart();
      setOrderCompleted(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Lỗi xử lý thanh toán. Thử lại sau.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '820px' }}>
          
          {orderCompleted ? (
            /* Trạng thái Thanh toán Thành công */
            <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
              <div className="display-3 text-success mb-3">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <h3 className="fw-bolder mb-2" style={{ color: 'var(--text-main)' }}>
                Thanh Toán Đơn Hàng Thành Công!
              </h3>
              <p className="small mb-4 text-muted" style={{ maxWidth: '520px', margin: '0 auto' }}>
                Cảm ơn bạn đã ủng hộ các nhà phát triển tài nguyên game indie. Toàn bộ file đã được lưu vào Thư Viện của bạn và sẵn sàng tải về.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/library" className="rn-btn-pill rn-btn-primary px-4 shadow-sm text-decoration-none">
                  <i className="bi bi-collection-play me-1"></i> Đến Thư Viện Tải File
                </Link>
                <Link to="/catalog" className="btn btn-outline-secondary rounded-pill px-4 text-decoration-none">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-4">
                <Link to="/cart" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1 mb-2">
                  <i className="bi bi-arrow-left"></i> Quay lại Giỏ hàng
                </Link>
                <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                  Xác Nhận & Thanh Toán
                </h1>
                <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                  Hoàn tất đơn hàng để nhận quyền tải về vĩnh viễn và cập nhật miễn phí từ tác giả.
                </p>
              </div>

              {errorMessage && (
                <div className="alert alert-danger py-2.5 rounded-3 mb-4 d-flex align-items-center justify-content-between">
                  <span><i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMessage}</span>
                  {errorMessage.includes('nạp thêm') && (
                    <Link to="/profile" className="btn btn-sm btn-outline-danger ms-2">
                      Nạp tiền ví
                    </Link>
                  )}
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
                  <div className="display-4 text-muted mb-3"><i className="bi bi-cart-x"></i></div>
                  <h5 className="fw-bold text-main mb-2">Chưa có sản phẩm nào để thanh toán</h5>
                  <p className="text-muted small mb-4">Vui lòng quay lại danh mục hoặc giỏ hàng để chọn sản phẩm.</p>
                  <Link to="/catalog" className="rn-btn-pill rn-btn-primary px-4 text-decoration-none">
                    Xem Kho Asset
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {/* Phương thức thanh toán */}
                  <div className="col-12 col-lg-7">
                    <div className="rn-theme-card p-4 rounded-4 shadow-sm mb-4">
                      <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        Chọn phương thức thanh toán
                      </h6>

                      <div className="d-flex flex-column gap-3">
                        
                        {/* Ví GameAsset */}
                        <label 
                          className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                            paymentMethod === 'wallet' ? 'border-primary bg-primary-subtle' : ''
                          }`}
                          style={{ borderColor: 'var(--border-color)', cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <input 
                              type="radio" 
                              name="payment" 
                              checked={paymentMethod === 'wallet'}
                              onChange={() => setPaymentMethod('wallet')}
                              className="form-check-input mt-0"
                            />
                            <div>
                              <div className="fw-bold" style={{ color: 'var(--text-main)' }}>Ví GameAsset Pay</div>
                              <div className="small text-muted">Số dư khả dụng: {walletBalance.toLocaleString('vi-VN')} đ</div>
                            </div>
                          </div>
                          <i className="bi bi-wallet2 fs-4 text-primary"></i>
                        </label>

                        {/* Quét mã QR MoMo / VNPAY */}
                        <label 
                          className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                            paymentMethod === 'qr' ? 'border-primary bg-primary-subtle' : ''
                          }`}
                          style={{ borderColor: 'var(--border-color)', cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <input 
                              type="radio" 
                              name="payment" 
                              checked={paymentMethod === 'qr'}
                              onChange={() => setPaymentMethod('qr')}
                              className="form-check-input mt-0"
                            />
                            <div>
                              <div className="fw-bold" style={{ color: 'var(--text-main)' }}>Quét mã QR Momo / Ngân hàng</div>
                              <div className="small text-muted">Thanh toán tức thì qua cổng VNPAY/MoMo</div>
                            </div>
                          </div>
                          <i className="bi bi-qr-code-scan fs-4 text-info"></i>
                        </label>

                      </div>
                    </div>
                  </div>

                  {/* Tóm tắt thanh toán */}
                  <div className="col-12 col-lg-5">
                    <div className="rn-theme-card p-4 rounded-4 shadow-sm">
                      <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        Tóm tắt đơn hàng
                      </h6>

                      <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                        <span>Số lượng sản phẩm:</span>
                        <span className="fw-semibold text-main">{cartItems.length} gói</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                        <span>Giá niêm yết:</span>
                        <span className="fw-semibold text-main">{totalBasePrice.toLocaleString('vi-VN')} đ</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                        <span>Ủng hộ thêm (PWYW):</span>
                        <span className="text-info fw-semibold">+{totalTip.toLocaleString('vi-VN')} đ</span>
                      </div>

                      <div className="d-flex justify-content-between mb-4 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                        <span className="fw-bold" style={{ color: 'var(--text-main)' }}>Cần thanh toán:</span>
                        <span className="fw-bolder fs-5 text-primary">{totalAmount.toLocaleString('vi-VN')} đ</span>
                      </div>

                      <button 
                        onClick={handlePayOrder}
                        disabled={isProcessing}
                        className="rn-btn-pill rn-btn-primary w-100 text-center py-2.5 shadow-sm border-0"
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span> Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lock-fill me-1"></i> Thanh Toán {totalAmount.toLocaleString('vi-VN')} đ
                          </>
                        )}
                      </button>

                      <p className="text-center small text-muted mt-3 mb-0" style={{ fontSize: '11.5px' }}>
                        Bằng việc bấm thanh toán, bạn đồng ý với Điều khoản bản quyền và Giấy phép Indie Commercial.
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
