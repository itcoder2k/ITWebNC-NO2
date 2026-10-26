import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  getCurrentUser, 
  fetchUserProfile, 
  updateUserProfile, 
  depositWallet,
  fetchMyOrders 
} from '../services/assetApi';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'wallet'
  
  // Profile edit form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Wallet topup state
  const [topupAmount, setTopupAmount] = useState(50000);
  const [isDepositing, setIsDepositing] = useState(false);
  const [balance, setBalance] = useState(0);

  // Orders / Transactions history
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Notice alert
  const [notice, setNotice] = useState({ type: '', text: '' });

  // Load fresh profile & orders from backend
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const profile = await fetchUserProfile();
        if (isMounted && profile) {
          setCurrentUser(profile);
          setDisplayName(profile.display_name || profile.username || '');
          setBio(profile.bio || '');
          const rawBal = profile.balance !== undefined ? profile.balance : profile.wallet_balance;
          setBalance(Number(rawBal) || 0);
        }
      } catch (err) {
        console.warn('Không tải được profile mới nhất từ server:', err);
        const local = getCurrentUser();
        if (local) {
          setDisplayName(local.display_name || local.username || '');
          setBio(local.bio || '');
          const rawBal = local.balance !== undefined ? local.balance : local.wallet_balance;
          setBalance(Number(rawBal) || 0);
        }
      }

      // Load orders history
      try {
        setIsLoadingOrders(true);
        const myOrders = await fetchMyOrders();
        if (isMounted && Array.isArray(myOrders)) {
          setOrders(myOrders);
        }
      } catch (err) {
        console.warn('Không nạp được lịch sử đơn hàng:', err);
      } finally {
        if (isMounted) setIsLoadingOrders(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý Cập nhật thông tin cá nhân (PUT /users/profile)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setNotice({ type: '', text: '' });

    try {
      const updated = await updateUserProfile({
        display_name: displayName,
        bio: bio,
      });
      setCurrentUser(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('auth-changed'));
      setNotice({ type: 'success', text: 'Cập nhật thông tin hồ sơ thành công!' });
    } catch (err) {
      setNotice({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.' 
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Xử lý Nạp tiền vào ví GameAsset (POST /users/wallet/deposit)
  const handleTopup = async () => {
    if (!topupAmount || topupAmount <= 0) return;
    setIsDepositing(true);
    setNotice({ type: '', text: '' });

    try {
      const updated = await depositWallet(topupAmount);
      const newBal = updated.balance !== undefined ? updated.balance : updated.wallet_balance;
      setBalance(Number(newBal) || 0);
      setCurrentUser(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('auth-changed'));
      setNotice({ 
        type: 'success', 
        text: `Nạp thành công ${Number(topupAmount).toLocaleString('vi-VN')} đ vào ví nội bộ GameAsset!` 
      });
    } catch (err) {
      setNotice({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.' 
      });
    } finally {
      setIsDepositing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
        <Navbar />
        <main className="flex-grow-1 py-5 d-flex align-items-center">
          <div className="container text-center" style={{ maxWidth: '520px' }}>
            <div className="rn-theme-card p-5 rounded-4 shadow-sm">
              <i className="bi bi-person-lock display-3 text-muted mb-3 d-block"></i>
              <h4 className="fw-bolder mb-2" style={{ color: 'var(--text-main)' }}>Chưa đăng nhập</h4>
              <p className="small text-muted mb-4">
                Vui lòng đăng nhập tài khoản để xem thông tin hồ sơ và quản lý số dư ví điện tử.
              </p>
              <Link to="/" className="rn-btn-pill rn-btn-primary px-4">
                Về Trang Chủ Đăng Nhập
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initial = (currentUser.display_name || currentUser.username || 'U')[0].toUpperCase();

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '920px' }}>
          
          {/* Header Card */}
          <div className="rn-theme-card p-4 rounded-4 shadow-sm mb-4">
            <div className="d-flex align-items-center gap-4 flex-wrap">
              <div 
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-2 flex-shrink-0 shadow-sm"
                style={{ width: '75px', height: '75px' }}
              >
                {initial}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h3 className="fw-bolder mb-0" style={{ color: 'var(--text-main)' }}>
                    {currentUser.display_name || currentUser.username}
                  </h3>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill text-uppercase">
                    {currentUser.role || 'MEMBER'}
                  </span>
                </div>
                <div className="small text-muted mb-2">@{currentUser.username} • {currentUser.email}</div>
                <p className="small mb-0 text-muted" style={{ maxWidth: '620px' }}>
                  {currentUser.bio || 'Chưa cập nhật tiểu sử nghệ sĩ hoặc mô tả cá nhân.'}
                </p>
              </div>
            </div>
          </div>

          {notice.text && (
            <div className={`alert alert-${notice.type} alert-dismissible fade show rounded-3`} role="alert">
              <i className={`bi bi-${notice.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2`}></i>
              {notice.text}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="d-flex gap-2 mb-4 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
            <button 
              className={`btn rounded-pill px-4 btn-sm fw-semibold ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="bi bi-person me-1"></i> Thông Tin Cá Nhân
            </button>
            <button 
              className={`btn rounded-pill px-4 btn-sm fw-semibold ${activeTab === 'wallet' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('wallet')}
            >
              <i className="bi bi-wallet2 me-1"></i> Ví Điện Tử & Nạp Tiền
            </button>
          </div>

          {/* Tab 1: Chỉnh sửa thông tin cá nhân */}
          {activeTab === 'profile' && (
            <div className="rn-theme-card p-4 p-md-5 rounded-4 shadow-sm">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Chỉnh sửa thông tin tài khoản</h5>
              
              <form onSubmit={handleSaveProfile}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>
                      Tên hiển thị (Display Name)
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nhập tên hiển thị công khai"
                      style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>
                      Email (Không thể thay đổi)
                    </label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={currentUser.email || ''}
                      disabled
                      style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>
                      Tiểu sử / Giới thiệu Creator
                    </label>
                    <textarea 
                      rows="3"
                      className="form-control"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Mô tả phong cách thiết kế game, engine sở trường (Unity, Godot, Unreal)..."
                      style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-top d-flex justify-content-end" style={{ borderColor: 'var(--border-color)' }}>
                  <button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                    className="rn-btn-pill rn-btn-primary px-4 shadow-sm border-0"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i> Lưu Thay Đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Quản lý ví GameAsset Pay */}
          {activeTab === 'wallet' && (
            <div className="row g-4">
              {/* Nạp tiền */}
              <div className="col-12 col-md-5">
                <div className="rn-theme-card p-4 rounded-4 shadow-sm h-100">
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill mb-2">
                    <i className="bi bi-wallet2 me-1"></i> Ví GameAsset Pay
                  </span>
                  <div className="small text-muted mb-1">Số dư khả dụng trong MySQL</div>
                  <h2 className="fw-bolder mb-3 text-primary">{balance.toLocaleString('vi-VN')} đ</h2>
                  <p className="small text-muted mb-4">
                    Số dư dùng để mua tài nguyên game với 1 click hoặc nhận tiền bán tài nguyên từ người mua.
                  </p>

                  <h6 className="fw-bold small mb-2" style={{ color: 'var(--text-main)' }}>
                    Chọn mệnh giá nạp (Sandbox):
                  </h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {[50000, 100000, 200000, 500000].map((val) => (
                      <button 
                        key={val} 
                        type="button"
                        className={`btn btn-sm rounded-pill ${topupAmount === val ? 'btn-info text-white' : 'btn-outline-secondary'}`}
                        onClick={() => setTopupAmount(val)}
                      >
                        +{val.toLocaleString('vi-VN')} đ
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleTopup} 
                    disabled={isDepositing}
                    className="rn-btn-pill rn-btn-primary w-100 shadow-sm border-0"
                  >
                    {isDepositing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Đang nạp tiền...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-1"></i> Nạp {topupAmount.toLocaleString('vi-VN')} đ Vào Ví
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Lịch sử giao dịch */}
              <div className="col-12 col-md-7">
                <div className="rn-theme-card p-4 rounded-4 shadow-sm h-100">
                  <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                    Lịch sử giao dịch & Đơn hàng
                  </h6>

                  {isLoadingOrders ? (
                    <div className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-info"></div>
                      <div className="small text-muted mt-2">Đang tải lịch sử giao dịch...</div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-4 text-muted small">
                      <i className="bi bi-clock-history fs-3 d-block mb-2"></i>
                      Chưa có phát sinh đơn hàng nào gần đây.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2.5">
                      {orders.map((order) => (
                        <div 
                          key={order.order_id} 
                          className="d-flex align-items-center justify-content-between p-2.5 rounded-3 border"
                          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-bag-check-fill text-primary fs-5"></i>
                            <div>
                              <div className="small fw-bold" style={{ color: 'var(--text-main)' }}>
                                Đơn hàng #{order.order_id}
                              </div>
                              <div className="text-muted" style={{ fontSize: '11px' }}>
                                Trạng thái: <span className="text-success">{order.status || 'Completed'}</span>
                              </div>
                            </div>
                          </div>
                          <span className="fw-bold text-danger">
                            -{Number(order.total_amount || 0).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

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
