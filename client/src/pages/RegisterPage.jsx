import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    display_name: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(formData);
      setSuccess('Đăng ký tài khoản thành công! Đang chuyển đến màn hình đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '30px auto' }}>
      <div className="itch-card">
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>
          Tạo tài khoản mới
        </h2>
        <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginBottom: '20px' }}>
          Gia nhập cộng đồng nhà phát triển để mua bán tài nguyên game và nạp tiền ví tiện lợi.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên tài khoản (Username)</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ví dụ: hung_game_dev"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="hung@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Họ và Tên (Tên hiển thị)</label>
            <input
              type="text"
              name="display_name"
              className="form-input"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn Trọng Hùng"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Loại tài khoản</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: formData.role === 'customer' ? '#f0fdf4' : 'var(--bg-card)',
                  border: `1px solid ${formData.role === 'customer' ? 'var(--itch-red)' : 'var(--border-color)'}`,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={handleChange}
                />
                🛒 Khách mua (Buyer)
              </label>

              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: formData.role === 'creator' ? '#faf5ff' : 'var(--bg-card)',
                  border: `1px solid ${formData.role === 'creator' ? 'var(--itch-red)' : 'var(--border-color)'}`,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="creator"
                  checked={formData.role === 'creator'}
                  onChange={handleChange}
                />
                🎨 Nhà sáng tạo (Creator)
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-itch"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-sub)' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: 'var(--itch-red)', fontWeight: '700' }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
