import React from 'react';
import { Link } from 'react-router-dom';

export default function CartBadge({ count = 2 }) {
  return (
    <Link 
      to="/blank?tab=cart" 
      className="btn btn-light border border-light-subtle rounded-circle position-relative p-2 d-flex align-items-center justify-content-center text-dark shadow-sm"
      style={{ width: '40px', height: '40px' }}
      title="Giỏ hàng tài nguyên"
    >
      <i className="bi bi-cart3 fs-6"></i>
      {count > 0 && (
        <span className="badge rounded-pill bg-danger cart-badge">
          {count}
        </span>
      )}
    </Link>
  );
}
