import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'description', label: 'Mô tả', icon: 'bi-card-text' },
  { id: 'tags', label: 'Thẻ phân loại', icon: 'bi-tags' },
  { id: 'files', label: 'Tệp bao gồm', icon: 'bi-file-earmark-zip' },
  { id: 'compatibility', label: 'Tương thích', icon: 'bi-layers' },
];

export default function ProductSpecTabs({ asset, tags = [] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="asset-detail-card asset-detail-specs">
      <div className="asset-detail-specs__tabs" role="tablist" aria-label="Thông tin tài nguyên">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`asset-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`asset-panel-${tab.id}`}
            className={activeTab === tab.id ? 'is-active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`bi ${tab.icon}`} aria-hidden="true" /> {tab.label}
          </button>
        ))}
      </div>

      <div
        className="asset-detail-specs__content"
        role="tabpanel"
        id={`asset-panel-${activeTab}`}
        aria-labelledby={`asset-tab-${activeTab}`}
      >
        {activeTab === 'description' && (
          <div>
            <h2>Về gói tài nguyên</h2>
            <p className="asset-detail-description">
              {asset.description || asset.short_description || 'Người tạo chưa cung cấp mô tả chi tiết cho tài nguyên này.'}
            </p>
          </div>
        )}

        {activeTab === 'tags' && (
          <div>
            <h2>Thẻ phân loại & Phong cách</h2>
            {tags && tags.length > 0 ? (
              <div className="d-flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.tag_id}
                    to={`/catalog?tag=${tag.slug}`}
                    className="badge text-decoration-none py-2 px-3 rounded-pill"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--primary-color)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <i className="bi bi-tag-fill me-1"></i> #{tag.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted">
                Tài nguyên này chưa được gắn thẻ phân loại cụ thể.
              </p>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <h2>Thông tin tệp</h2>
            <dl className="asset-detail-file-list">
              <div><dt>Định dạng tệp nén</dt><dd>.ZIP lưu trữ an toàn chống lậu</dd></div>
              <div><dt>Dung lượng gói</dt><dd>{formatBytes(asset.file_size)}</dd></div>
              <div><dt>Giấy phép bản quyền</dt><dd>{asset.license || 'Standard Indie Commercial License'}</dd></div>
            </dl>
          </div>
        )}

        {activeTab === 'compatibility' && (
          <div>
            <h2>Tương thích Engine & Công cụ</h2>
            <p className="asset-detail-description">
              Định dạng chuẩn quốc tế, hoàn toàn tương thích và dễ dàng import kéo thả trực tiếp vào các Game Engine phổ biến:
            </p>
            <div className="row g-2 mt-2">
              <div className="col-12 col-md-4">
                <div className="p-2.5 rounded border border-secondary-subtle bg-body-tertiary">
                  <strong><i className="bi bi-box me-1 text-primary"></i> Unity Engine</strong>
                  <p className="small text-muted mb-0 mt-1">Hỗ trợ Unity 2021 LTS, 2022 LTS và Unity 6.</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-2.5 rounded border border-secondary-subtle bg-body-tertiary">
                  <strong><i className="bi bi-gear-wide-connected me-1 text-info"></i> Godot Engine</strong>
                  <p className="small text-muted mb-0 mt-1">Hỗ trợ Godot 3.5 và Godot 4.x (.png, .wav, .gltf).</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-2.5 rounded border border-secondary-subtle bg-body-tertiary">
                  <strong><i className="bi bi-cpu me-1 text-danger"></i> Unreal Engine</strong>
                  <p className="small text-muted mb-0 mt-1">Hỗ trợ UE 4.27, UE 5.3, UE 5.4.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function formatBytes(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Chưa có thông tin';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
