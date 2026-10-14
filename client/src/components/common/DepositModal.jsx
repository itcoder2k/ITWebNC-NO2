import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const DepositModal = ({ isOpen, onClose }) => {
  const { deposit } = useAuth();
  const [amount, setAmount] = useState('25');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const quickAmounts = [5, 10, 25, 50, 100];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Vui lòng nhập số tiền nạp hợp lệ lớn hơn $0.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await deposit(numAmount);
      setSuccess(`Nạp thành công $${numAmount.toFixed(2)}! Số dư mới: $${Number(res.user.balance).toFixed(2)}`);
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xử lý nạp tiền.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            💳 Nạp tiền vào ví điện tử
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-sub)',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Chọn mức nạp nhanh:</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {quickAmounts.map((q) => (
                <button
                  type="button"
                  key={q}
                  className={`btn btn-sm ${amount === String(q) ? 'btn-itch' : 'btn-secondary'}`}
                  onClick={() => setAmount(String(q))}
                >
                  +${q}
                </button>
              ))}
            </div>

            <label className="form-label">Hoặc nhập số tiền tùy chọn ($ USD):</label>
            <input
              type="number"
              step="0.01"
              min="1"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ví dụ: 50"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 20 }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={loading}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-itch btn-sm" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
