import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedAssetsSlider({ assets, currentAssetId }) {
  const related = assets
    .filter((asset) => Number(asset.asset_id) !== Number(currentAssetId))
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <section className="asset-detail-related">
      <div className="asset-detail-section-heading">
        <div>
          <span className="asset-detail-kicker">KHÁM PHÁ THÊM</span>
          <h2>Bạn có thể cũng thích</h2>
        </div>
      </div>
      <div className="asset-detail-related__grid">
        {related.map((asset) => (
          <Link
            className="asset-detail-card asset-detail-related-card"
            to={`/assets/${asset.asset_id}`}
            key={asset.asset_id}
          >
            <div className="asset-detail-related-card__image">
              {asset.thumbnail_url ? (
                <img src={asset.thumbnail_url} alt="" loading="lazy" />
              ) : (
                <i className="bi bi-image" aria-hidden="true" />
              )}
            </div>
            <div className="asset-detail-related-card__content">
              <h3>{asset.title}</h3>
              <span>{Number(asset.price) === 0 ? 'FREE' : formatPrice(asset.price)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
}
