import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchCategories, getCurrentUser, createAsset } from '../services/assetApi';

export default function UploadAssetPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    short_description: '',
    description: '',
    price: 0,
    suggested_price: 25000,
    thumbnail_url: '',
    engine_compatibility: 'Unity, Godot, Unreal',
    license: 'CC-BY 4.0 (Commercial)',
  });
  const [assetFile, setAssetFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, category_id: data[0].category_id }));
          }
        }
      } catch (err) {
        console.error('Lỗi nạp danh mục:', err);
      }
    }
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'suggested_price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage({ type: 'danger', text: 'Vui lòng đăng nhập trước khi đăng tải tài nguyên.' });
      return;
    }
    if (!formData.title.trim()) {
      setMessage({ type: 'danger', text: 'Vui lòng nhập tên tài nguyên.' });
      return;
    }
    if (!assetFile) {
      setMessage({ type: 'danger', text: 'Vui lòng chọn file tài nguyên .zip, .rar hoặc .unitypackage.' });
      return;
    }
    if (assetFile.size > 200 * 1024 * 1024) {
      setMessage({ type: 'danger', text: 'File tài nguyên vượt quá giới hạn 200 MB.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = new FormData();
      payload.append('file', assetFile);
      payload.append('title', formData.title.trim());
      payload.append('price', String(Number(formData.price) || 0));
      payload.append('short_description', formData.short_description?.trim() || '');
      payload.append('description', formData.description?.trim() || '');
      payload.append('thumbnail_url', formData.thumbnail_url?.trim() || '');
      payload.append('license', formData.license || 'CC-BY 4.0 (Commercial)');
      if (formData.category_id) payload.append('category_id', String(Number(formData.category_id)));

      const res = await createAsset(payload);
      setMessage({ 
        type: 'success', 
        text: 'Đăng tải tài nguyên thành công! Đang chuyển hướng về trang chi tiết...' 
      });
      setTimeout(() => {
        if (res?.asset_id) {
          navigate(`/assets/${res.asset_id}`);
        } else {
          navigate('/catalog');
        }
      }, 1200);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Có lỗi xảy ra khi đăng tài nguyên.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '860px' }}>
          
          {/* Header breadcrumb & Title */}
          <div className="mb-4">
            <Link to="/creator/dashboard" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1 mb-2">
              <i className="bi bi-arrow-left"></i> Quay lại Dashboard
            </Link>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2 rounded-pill fw-semibold">
                  <i className="bi bi-cloud-arrow-up me-1"></i> Creator Studio (itch.io style)
                </span>
                <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                  Đăng Tải Tài Nguyên Mới
                </h1>
                <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                  Chia sẻ mô hình 2D/3D, âm thanh hoặc công cụ game với hàng ngàn nhà phát triển.
                </p>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3`} role="alert">
              <i className={`bi bi-${message.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2`}></i>
              {message.text}
            </div>
          )}

          {/* Form Card */}
          <div className="rn-theme-card p-4 p-md-5 shadow-sm rounded-4">
            <form onSubmit={handleSubmit}>
              
              {/* 1. Tên sản phẩm */}
              <div className="mb-4">
                <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                  Tên tài nguyên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  placeholder="Ví dụ: Pixel Knight 2D Animations Pack"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 2. Danh mục & Engine */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                    Danh mục phân loại <span className="text-danger">*</span>
                  </label>
                  <select
                    name="category_id"
                    className="form-select"
                    style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                    Engine tương thích
                  </label>
                  <input
                    type="text"
                    name="engine_compatibility"
                    className="form-control"
                    style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    placeholder="Unity, Godot, Unreal, Cocos..."
                    value={formData.engine_compatibility}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* 3. Cơ chế định giá PWYW (Pay What You Want) đặc trưng itch.io */}
              <div className="p-3.5 mb-4 rounded-3 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-currency-dollar text-primary fs-5"></i>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
                    Cơ chế Định Giá Trả-Tùy-Tâm (PWYW)
                  </h6>
                  <span className="badge bg-info-subtle text-info border border-info-subtle small">itch.io feature</span>
                </div>
                <p className="small mb-3" style={{ color: 'var(--text-muted)' }}>
                  Cho phép người mua trả số tiền họ muốn để ủng hộ tác giả. Đặt 0 đ để tải miễn phí kèm tùy chọn tip.
                </p>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                      Giá tối thiểu (VNĐ) <span className="text-muted">(Đặt 0 nếu là FREE)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="5000"
                      className="form-control"
                      style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-main)' }}>
                      Giá đề xuất ủng hộ (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="suggested_price"
                      min="0"
                      step="5000"
                      className="form-control"
                      style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                      value={formData.suggested_price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* 4. Link Thumbnail & Giấy phép */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                    Link Ảnh Bìa (Thumbnail URL) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="url"
                    name="thumbnail_url"
                    className="form-control"
                    style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    placeholder="https://images.unsplash.com/... hoặc link ảnh cloud"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                    Giấy phép (License)
                  </label>
                  <select
                    name="license"
                    className="form-select"
                    style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    value={formData.license}
                    onChange={handleChange}
                  >
                    <option value="CC0 (Public Domain)">CC0 (Public Domain)</option>
                    <option value="CC-BY 4.0 (Commercial)">CC-BY 4.0 (Commercial)</option>
                    <option value="Standard Commercial License">Standard Commercial</option>
                  </select>
                </div>
              </div>

              {/* 5. Tệp đính kèm tài nguyên */}
              <div className="mb-4">
                <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                  Tệp tài nguyên (.zip, .rar, .unitypackage) <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".zip,.rar,.unitypackage"
                  className="form-control"
                  style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  onChange={(event) => setAssetFile(event.target.files?.[0] || null)}
                  required
                />
                {assetFile && (
                  <div className="small text-muted mt-2">
                    Đã chọn: {assetFile.name} · {(assetFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>

              {/* 6. Mô tả chi tiết */}
              <div className="mb-4">
                <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  name="short_description"
                  className="form-control mb-3"
                  style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  placeholder="Tóm tắt 1 câu nổi bật về gói tài nguyên này"
                  value={formData.short_description}
                  onChange={handleChange}
                />

                <label className="form-label fw-bold small" style={{ color: 'var(--text-main)' }}>
                  Mô tả chi tiết & Hướng dẫn sử dụng
                </label>
                <textarea
                  name="description"
                  rows="5"
                  className="form-control"
                  style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  placeholder="Bao gồm số lượng sprites, độ phân giải texture, danh sách animations, cách import vào Unity/Godot..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <Link to="/creator/dashboard" className="btn btn-outline-secondary rounded-pill px-4">
                  Hủy bỏ
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rn-btn-pill rn-btn-primary px-4 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up me-1"></i> Xuất bản Tài Nguyên
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
