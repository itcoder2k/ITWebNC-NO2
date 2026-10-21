import React, { useMemo, useState } from 'react';
import { submitAssetReview } from '../../services/assetApi';

export default function ReviewSection({ assetId, reviews, onReviewCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      onReviewCreated(createdReview);
      setComment('');
      setNotice('Cảm ơn bạn đã gửi đánh giá!');
    } catch (error) {
      setNotice(
        error.response?.data?.message ||
          error.message ||
          'Không thể gửi đánh giá. Vui lòng thử lại.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="asset-detail-reviews" id="reviews">
      <div className="asset-detail-section-heading">
        <div>
          <span className="asset-detail-kicker">CỘNG ĐỒNG</span>
          <h2>Đánh giá từ người mua</h2>
        </div>
        <div className="asset-detail-rating-summary">
          <strong>{reviews.length ? average.toFixed(1) : '—'}</strong>
          <span aria-label={`${average.toFixed(1)} trên 5 sao`}>
            {renderStars(Math.round(average))}
          </span>
          <small>{reviews.length} đánh giá</small>
        </div>
      </div>

      <div className="asset-detail-review-layout">
        <div className="asset-detail-card asset-detail-review-list">
          {reviews.length ? (
            reviews.map((review) => (
              <article className="asset-detail-review" key={review.review_id}>
                <div className="asset-detail-review__avatar" aria-hidden="true">
                  {String(review.user_id).slice(-1)}
                </div>
                <div className="asset-detail-review__body">
                  <div className="asset-detail-review__topline">
                    <strong>Người mua #{review.user_id}</strong>
                    <time dateTime={review.created_at}>
                      {formatDate(review.created_at)}
                    </time>
                  </div>
                  <div className="asset-detail-stars" aria-label={`${review.rating} trên 5 sao`}>
                    {renderStars(Number(review.rating))}
                  </div>
                  <p>{review.comment || 'Người mua không để lại nhận xét.'}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="asset-detail-empty-reviews">
              <i className="bi bi-chat-square-heart" aria-hidden="true" />
              <p>Chưa có đánh giá. Hãy là người đầu tiên chia sẻ trải nghiệm!</p>
            </div>
          )}
        </div>

        <form className="asset-detail-card asset-detail-review-form" onSubmit={handleSubmit}>
          <h3>Viết đánh giá</h3>
          <p>Chỉ người đã mua tài nguyên mới có thể gửi đánh giá.</p>
          <label htmlFor="asset-review-rating">Số sao</label>
          <select
            id="asset-review-rating"
            className="form-select"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} sao</option>
            ))}
          </select>
          <label htmlFor="asset-review-comment">Nhận xét</label>
          <textarea
            id="asset-review-comment"
            className="form-control"
            rows="4"
            maxLength="5000"
            placeholder="Chia sẻ trải nghiệm của bạn về tài nguyên..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          {notice && <div className="alert alert-info py-2 mt-3 mb-0" role="status">{notice}</div>}
          <button className="btn btn-app-primary mt-3" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
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
      className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'}`}
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
