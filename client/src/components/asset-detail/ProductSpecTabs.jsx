import React, { useState } from 'react';

const tabs = [
  { id: 'description', label: 'Mô tả', icon: 'bi-card-text' },
  { id: 'files', label: 'Tệp bao gồm', icon: 'bi-file-earmark-zip' },
  { id: 'compatibility', label: 'Tương thích', icon: 'bi-layers' },
];

export default function ProductSpecTabs({ asset }) {
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
        {activeTab === 'files' && (
          <div>
            <h2>Thông tin tệp</h2>
            <dl className="asset-detail-file-list">
              <div><dt>Định dạng gói</dt><dd>Thông tin định dạng chưa được cung cấp</dd></div>
              <div><dt>Kích thước</dt><dd>{formatBytes(asset.file_size)}</dd></div>
              <div><dt>Giấy phép</dt><dd>{asset.license || 'Standard Indie Commercial License'}</dd></div>
            </dl>
          </div>
        )}
        {activeTab === 'compatibility' && (
          <div>
            <h2>Tương thích</h2>
            <p className="asset-detail-description">
              Thông tin phiên bản Unity, Unreal Engine hoặc Godot chưa được nhập cho sản phẩm này.
              Vui lòng kiểm tra mô tả của creator trước khi sử dụng.
            </p>
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
