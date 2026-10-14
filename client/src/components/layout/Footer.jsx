import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        padding: '24px 16px',
        marginTop: 'auto',
        color: 'var(--text-muted)',
        fontSize: '12px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'var(--itch-red)',
              color: '#ffffff',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            🎮
          </div>
          <span style={{ color: 'var(--text-sub)' }}>
            Chợ Tài Nguyên Game Kỹ Thuật Số • Đồ án môn học Thiết kế Web Nâng Cao
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Sinh viên thực hiện: <strong style={{ color: 'var(--text-main)' }}>Nguyễn Trọng Hùng (23010083)</strong></span>
          <span>Phân hệ: <strong style={{ color: 'var(--text-main)' }}>Xác thực (Auth) & Quản lý Người dùng (User)</strong></span>
        </div>
      </div>
    </footer>
  );
};
