import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="glass-card" style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-coral)', marginBottom: 12 }}>Truy cập bị từ chối</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Bạn không có quyền truy cập vào trang này (yêu cầu vai trò: <strong>{requiredRole}</strong>).
        </p>
      </div>
    );
  }

  return children;
};
