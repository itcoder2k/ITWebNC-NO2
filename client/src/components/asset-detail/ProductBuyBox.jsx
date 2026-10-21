import React, { useState } from 'react';
import { checkoutAsset, requestAssetDownload } from '../../services/assetApi';

function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
}

function formatDate(date) {
  if (!date) return 'Chưa cập nhật';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(
    new Date(date),
  );
}

export default function ProductBuyBox({ asset, categoryName }) {
  const floorPrice = Number(asset.price) || 0;
  const [payAmount, setPayAmount] = useState(String(floorPrice));
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const showError = (error) => {
    setMessage(
      error.response?.data?.message ||
        error.message ||
        'Không thể hoàn tất yêu cầu. Vui lòng thử lại.',
    );
    setMessageType('danger');
  };

  const handleAction = async () => {
    setMessage('');
    setDownloadUrl('');
    setIsSubmitting(true);
    try {
      if (floorPrice === 0 || purchaseComplete) {
        const result = await requestAssetDownload(asset.asset_id);
        setDownloadUrl(result.file_url);
        setMessage('Đã xác nhận quyền tải. Chọn liên kết bên dưới để tải tệp.');
        setMessageType('success');
      } else {
        await checkoutAsset(asset.asset_id, payAmount);
        setPurchaseComplete(true);
        setMessage('Thanh toán thành công! Bạn có thể tải tài nguyên ngay.');
        setMessageType('success');
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="asset-detail-card asset-detail-buybox">
      <div className="asset-detail-buybox__eyebrow">
        <span className="asset-detail-category">
          {categoryName || (asset.category_id ? `Danh mục #${asset.category_id}` : 'Game asset')}
        </span>
        <span className="asset-detail-status">
          <i className="bi bi-patch-check-fill" aria-hidden="true" /> Đã kiểm duyệt
        </span>
      </div>

      <h1 className="asset-detail-buybox__title">{asset.title}</h1>
      <p className="asset-detail-buybox__summary">
        {asset.short_description || 'Tài nguyên game chất lượng cao dành cho dự án của bạn.'}
      </p>

      <div className="asset-detail-buybox__meta">
        <span><i className="bi bi-calendar3" aria-hidden="true" /> Cập nhật {formatDate(asset.updated_at)}</span>
        <span><i className="bi bi-download" aria-hidden="true" /> {asset.downloads_count || 0} lượt tải</span>
      </div>

      <div className="asset-detail-price">
        <span className="asset-detail-price__label">
          {floorPrice === 0 ? 'Miễn phí' : 'Giá tối thiểu'}
        </span>
        <strong>{floorPrice === 0 ? 'FREE' : formatPrice(floorPrice)}</strong>
      </div>

      {floorPrice > 0 && !purchaseComplete && (
        <label className="asset-detail-pay-amount">
          <span>Bạn muốn trả bao nhiêu?</span>
          <div className="input-group">
            <span className="input-group-text">₫</span>
            <input
              type="number"
              className="form-control"
              min={floorPrice}
              step="0.01"
              value={payAmount}
              onChange={(event) => setPayAmount(event.target.value)}
              aria-describedby="asset-detail-minimum"
            />
          </div>
          <small id="asset-detail-minimum">
            Giá quy đổi tham khảo: {formatPrice(floorPrice)}. Có thể trả cao hơn để ủng hộ creator.
          </small>
        </label>
      )}

      <button
        type="button"
        className="btn btn-app-primary asset-detail-buybox__action"
        onClick={handleAction}
        disabled={isSubmitting || (floorPrice > 0 && !purchaseComplete && Number(payAmount) < floorPrice)}
      >
        {isSubmitting ? (
          <><span className="spinner-border spinner-border-sm" aria-hidden="true" /> Đang xử lý...</>
        ) : floorPrice === 0 || purchaseComplete ? (
          <><i className="bi bi-download" aria-hidden="true" /> Tải xuống</>
        ) : (
          <><i className="bi bi-bag-check" aria-hidden="true" /> Mua bằng ví</>
        )}
      </button>

      {message && (
        <div className={`alert alert-${messageType} py-2 mt-3 mb-0`} role="status">
          {message}
        </div>
      )}
      {downloadUrl && (
        <a className="asset-detail-download-link" href={downloadUrl} download>
          <i className="bi bi-file-earmark-zip" aria-hidden="true" /> Tải file tài nguyên
        </a>
      )}

      <ul className="asset-detail-license">
        <li><i className="bi bi-shield-check" aria-hidden="true" /> {asset.license || 'Standard Indie Commercial License'}</li>
        <li><i className="bi bi-infinity" aria-hidden="true" /> Truy cập lâu dài sau khi sở hữu</li>
        <li><i className="bi bi-box-seam" aria-hidden="true" /> Kích thước gói: {formatBytes(asset.file_size)}</li>
      </ul>
    </aside>
  );
}

function formatBytes(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Chưa có thông tin';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
