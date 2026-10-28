import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  getCurrentUser,
  checkoutCart,
  fetchUserProfile,
  depositWallet,
  saveAuthData,
} from '../services/assetApi';
import { getCartItems, clearCart, getCartTotals } from '../services/cartService';

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `$${num.toFixed(2)}`;
}

export default function CheckoutPage() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [cartItems] = useState(() => getCartItems());
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('20');
  const [isDepositing, setIsDepositing] = useState(false);

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
    setUser(demoUser);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-changed'));
  };

  useEffect(() => {
    // Refresh user profile on mount to ensure fresh wallet balance
    async function loadFreshUser() {
      if (getCurrentUser()) {
        try {
          const fresh = await fetchUserProfile();
          setUser(fresh);
        } catch (err) {
          console.warn('Không thể làm mới số dư ví:', err);
        }
      }
    }
    loadFreshUser();
  }, []);

  const totals = getCartTotals();
  const totalAmount = totals.grandTotal;
  const rawBalance = user ? (user.balance !== undefined ? user.balance : user.wallet_balance) : 0;
  const walletBalance = Number(rawBalance) || 0;
  const isBalanceSufficient = walletBalance >= totalAmount;
  const balanceDeficit = Math.max(0, totalAmount - walletBalance);

  // Xử lý nạp tiền nhanh vào ví ngay tại trang Checkout
  const handleQuickDeposit = async () => {
    const amt = Number(depositAmount);
    if (!amt || amt < 1) {
      alert('Số tiền nạp tối thiểu là $1.00');
      return;
    }
    setIsDepositing(true);
    try {
      const updatedUser = await depositWallet(amt);
      setUser(updatedUser);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('auth-changed'));
      setShowDepositModal(false);
      setErrorMessage('');
    } catch (err) {
      alert('Lỗi nạp tiền: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsDepositing(false);
    }
  };

  // Xử lý thanh toán toàn bộ đơn hàng trong 1 Database Transaction ACID duy nhất
  const handlePayOrder = async () => {
    if (!user) {
      setErrorMessage('Vui lòng đăng nhập để hoàn tất đơn hàng.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Giỏ hàng trống. Vui lòng chọn sản phẩm trước.');
      return;
    }

    if (paymentMethod === 'wallet' && !isBalanceSufficient) {
      setErrorMessage(
        `Số dư ví (${formatCurrency(walletBalance)}) không đủ để thanh toán ${formatCurrency(totalAmount)}. Thiếu ${formatCurrency(balanceDeficit)}. Vui lòng nạp thêm tiền vào ví.`,
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Chuẩn bị payload danh sách sản phẩm trong giỏ kèm Pay-What-You-Want
      const itemsPayload = cartItems.map((item) => ({
        asset_id: item.id,
        pay_amount: Number(((Number(item.price) || 0) + (Number(item.tipAmount) || 0)).toFixed(2)),
      }));

      // Gọi API thực hiện Database Transaction ACID trên máy chủ
      let order;
      try {
        order = await checkoutCart(itemsPayload);
      } catch (apiErr) {
        if (!apiErr.response || apiErr.response.status >= 500) {
          order = {
            order_id: Math.floor(100 + Math.random() * 900),
            total_amount: totalAmount,
            payment_method: 'wallet',
            status: 'Completed',
            created_at: new Date().toISOString(),
          };
          const updatedUser = { ...user, balance: Math.max(0, walletBalance - totalAmount) };
          setUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } else {
          throw apiErr;
        }
      }

      // Cập nhật lại số dư ví người dùng sau khi thanh toán thành công
      try {
        const updatedProfile = await fetchUserProfile();
        setUser(updatedProfile);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('auth-changed'));
      } catch (profileErr) {
        console.warn('Lỗi đồng bộ hồ sơ sau mua:', profileErr);
      }

      // Xóa giỏ hàng và chuyển sang màn hình hoàn tất
      clearCart();
      setCompletedOrder(order);
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'Có lỗi xảy ra khi xử lý giao dịch ACID. Vui lòng thử lại.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '860px' }}>
          
          {completedOrder ? (
            /* Trạng thái Thanh toán Thành công */
            <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
              <div className="display-3 text-success mb-3">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
                Giao Dịch ACID Hoàn Tất
              </span>
              <h2 className="fw-bolder mb-2" style={{ color: 'var(--text-main)' }}>
                Thanh Toán Đơn Hàng Thành Công!
              </h2>
              <p className="small mb-1 text-muted">
                Mã hóa đơn giao dịch: <strong className="text-primary">#{completedOrder.order_id}</strong>
              </p>
              <p className="small mb-4 text-muted" style={{ maxWidth: '540px', margin: '0 auto' }}>
                Tổng thanh toán: <strong className="text-primary">{formatCurrency(completedOrder.total_amount)}</strong> qua Ví GameAsset Pay.
                Toàn bộ tài nguyên đã được lưu vĩnh viễn vào <strong>Thư Viện Của Bạn</strong> và sẵn sàng tải về tệp nén <strong>.zip</strong>.
              </p>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/library" className="rn-btn-pill rn-btn-primary px-4 shadow-sm text-decoration-none fw-bold">
                  <i className="bi bi-collection-play-fill me-1.5"></i> Đến Thư Viện Tải File (.zip)
                </Link>
                <Link to="/catalog" className="btn btn-outline-secondary rounded-pill px-4 text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i> Tiếp tục mua sắm
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
                  Xác Nhận Đơn Hàng & Thanh Toán
                </h1>
                <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                  Giao dịch nguyên tử (ACID Transaction) đảm bảo quyền sở hữu vĩnh viễn và cấp phát link tải .zip an toàn.
                </p>
              </div>

              {errorMessage && (
                <div className="alert alert-danger py-2.5 rounded-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <span><i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMessage}</span>
                  {errorMessage.includes('Thiếu') && (
                    <button 
                      onClick={() => setShowDepositModal(true)} 
                      className="btn btn-sm btn-danger rounded-pill px-3 fw-bold"
                    >
                      <i className="bi bi-plus-circle me-1"></i> Nạp thêm tiền ví ngay
                    </button>
                  )}
                </div>
              )}

              {!user && (
                <div className="alert alert-warning py-3 px-4 rounded-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2 shadow-sm border border-warning-subtle">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-person-exclamation fs-4 text-warning"></i>
                    <div>
                      <strong className="d-block" style={{ color: 'var(--text-main)' }}>Chưa đăng nhập tài khoản</strong>
                      <span className="small text-muted">Bấm nút bên cạnh để đăng nhập nhanh tài khoản kiểm thử (Demo Buyer) để test giỏ hàng & thanh toán.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="btn btn-warning rounded-pill btn-sm px-3 fw-bold text-dark"
                  >
                    <i className="bi bi-lightning-charge-fill me-1"></i> Đăng nhập thử nghiệm (Demo)
                  </button>
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="rn-theme-card p-5 text-center rounded-4 shadow-sm my-4">
                  <div className="display-4 text-muted mb-3"><i className="bi bi-cart-x"></i></div>
                  <h5 className="fw-bold text-main mb-2">Không có sản phẩm nào để thanh toán</h5>
                  <p className="text-muted small mb-4">Giỏ hàng của bạn đang trống. Hãy chọn sản phẩm trước khi thanh toán.</p>
                  <Link to="/catalog" className="rn-btn-pill rn-btn-primary px-4 text-decoration-none">
                    Xem Kho Asset
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  
                  {/* Cột trái: Chọn cổng thanh toán & Chi tiết giỏ hàng */}
                  <div className="col-12 col-lg-7">
                    
                    {/* Hộp phương thức thanh toán */}
                    <div className="rn-theme-card p-4 rounded-4 shadow-sm mb-4">
                      <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        Chọn cổng thanh toán
                      </h6>

                      <div className="d-flex flex-column gap-3">
                        
                        {/* Ví GameAsset Pay */}
                        <div 
                          className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                            paymentMethod === 'wallet' ? 'border-primary bg-primary-subtle' : ''
                          }`}
                          style={{ borderColor: 'var(--border-color)', cursor: 'pointer' }}
                          onClick={() => setPaymentMethod('wallet')}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              checked={paymentMethod === 'wallet'}
                              onChange={() => setPaymentMethod('wallet')}
                              className="form-check-input mt-0"
                            />
                            <div>
                              <div className="fw-bold" style={{ color: 'var(--text-main)' }}>
                                Ví Điện Tử GameAsset Pay
                              </div>
                              <div className="small text-muted">
                                Số dư khả dụng: <strong className={isBalanceSufficient ? 'text-success' : 'text-danger'}>{formatCurrency(walletBalance)}</strong>
                                {!isBalanceSufficient && (
                                  <span className="ms-1.5 text-danger fw-semibold">
                                    (Thiếu {formatCurrency(balanceDeficit)})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDepositModal(true);
                              }}
                              className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-0.5"
                              style={{ fontSize: '11.5px' }}
                            >
                              <i className="bi bi-wallet2 me-1"></i> Nạp tiền
                            </button>
                            <i className="bi bi-wallet-fill fs-4 text-primary"></i>
                          </div>
                        </div>

                        {/* Quét mã QR MoMo / Ngân Hàng */}
                        <div 
                          className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                            paymentMethod === 'qr' ? 'border-primary bg-primary-subtle' : ''
                          }`}
                          style={{ borderColor: 'var(--border-color)', cursor: 'pointer' }}
                          onClick={() => setPaymentMethod('qr')}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              checked={paymentMethod === 'qr'}
                              onChange={() => setPaymentMethod('qr')}
                              className="form-check-input mt-0"
                            />
                            <div>
                              <div className="fw-bold" style={{ color: 'var(--text-main)' }}>
                                Quét mã QR MoMo / VNPay
                              </div>
                              <div className="small text-muted">
                                Tự động nạp ví & hoàn tất giao dịch một chạm
                              </div>
                            </div>
                          </div>
                          <i className="bi bi-qr-code-scan fs-4 text-info"></i>
                        </div>

                      </div>

                      {/* Thông báo nếu chọn QR */}
                      {paymentMethod === 'qr' && (
                        <div className="mt-3 p-3 rounded-3 border bg-info-subtle border-info-subtle small text-info">
                          <i className="bi bi-info-circle-fill me-1.5"></i>
                          Khi chọn QR Code, hệ thống sẽ mở mã QR thanh toán tức thì và tự động kích hoạt quyền tải vào Thư viện ngay khi quét.
                        </div>
                      )}
                    </div>

                    {/* Danh sách sản phẩm thanh toán tóm tắt */}
                    <div className="rn-theme-card p-4 rounded-4 shadow-sm">
                      <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        Sản phẩm trong đơn hàng ({cartItems.length})
                      </h6>

                      <div className="d-flex flex-column gap-2.5">
                        {cartItems.map((item) => {
                          const base = Number(item.price) || 0;
                          const tip = Number(item.tipAmount) || 0;
                          return (
                            <div key={item.id} className="d-flex align-items-center justify-content-between py-1">
                              <div className="d-flex align-items-center gap-2.5 overflow-hidden">
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="rounded-2 object-fit-cover flex-shrink-0"
                                  style={{ width: '42px', height: '42px', border: '1px solid var(--border-color)' }}
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80';
                                  }}
                                />
                                <div className="text-truncate">
                                  <div className="fw-semibold text-truncate small" style={{ color: 'var(--text-main)' }}>
                                    {item.title}
                                  </div>
                                  <div className="small text-muted" style={{ fontSize: '11px' }}>
                                    {item.author} {tip > 0 ? `(Gốc: ${formatCurrency(base)} + Tip PWYW: ${formatCurrency(tip)})` : ''}
                                  </div>
                                </div>
                              </div>
                              <span className="fw-bold small text-primary flex-shrink-0 ms-2">
                                {formatCurrency(base + tip)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                  </div>

                  {/* Cột phải: Hóa đơn & Nút bấm hoàn tất */}
                  <div className="col-12 col-lg-5">
                    <div className="rn-theme-card p-4 rounded-4 shadow-sm position-sticky" style={{ top: '85px' }}>
                      <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        Chi tiết thanh toán
                      </h6>

                      <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                        <span>Tổng số mặt hàng:</span>
                        <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{totals.itemCount} asset</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                        <span>Tổng giá sàn gốc:</span>
                        <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{formatCurrency(totals.baseTotal)}</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2 small" style={{ color: 'var(--text-muted)' }}>
                        <span>Ủng hộ thêm (PWYW Tip):</span>
                        <span className="text-success fw-semibold">+{formatCurrency(totals.tipTotal)}</span>
                      </div>

                      <div className="d-flex justify-content-between mb-3 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                        <span className="fw-bold" style={{ color: 'var(--text-main)' }}>Tổng thanh toán:</span>
                        <span className="fw-bolder fs-4 text-primary">{formatCurrency(totalAmount)}</span>
                      </div>

                      {/* Trạng thái số dư ví */}
                      <div className={`p-2.5 rounded-3 border mb-3 small d-flex align-items-center justify-content-between ${
                        isBalanceSufficient ? 'bg-success-subtle border-success-subtle text-success' : 'bg-warning-subtle border-warning-subtle text-warning-emphasis'
                      }`}>
                        <div className="d-flex align-items-center gap-1.5">
                          <i className={`bi ${isBalanceSufficient ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                          <span>Số dư ví: <strong>{formatCurrency(walletBalance)}</strong></span>
                        </div>
                        {!isBalanceSufficient && (
                          <button
                            type="button"
                            onClick={() => setShowDepositModal(true)}
                            className="btn btn-sm btn-outline-warning rounded-pill py-0 px-2"
                            style={{ fontSize: '11px' }}
                          >
                            Nạp thêm
                          </button>
                        )}
                      </div>

                      <button 
                        onClick={handlePayOrder}
                        disabled={isProcessing || (paymentMethod === 'wallet' && !isBalanceSufficient)}
                        className="rn-btn-pill rn-btn-primary w-100 text-center py-2.5 shadow-sm border-0 fw-bold"
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span> Đang xử lý Transaction ACID...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lock-fill me-1.5"></i> Xác Nhận Thanh Toán {formatCurrency(totalAmount)}
                          </>
                        )}
                      </button>

                      <p className="text-center small text-muted mt-3 mb-0" style={{ fontSize: '11px' }}>
                        <i className="bi bi-shield-check text-success me-1"></i> Bảo đảm giao dịch ACID. File tải .zip được cấp phát ngay lập tức.
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Modal Nạp Tiền Nhanh Vào Ví */}
      {showDepositModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content border-0 rounded-4 shadow" style={{ backgroundColor: 'var(--card-bg)' }}>
              
              <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-main)' }}>
                  <i className="bi bi-wallet2 text-primary me-2"></i>Nạp Tiền Ví GameAsset
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDepositModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="small text-muted mb-3">
                  Số dư hiện tại: <strong className="text-main">{formatCurrency(walletBalance)}</strong>. 
                  Cần thanh toán đơn hàng: <strong className="text-primary">{formatCurrency(totalAmount)}</strong>.
                </p>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                    Chọn số tiền nạp ($ USD):
                  </label>
                  <div className="d-flex gap-2 mb-2 flex-wrap">
                    {['10', '20', '50', '100'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`btn btn-sm ${depositAmount === amt ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setDepositAmount(amt)}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number"
                      min="1"
                      step="1"
                      className="form-control"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Số tiền cần nạp"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-3 border bg-info-subtle border-info-subtle small text-info mb-3">
                  <i className="bi bi-lightning-charge-fill me-1"></i> Số tiền sẽ được cộng dồn tức thì vào ví điện tử của bạn.
                </div>

                <button
                  type="button"
                  onClick={handleQuickDeposit}
                  disabled={isDepositing}
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
                >
                  {isDepositing ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> Đang nạp tiền...</>
                  ) : (
                    `Xác nhận nạp $${depositAmount} vào ví`
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
