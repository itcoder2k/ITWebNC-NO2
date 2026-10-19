import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserMenuDropdown({ onOpenAuth }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const mockUser = {
    name: 'Nguyễn Trọng Hùng',
    email: 'hung.nt23010083@phenikaa.edu.vn',
    balance: '500,000 đ',
    role: 'Creator & Buyer'
  };

  if (!isLoggedIn) {
    return (
      <div className="d-flex align-items-center gap-2">
        <button 
          className="btn btn-outline-secondary rounded-pill px-3 py-1 btn-sm fw-medium border-light-subtle text-dark"
          onClick={() => onOpenAuth('login')}
        >
          <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
        </button>
        <button 
          className="btn btn-app-primary px-3 py-1 btn-sm"
          onClick={() => onOpenAuth('register')}
        >
          Đăng ký
        </button>
      </div>
    );
  }

  return (
    <div className="dropdown position-relative">
      <button 
        className="btn btn-light border border-light-subtle rounded-pill d-flex align-items-center gap-2 py-1 px-3 shadow-sm"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div 
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
          style={{ width: '28px', height: '28px', fontSize: '12px' }}
        >
          H
        </div>
        <span className="text-dark small fw-semibold d-none d-md-inline">{mockUser.name}</span>
        <i className="bi bi-chevron-down text-muted small"></i>
      </button>

      {showDropdown && (
        <ul className="dropdown-menu dropdown-menu-end show shadow-lg mt-2 py-2 border-0 rounded-3" style={{ minWidth: '240px' }}>
          <li className="px-3 py-2 border-bottom border-light-subtle">
            <div className="fw-bold text-dark">{mockUser.name}</div>
            <div className="text-muted small text-truncate">{mockUser.email}</div>
            <div className="mt-2 badge bg-success-subtle text-success border border-success-subtle">
              <i className="bi bi-wallet2 me-1"></i> Số dư ví: {mockUser.balance}
            </div>
          </li>
          <li>
            <Link className="dropdown-item py-2 text-dark" to="/blank?tab=profile" onClick={() => setShowDropdown(false)}>
              <i className="bi bi-person me-2 text-primary"></i> Trang cá nhân
            </Link>
          </li>
          <li>
            <Link className="dropdown-item py-2 text-dark" to="/blank?tab=purchases" onClick={() => setShowDropdown(false)}>
              <i className="bi bi-bag-check me-2 text-primary"></i> Asset đã mua
            </Link>
          </li>
          <li>
            <Link className="dropdown-item py-2 text-dark" to="/blank?tab=wallet" onClick={() => setShowDropdown(false)}>
              <i className="bi bi-wallet2 me-2 text-primary"></i> Nạp tiền ví
            </Link>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button 
              className="dropdown-item py-2 text-danger" 
              onClick={() => {
                setIsLoggedIn(false);
                setShowDropdown(false);
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
