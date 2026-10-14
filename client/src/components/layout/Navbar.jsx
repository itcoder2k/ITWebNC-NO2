import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DepositModal } from '../common/DepositModal';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Logo & Navigation Tabs chuẩn itch.io */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '900',
                fontSize: '17px',
                letterSpacing: '-0.5px',
                color: 'var(--text-main)',
              }}
            >
              {/* Icon joystick đặc trưng */}
              <div
                style={{
                  background: 'var(--itch-red)',
                  color: '#ffffff',
                  width: '26px',
                  height: '26px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              >
                🎮
              </div>
            </Link>

            {/* Các tab thanh điều hướng trên cùng */}
            <nav style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: '700' }}>
              <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                Khám phá
              </Link>
              <span
                style={{ color: 'var(--text-sub)', cursor: 'not-allowed', opacity: 0.8 }}
                title="Tính năng đang được phát triển"
              >
                Nhật ký Dev
              </span>
              <span
                style={{ color: 'var(--text-sub)', cursor: 'not-allowed', opacity: 0.8 }}
                title="Tính năng đang được phát triển"
              >
                Game Jams
              </span>
              <span
                style={{ color: 'var(--text-sub)', cursor: 'not-allowed', opacity: 0.8 }}
                title="Tính năng đang được phát triển"
              >
                Bảng tin
              </span>
              <span
                style={{ color: 'var(--text-sub)', cursor: 'not-allowed', opacity: 0.8 }}
                title="Tính năng đang được phát triển"
              >
                Cộng đồng
              </span>
            </nav>
          </div>

          {/* Ô Tìm Kiếm trung tâm (Search Input) như trên itch.io */}
          <div style={{ flex: '1', maxWidth: '420px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Tìm kiếm game, tài nguyên, thẻ hoặc tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '30px',
                  padding: '4px 30px 4px 10px',
                  fontSize: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '3px',
                  backgroundColor: '#f9f9fb',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '9px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                }}
              >
                🔍
              </span>
            </div>
          </div>

          {/* Góc Phải: Chuông thông báo + Ví tiền + User profile / Đăng nhập */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated && user ? (
              <>
                {/* Ví tiền */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f4f4f6',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '3px 8px',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ color: 'var(--text-sub)' }}>Ví:</span>
                  <strong style={{ color: '#0e9f6e' }}>
                    ${Number(user.balance || 0).toFixed(2)}
                  </strong>
                  <button
                    className="btn btn-itch btn-sm"
                    style={{ padding: '1px 6px', fontSize: '10px', height: '20px' }}
                    onClick={() => setShowDepositModal(true)}
                  >
                    + Nạp tiền
                  </button>
                </div>

                {/* Chuông thông báo */}
                <span
                  style={{ fontSize: '15px', color: 'var(--text-sub)', cursor: 'pointer' }}
                  title="Thông báo mới"
                >
                  🔔
                </span>

                {/* Avatar & User Name */}
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title="Xem hồ sơ cá nhân"
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '3px',
                      backgroundColor: '#e5e7eb',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'var(--itch-red)',
                    }}
                  >
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-main)' }}>
                    {user.username}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
                </Link>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleLogout}
                  style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/register" className="btn btn-itch btn-sm" style={{ height: '28px' }}>
                  Đăng ký
                </Link>
                <Link to="/login" className="btn btn-secondary btn-sm" style={{ height: '28px' }}>
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal nạp tiền */}
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
    </>
  );
};
