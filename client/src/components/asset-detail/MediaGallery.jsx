import React, { useEffect, useState } from 'react';

export default function MediaGallery({ asset, media = [] }) {
  const items = media.length
    ? media
    : asset?.thumbnail_url
      ? [
          {
            media_id: `asset-${asset.asset_id}`,
            media_url: asset.thumbnail_url,
            media_type: 'image',
          },
        ]
      : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [asset?.asset_id, media]);

  const selectedMedia = items[selectedIndex];

  return (
    <section className="asset-detail-card asset-detail-gallery" aria-label="Thư viện xem trước">
      <div className="asset-detail-gallery__stage">
        {selectedMedia ? (
          selectedMedia.media_type === 'video' ? (
            <video
              key={selectedMedia.media_id}
              className="asset-detail-gallery__media"
              src={selectedMedia.media_url}
              controls
              preload="metadata"
            />
          ) : selectedMedia.media_type === 'audio' ? (
            <div className="asset-detail-gallery__audio">
              <i className="bi bi-music-note-beamed" aria-hidden="true" />
              <p>Nghe thử âm thanh</p>
              <audio src={selectedMedia.media_url} controls preload="metadata" />
            </div>
          ) : (
            <img
              key={selectedMedia.media_id}
              className="asset-detail-gallery__media"
              src={selectedMedia.media_url}
              alt={`${asset.title} - ảnh xem trước ${selectedIndex + 1}`}
            />
          )
        ) : (
          <div className="asset-detail-gallery__empty">
            <i className="bi bi-image" aria-hidden="true" />
            <span>Chưa có ảnh xem trước cho tài nguyên này.</span>
          </div>
        )}
        {selectedMedia?.media_type === 'gif' && (
          <span className="asset-detail-gallery__animated">ANIMATED DEMO</span>
        )}
      </div>

      {items.length > 1 && (
        <div className="asset-detail-gallery__thumbs" aria-label="Chọn ảnh xem trước">
          {items.map((item, index) => (
            <button
              key={item.media_id}
              type="button"
              className={`asset-detail-gallery__thumb ${selectedIndex === index ? 'is-active' : ''}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Xem trước ${index + 1}`}
              aria-pressed={selectedIndex === index}
            >
              {item.media_type === 'audio' ? (
                <i className="bi bi-music-note-beamed" aria-hidden="true" />
              ) : item.media_type === 'video' ? (
                <span className="asset-detail-gallery__video-thumb">
                  <i className="bi bi-play-fill" aria-hidden="true" />
                </span>
              ) : (
                <img src={item.media_url} alt="" />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
