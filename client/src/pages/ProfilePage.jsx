import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DepositModal } from '../components/common/DepositModal';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);

  if (!user) return null;

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Quản trị viên (Admin)';
    if (role === 'creator') return 'Nhà sáng tạo (Creator)';
    return 'Khách hàng (Customer)';
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Dải menu phụ kiểu itch.io */}
      <div className="sub-nav">
        <div className="sub-nav-item active">Tài khoản & Ví tiền</div>
        <div className="sub-nav-item">Tài nguyên đã mua</div>
        <div className="sub-nav-item">Cài đặt bảo mật</div>
      </div>

      {/* Thẻ tổng quan người dùng */}
      <div
        className="itch-card"
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '4px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--itch-red)',
            }}
          >
            {(user.display_name || user.fullName || user.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                {user.display_name || user.fullName || user.username}
              </h2>
              <span className={`badge badge-${user.role}`}>{getRoleLabel(user.role)}</span>
            </div>
            <div style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '2px' }}>
              @{user.username} • {user.email}
            </div>
          </div>
        </div>

        <button className="btn btn-itch" onClick={() => setShowDepositModal(true)}>
          + Nạp tiền vào ví
        </button>
      </div>

      {/* Grid 2 cột: Ví tiền & Thông tin bảo mật */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Thẻ Số Dư Ví */}
        <div className="itch-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              Số dư ví điện tử
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ví USD</span>
          </div>

          <div
            style={{
              padding: '16px 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '4px' }}>Số dư khả dụng</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#0e9f6e' }}>
              ${Number(user.balance || 0).toFixed(2)}
            </div>
          </div>

          <button
            className="btn btn-itch"
            style={{ width: '100%' }}
            onClick={() => setShowDepositModal(true)}
          >
            Nạp thêm tiền vào ví
          </button>
        </div>

        {/* Thẻ Bảo Mật & Phiên Làm Việc */}
        <div className="itch-card">
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
            Thông tin định danh & Bảo mật
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-sub)' }}>Mã định danh User ID:</span>
              <strong style={{ color: 'var(--text-main)' }}>#{user.user_id || user.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-sub)' }}>Vai trò tài khoản:</span>
              <span className={`badge badge-${user.role}`}>{getRoleLabel(user.role)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-sub)' }}>Phương thức xác thực:</span>
              <strong style={{ color: 'var(--text-main)' }}>JWT (JSON Web Token)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-sub)' }}>Cơ chế kiểm soát truy cập:</span>
              <strong style={{ color: 'var(--text-main)' }}>RBAC (Phân quyền bảo vệ)</strong>
            </div>
          </div>
        </div>
      </div>

      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
    </div>
  );
};
