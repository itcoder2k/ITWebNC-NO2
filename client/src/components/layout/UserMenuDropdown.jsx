import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, clearAuthData } from '../../services/assetApi';

export default function UserMenuDropdown({ onOpenAuth }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
    setShowDropdown(false);
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="d-flex align-items-center flex-nowrap m-0 p-0" style={{ gap: '10px' }}>
        <button 
          className="btn rounded-pill px-3.5 btn-sm fw-semibold d-inline-flex align-items-center justify-content-center text-nowrap m-0"
          style={{ 
            height: '38px', 
            fontSize: '13.5px', 
            border: '1.5px solid var(--border-color)', 
            color: 'var(--text-main)',
            backgroundColor: 'var(--search-bg)',
            gap: '6px'
          }}
          onClick={() => onOpenAuth('login')}
        >
          <i className="bi bi-box-arrow-in-right lh-1 fs-6"></i>
          <span>Đăng nhập</span>
        </button>
        <button 
          className="rn-btn-pill rn-btn-primary px-3.5 btn-sm d-inline-flex align-items-center justify-content-center text-nowrap m-0 shadow-sm"
          style={{ height: '38px', fontSize: '13.5px', padding: '0 20px' }}
          onClick={() => onOpenAuth('register')}
        >
          Đăng ký
        </button>
      </div>
    );
  }

  // Tên viết tắt Avatar
  const initial = (user.display_name || user.username || 'U')[0].toUpperCase();
  const rawBalance = user.balance !== undefined ? user.balance : user.wallet_balance;
  const balanceStr = rawBalance !== undefined 
    ? `${Number(rawBalance).toLocaleString('vi-VN')} đ` 
    : '0 đ';

  return (
    <div className="dropdown position-relative m-0 p-0 ms-1">
      <button 
        className="btn rounded-pill d-inline-flex align-items-center gap-2 px-3 shadow-sm m-0"
        style={{ 
          height: '38px', 
          backgroundColor: 'var(--search-bg)', 
          border: '1.5px solid var(--border-color)',
          color: 'var(--text-main)'
        }}
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div 
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
          style={{ width: '26px', height: '26px', fontSize: '12px', lineHeight: 1 }}
        >
          {initial}
        </div>
        <span className="small fw-semibold d-none d-md-inline text-truncate" style={{ maxWidth: '120px' }}>
          {user.display_name || user.username}
        </span>
        <i className="bi bi-chevron-down text-muted small ms-1"></i>
      </button>

      {showDropdown && (
        <ul 
          className="dropdown-menu dropdown-menu-end show shadow-lg mt-2 py-2 rounded-3 border-0" 
          style={{ 
            minWidth: '240px', 
            backgroundColor: 'var(--card-bg)', 
            border: '1.5px solid var(--border-color)' 
          }}
        >
          <li className="px-3 py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <div className="fw-bold" style={{ color: 'var(--text-main)' }}>{user.display_name || user.username}</div>
            <div className="small text-truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
            <div className="mt-2 badge bg-success-subtle text-success border border-success-subtle">
              <i className="bi bi-wallet2 me-1"></i> Số dư ví: {balanceStr}
            </div>
          </li>
          <li>
            <Link className="dropdown-item py-2" to="/profile" style={{ color: 'var(--text-main)' }} onClick={() => setShowDropdown(false)}>
              <i className="bi bi-person me-2 text-info"></i> Trang cá nhân
            </Link>
          </li>
          <li>
            <Link className="dropdown-item py-2" to="/library" style={{ color: 'var(--text-main)' }} onClick={() => setShowDropdown(false)}>
              <i className="bi bi-collection-play me-2 text-info"></i> Kho Game đã mua
            </Link>
          </li>
          <li>
            <Link className="dropdown-item py-2" to="/creator/dashboard" style={{ color: 'var(--text-main)' }} onClick={() => setShowDropdown(false)}>
              <i className="bi bi-speedometer2 me-2 text-info"></i> Quản lý bài đăng (Creator)
            </Link>
          </li>
          <li>
            <Link className="dropdown-item py-2" to="/wallet" style={{ color: 'var(--text-main)' }} onClick={() => setShowDropdown(false)}>
              <i className="bi bi-wallet2 me-2 text-info"></i> Nạp tiền ví
            </Link>
          </li>
          <li><hr className="dropdown-divider my-1" style={{ borderColor: 'var(--border-color)' }} /></li>
          <li>
            <button 
              className="dropdown-item py-2 text-danger fw-semibold" 
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
