import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartCount } from '../../services/cartService';

export default function CartBadge() {
  const [itemCount, setItemCount] = useState(() => getCartCount());

  useEffect(() => {
    const handleCartUpdate = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setItemCount(e.detail.count);
      } else {
        setItemCount(getCartCount());
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  return (
    <Link 
      to="/cart" 
      className="btn rounded-circle position-relative d-inline-flex align-items-center justify-content-center p-0 flex-shrink-0"
      style={{ 
        width: '38px', 
        height: '38px',
        backgroundColor: 'var(--search-bg)',
        border: '1.5px solid var(--border-color)',
        color: 'var(--text-main)',
        margin: '0 4px',
        transition: 'all 0.2s ease'
      }}
      title="Giỏ hàng tài nguyên"
    >
      <i className="bi bi-cart3 fs-6 lh-1"></i>
      {itemCount > 0 && (
        <span 
          className="position-absolute badge rounded-pill bg-danger border border-white"
          style={{
            top: '-5px',
            right: '-5px',
            fontSize: '0.65rem',
            padding: '0.22em 0.45em',
            lineHeight: 1
          }}
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
}
