import React, { useState } from 'react';
import { loginUser, registerUser } from '../../services/assetApi';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onAuthSuccess }) {
  const [tab, setTab] = useState(initialTab);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (tab === 'login') {
        const res = await loginUser(usernameOrEmail, password);
        window.dispatchEvent(new CustomEvent('auth-changed'));
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await registerUser({
          username,
          email,
          password,
          display_name: displayName || username,
        });
        window.dispatchEvent(new CustomEvent('auth-changed'));
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      const msg = err.response?.data?.message || 'Đăng nhập/Đăng ký không thành công. Vui lòng kiểm tra lại thông tin!';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(6px)', zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div 
          className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-main)',
            border: '1.5px solid var(--border-color)'
          }}
        >
          
          {/* Header with Tabs */}
          <div 
            className="modal-header px-4 pt-4 pb-2" 
            style={{ 
              backgroundColor: 'var(--card-header-bg)', 
              borderBottom: '1px solid var(--border-color)' 
            }}
          >
            <ul className="nav nav-pills w-100 justify-content-center gap-2">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link rounded-pill px-4 fw-bold ${tab === 'login' ? 'active rn-btn-primary' : ''}`}
                  style={tab !== 'login' ? { color: 'var(--text-muted)' } : {}}
                  onClick={() => { setTab('login'); setErrorMsg(''); }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link rounded-pill px-4 fw-bold ${tab === 'register' ? 'active rn-btn-primary' : ''}`}
                  style={tab !== 'register' ? { color: 'var(--text-muted)' } : {}}
                  onClick={() => { setTab('register'); setErrorMsg(''); }}
                >
                  <i className="bi bi-person-plus me-1"></i> Đăng ký
                </button>
              </li>
            </ul>
            <button 
              type="button" 
              className="btn-close ms-2"
              onClick={onClose}
              style={{ filter: 'var(--text-main) === #ffffff ? invert(1) : none' }}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            
            {errorMsg && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 rounded-3 mb-3">
                <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                <div>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {tab === 'login' ? (
                /* Form Đăng Nhập */
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                      Tên đăng nhập hoặc Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--search-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                        <i className="bi bi-person"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Nhập username hoặc email" 
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        required 
                        style={{ 
                          backgroundColor: 'var(--search-bg)', 
                          borderColor: 'var(--border-color)', 
                          color: 'var(--text-main)' 
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Form Đăng Ký */
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                      Tên người dùng (Username)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--search-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                        <i className="bi bi-at"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ví dụ: gamedev99" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                        style={{ 
                          backgroundColor: 'var(--search-bg)', 
                          borderColor: 'var(--border-color)', 
                          color: 'var(--text-main)' 
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                      Họ và tên hiển thị (Display Name)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--search-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                        <i className="bi bi-card-heading"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ví dụ: Nguyễn Trọng Hùng" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        style={{ 
                          backgroundColor: 'var(--search-bg)', 
                          borderColor: 'var(--border-color)', 
                          color: 'var(--text-main)' 
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                      Địa chỉ Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--search-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="name@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ 
                          backgroundColor: 'var(--search-bg)', 
                          borderColor: 'var(--border-color)', 
                          color: 'var(--text-main)' 
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password field dùng chung */}
              <div className="mb-4">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                  Mật khẩu
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--search-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <i className="bi bi-lock"></i>
                  </span>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Tối thiểu 6 ký tự" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    minLength={6}
                    style={{ 
                      backgroundColor: 'var(--search-bg)', 
                      borderColor: 'var(--border-color)', 
                      color: 'var(--text-main)' 
                    }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn w-100 rounded-pill py-2.5 fw-bold rn-btn-primary shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  tab === 'login' ? 'Đăng Nhập Vào Hệ Thống' : 'Tạo Tài Khoản Mới'
                )}
              </button>
            </form>

            <div className="text-center mt-3 small" style={{ color: 'var(--text-muted)' }}>
              {tab === 'login' ? (
                <>Chưa có tài khoản? <span className="text-info fw-bold cursor-pointer" role="button" onClick={() => { setTab('register'); setErrorMsg(''); }}>Đăng ký ngay</span></>
              ) : (
                <>Đã có tài khoản? <span className="text-info fw-bold cursor-pointer" role="button" onClick={() => { setTab('login'); setErrorMsg(''); }}>Đăng nhập</span></>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
