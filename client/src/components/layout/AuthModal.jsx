import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${tab === 'login' ? 'Đăng nhập' : 'Đăng ký'} thành công! (Dữ liệu thử nghiệm)`);
    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-white border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* Header with Tabs */}
          <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-2 bg-light">
            <ul className="nav nav-pills w-100 justify-content-center gap-2">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link rounded-pill px-4 fw-semibold ${tab === 'login' ? 'active btn-app-primary' : 'text-secondary'}`}
                  onClick={() => setTab('login')}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link rounded-pill px-4 fw-semibold ${tab === 'register' ? 'active btn-app-primary' : 'text-secondary'}`}
                  onClick={() => setTab('register')}
                >
                  <i className="bi bi-person-plus me-1"></i> Đăng ký
                </button>
              </li>
            </ul>
            <button 
              type="button" 
              className="btn-close ms-2" 
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              {tab === 'register' && (
                <div className="mb-3">
                  <label className="form-label text-dark fw-medium small">Họ và tên</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light-subtle text-secondary">
                      <i className="bi bi-person"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-light-subtle" 
                      placeholder="Nguyễn Văn A" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label text-dark fw-medium small">Địa chỉ Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-light-subtle text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    className="form-control border-light-subtle" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-dark fw-medium small">Mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-light-subtle text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input 
                    type="password" 
                    className="form-control border-light-subtle" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-app-primary w-100 py-2 shadow-sm">
                {tab === 'login' ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản Mới'}
              </button>
            </form>

            <div className="text-center mt-3 text-muted small">
              {tab === 'login' ? (
                <>Chưa có tài khoản? <span className="text-primary fw-semibold cursor-pointer" role="button" onClick={() => setTab('register')}>Đăng ký ngay</span></>
              ) : (
                <>Đã có tài khoản? <span className="text-primary fw-semibold cursor-pointer" role="button" onClick={() => setTab('login')}>Đăng nhập</span></>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
