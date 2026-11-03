import React, { useMemo, useState } from 'react';
import {
  deleteAssetReview,
  getCurrentUser,
  submitAssetReview,
} from '../../services/assetApi';

export default function ReviewSection({
  assetId,
  reviews,
  onReviewCreated,
  onReviewDeleted,
}) {
  const currentUser = getCurrentUser();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const average = useMemo(
    () =>
      reviews.length
        ? reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length
        : 0,
    [reviews],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice('');
    setIsSubmitting(true);
    try {
      const createdReview = await submitAssetReview({
        asset_id: Number(assetId),
        rating: Number(rating),
        comment: comment.trim() || undefined,
      });
      if (onReviewCreated) onReviewCreated(createdReview);
      setComment('');
      setNoticeType('success');
      setNotice('Cảm ơn bạn đã gửi đánh giá tài nguyên!');
    } catch (error) {
      setNoticeType('danger');
      setNotice(
        error.response?.data?.message ||
          error.message ||
          'Không thể gửi đánh giá. Vui lòng đảm bảo bạn đã sở hữu tài nguyên và thử lại.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;
    setDeletingId(reviewId);
    try {
      await deleteAssetReview(reviewId);
      if (onReviewDeleted) onReviewDeleted(reviewId);
      setNoticeType('success');
      setNotice('Đã xóa đánh giá thành công.');
    } catch (error) {
      setNoticeType('danger');
      setNotice(
        error.response?.data?.message ||
          error.message ||
          'Không thể xóa đánh giá.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="asset-detail-reviews" id="reviews">
      <div className="asset-detail-section-heading">
        <div>
          <span className="asset-detail-kicker">CỘNG ĐỒNG & CHẤM ĐIỂM</span>
          <h2>Đánh giá từ người mua (Verified Reviews)</h2>
        </div>
        <div className="asset-detail-rating-summary">
          <strong>{reviews.length ? average.toFixed(1) : '—'}</strong>
          <span className="text-warning" aria-label={`${average.toFixed(1)} trên 5 sao`}>
            {renderStars(Math.round(average))}
          </span>
          <small>{reviews.length} đánh giá xác thực</small>
        </div>
      </div>

      <div className="asset-detail-review-layout">
        <div className="asset-detail-card asset-detail-review-list">
          {reviews.length ? (
            reviews.map((review) => {
              const reviewerName =
                review.display_name ||
                review.username ||
                `Người mua #${review.user_id}`;
              const isOwner =
                currentUser &&
                (currentUser.user_id === review.user_id || currentUser.role === 'admin');

              return (
                <article className="asset-detail-review" key={review.review_id}>
                  <div className="asset-detail-review__avatar" aria-hidden="true">
                    {review.avatar_url ? (
                      <img
                        src={review.avatar_url}
                        alt=""
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      reviewerName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="asset-detail-review__body w-100">
                    <div className="asset-detail-review__topline d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <strong>{reviewerName}</strong>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-1.5 py-0.5" style={{ fontSize: '10.5px' }}>
                          <i className="bi bi-shield-check"></i> Đã mua
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <time dateTime={review.created_at} className="small text-muted">
                          {formatDate(review.created_at)}
                        </time>
                        {isOwner && (
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger p-0 border-0"
                            title="Xóa đánh giá"
                            onClick={() => handleDelete(review.review_id)}
                            disabled={deletingId === review.review_id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="asset-detail-stars text-warning my-1" aria-label={`${review.rating} trên 5 sao`}>
                      {renderStars(Number(review.rating))}
                    </div>
                    <p className="mb-0 mt-1">{review.comment || 'Người mua không để lại nhận xét bằng văn bản.'}</p>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="asset-detail-empty-reviews">
              <i className="bi bi-chat-square-heart" aria-hidden="true" />
              <p>Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và chia sẻ!</p>
            </div>
          )}
        </div>

        <form className="asset-detail-card asset-detail-review-form" onSubmit={handleSubmit}>
          <h3>Viết đánh giá tài nguyên</h3>
          <p className="small text-muted mb-3">
            Hệ thống áp dụng chính sách <strong>Verified Purchase</strong> — Chỉ người dùng đã thanh toán sở hữu gói game này mới được gửi chấm sao.
          </p>

          <label htmlFor="asset-review-rating" className="fw-semibold small">
            Đánh giá chất lượng:
          </label>
          <select
            id="asset-review-rating"
            className="form-select mb-3"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          >
            <option value="5">★★★★★ — 5 sao (Xuất sắc)</option>
            <option value="4">★★★★☆ — 4 sao (Rất tốt)</option>
            <option value="3">★★★☆☆ — 3 sao (Bình thường)</option>
            <option value="2">★★☆☆☆ — 2 sao (Chưa đạt kỳ vọng)</option>
            <option value="1">★☆☆☆☆ — 1 sao (Kém)</option>
          </select>

          <label htmlFor="asset-review-comment" className="fw-semibold small">
            Nhận xét chi tiết:
          </label>
          <textarea
            id="asset-review-comment"
            className="form-control"
            rows="4"
            maxLength="5000"
            placeholder="Chia sẻ nhận xét về độ mượt hoạt họa, cấu trúc layer tệp tin, tính ứng dụng trong Unity/Godot..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          {notice && (
            <div className={`alert alert-${noticeType} py-2 mt-3 mb-0 small`} role="status">
              {notice}
            </div>
          )}

          <button
            className="btn btn-app-primary w-100 mt-3 fw-bold"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Đang gửi đánh giá...
              </>
            ) : (
              'Gửi đánh giá xác thực'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, index) => (
    <i
      key={index}
      className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} me-0.5`}
      aria-hidden="true"
    />
  ));
}

function formatDate(value) {
  if (!value) return 'Vừa xong';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Vừa xong'
    : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
}
