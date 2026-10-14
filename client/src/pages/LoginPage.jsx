import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 3 tài khoản chuẩn xác trong MySQL
  const demoAccounts = [
    {
      roleName: 'Quản trị viên (Admin)',
      roleBadge: 'badge-admin',
      username: 'admin_test',
      email: 'admin_test@example.com',
      password: 'password123',
      desc: 'Toàn quyền kiểm soát, quản lý người dùng & phân hệ',
      icon: '👑',
    },
    {
      roleName: 'Nhà sáng tạo (Creator)',
      roleBadge: 'badge-creator',
      username: 'creator_hung',
      email: 'creator_hung@example.com',
      password: 'password123',
      desc: 'Đăng tải, cập nhật và bán các gói tài nguyên game',
      icon: '🎨',
    },
    {
      roleName: 'Khách mua (Buyer)',
      roleBadge: 'badge-customer',
      username: 'buyer_hung',
      email: 'buyer_hung@example.com',
      password: 'password123',
      desc: 'Mua tài nguyên, nạp tiền ví điện tử cá nhân',
      icon: '🛒',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  const fillAccount = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '30px auto' }}>
      <div className="itch-card">
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>
          Đăng nhập tài khoản
        </h2>
        <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginBottom: '18px' }}>
          Đăng nhập bằng tên tài khoản hoặc email để truy cập chợ tài nguyên và ví của bạn.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username hoặc email..."
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-itch"
            style={{ width: '100%', marginTop: '8px', padding: '10px 0', fontSize: '14px' }}
            disabled={loading}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>

        {/* DANH SÁCH TÀI KHOẢN CHUẨN TRONG CƠ SỞ DỮ LIỆU */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>
              🔑 Tài khoản mẫu trong CSDL MySQL
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              (Click để tự động điền)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {demoAccounts.map((acc) => (
              <div
                key={acc.username}
                onClick={() => fillAccount(acc.username, acc.password)}
                style={{
                  padding: '9px 12px',
                  backgroundColor: '#f9f9fb',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--itch-red)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = '#f9f9fb';
                }}
                title={`Nhấn để điền tài khoản ${acc.roleName}`}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{acc.icon}</span>
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                      {acc.username}
                    </strong>
                    <span className={`badge ${acc.roleBadge}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                      {acc.roleName.split(' ')[0]}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px' }}>
                    Mật khẩu: <code style={{ backgroundColor: '#eeeeee', padding: '1px 4px', borderRadius: '2px', color: '#b91c1c' }}>{acc.password}</code>
                    {' • '}Email: <span>{acc.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px', height: '26px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fillAccount(acc.username, acc.password);
                  }}
                >
                  Điền ➔
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-sub)', textAlign: 'center' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'var(--itch-red)', fontWeight: '700' }}>
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
};
