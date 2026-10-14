import React, { useState, useEffect } from 'react';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#28282d',
        color: '#ffffff',
        borderTop: '2px solid var(--itch-red)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        zIndex: 9999,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.3)',
        fontSize: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}>🍪</span>
        <span>
          <strong>Chính sách Cookie & Bảo mật:</strong> Trang web sử dụng bộ nhớ cục bộ (LocalStorage) và Cookie kỹ thuật cần thiết để duy trì phiên đăng nhập JWT an toàn và bảo vệ ví tài khoản của bạn (Tuân thủ theo điều khoản GDPR & ePrivacy).
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleAccept}
          className="btn btn-itch btn-sm"
          style={{ padding: '4px 14px', fontSize: '12px' }}
        >
          Tôi đồng ý
        </button>
      </div>
    </div>
  );
};
