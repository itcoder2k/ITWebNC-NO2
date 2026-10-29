import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchAssets, getCurrentUser, updateAsset, deleteAsset } from '../services/assetApi';

export default function CreatorDashboardPage() {
  const currentUser = getCurrentUser();
  const [myAssets, setMyAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadCreatorData() {
      setIsLoading(true);
      try {
        const allAssets = await fetchAssets();
        if (Array.isArray(allAssets)) {
          if (currentUser?.user_id) {
            // Lọc các asset do user này đăng
            const filtered = allAssets.filter(
              (a) => Number(a.uploader_id) === Number(currentUser.user_id)
            );
            // Nếu user mới chưa có asset nào, nếu là admin hoặc demo hiển thị toàn bộ asset mẫu
            setMyAssets(filtered);
          } else {
            setMyAssets(allAssets.slice(0, 5));
          }
        }
      } catch (err) {
        console.error('Lỗi nạp dashboard creator:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCreatorData();
  }, [currentUser?.user_id]);

  const reloadAssets = async () => {
    try {
      const allAssets = await fetchAssets();
      if (Array.isArray(allAssets)) {
        if (currentUser?.user_id) {
          setMyAssets(allAssets.filter((asset) => Number(asset.uploader_id) === Number(currentUser.user_id)));
        } else {
          setMyAssets(allAssets.slice(0, 5));
        }
      }
    } catch (error) {
      setActionMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Không thể tải lại danh sách tài nguyên.',
      });
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingAsset((previous) => ({
      ...previous,
      [name]: name === 'price' || name === 'category_id' ? Number(value) : value,
    }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingAsset?.asset_id) return;

    setIsSaving(true);
    setActionMessage({ type: '', text: '' });
    try {
      await updateAsset(editingAsset.asset_id, {
        title: editingAsset.title.trim(),
        short_description: editingAsset.short_description?.trim() || '',
        description: editingAsset.description?.trim() || '',
        price: Number(editingAsset.price) || 0,
        thumbnail_url: editingAsset.thumbnail_url?.trim() || '',
        license: editingAsset.license || '',
        category_id: Number(editingAsset.category_id) || undefined,
      });
      setEditingAsset(null);
      setActionMessage({ type: 'success', text: 'Đã cập nhật tài nguyên thành công.' });
      await reloadAssets();
    } catch (error) {
      setActionMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Không thể cập nhật tài nguyên.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAsset = async (asset) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài nguyên "${asset.title}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setActionMessage({ type: '', text: '' });
    try {
      await deleteAsset(asset.asset_id);
      setActionMessage({ type: 'success', text: 'Đã xóa tài nguyên thành công.' });
      await reloadAssets();
    } catch (error) {
      setActionMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Không thể xóa tài nguyên.',
      });
    }
  };

  const totalDownloads = myAssets.reduce((acc, a) => acc + (Number(a.downloads_count) || 0), 0);
  const totalEstimatedEarnings = myAssets.reduce((acc, a) => {
    const price = Number(a.price) || 0;
    const downloads = Number(a.downloads_count) || 0;
    return acc + price * downloads;
  }, 0);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '1020px' }}>
          
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2 rounded-pill fw-semibold">
                <i className="bi bi-speedometer2 me-1"></i> Creator Dashboard
              </span>
              <h1 className="fw-bolder mb-1" style={{ fontSize: '28px', color: 'var(--text-main)' }}>
                Quản Lý Tài Nguyên Đăng Bán
              </h1>
              <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                Theo dõi hiệu quả tải về, doanh thu từ cơ chế Trả-Tùy-Tâm và cập nhật nội dung.
              </p>
            </div>
            <Link to="/upload" className="rn-btn-pill rn-btn-primary px-3.5 shadow-sm text-decoration-none">
              <i className="bi bi-plus-lg me-1"></i> Đăng Tài Nguyên Mới
            </Link>
          </div>

          {actionMessage.text && (
            <div className={`alert alert-${actionMessage.type === 'success' ? 'success' : 'danger'} rounded-3`} role="alert">
              <i className={`bi bi-${actionMessage.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2`}></i>
              {actionMessage.text}
            </div>
          )}

          {/* 3 Thẻ Thống kê nhanh */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-4">
              <div className="rn-theme-card p-3.5 rounded-3 shadow-sm border">
                <div className="small text-muted mb-1">Tổng sản phẩm đã đăng</div>
                <h3 className="fw-bolder mb-0 text-primary">{myAssets.length} Assets</h3>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="rn-theme-card p-3.5 rounded-3 shadow-sm border">
                <div className="small text-muted mb-1">Tổng lượt tải về</div>
                <h3 className="fw-bolder mb-0 text-success">{totalDownloads} Lượt</h3>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="rn-theme-card p-3.5 rounded-3 shadow-sm border">
                <div className="small text-muted mb-1">Doanh thu tích lũy ước tính</div>
                <h3 className="fw-bolder mb-0 text-info">{totalEstimatedEarnings.toLocaleString('vi-VN')} đ</h3>
              </div>
            </div>
          </div>

          {/* Bảng danh sách asset */}
          <div className="rn-theme-card p-4 rounded-4 shadow-sm">
            <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
              Danh sách sản phẩm của bạn
            </h6>

            {isLoading ? (
              <div className="py-4 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="small text-muted mt-2">Đang nạp dữ liệu tài nguyên...</div>
              </div>
            ) : myAssets.length === 0 ? (
              <div className="text-center py-5">
                <div className="display-4 text-muted mb-3"><i className="bi bi-cloud-upload"></i></div>
                <h5 className="fw-bold text-main mb-2">Bạn chưa đăng tải sản phẩm nào</h5>
                <p className="text-muted small mb-4">Bắt đầu chia sẻ mô hình 3D, Sprite 2D hoặc Audio packs đến cộng đồng game dev.</p>
                <Link to="/upload" className="rn-btn-pill rn-btn-primary px-4 text-decoration-none">
                  Đăng Tải Sản Phẩm Đầu Tiên
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle" style={{ color: 'var(--text-main)' }}>
                  <thead>
                    <tr className="small text-muted" style={{ borderBottomColor: 'var(--border-color)' }}>
                      <th>Tên tài nguyên</th>
                      <th>Mã Asset</th>
                      <th>Giá tối thiểu</th>
                      <th>Lượt tải</th>
                      <th>Trạng thái</th>
                      <th className="text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAssets.map((asset) => (
                      <tr key={asset.asset_id} style={{ borderBottomColor: 'var(--border-color)' }}>
                        <td>
                          <div className="fw-bold text-truncate" style={{ maxWidth: '280px' }}>
                            <Link to={`/assets/${asset.asset_id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                              {asset.title}
                            </Link>
                          </div>
                          <span className="small text-muted" style={{ fontSize: '11px' }}>
                            {asset.license || 'Indie Commercial'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary">#{asset.asset_id}</span>
                        </td>
                        <td className="fw-semibold">
                          {Number(asset.price) === 0 ? <span className="text-success">FREE</span> : `${Number(asset.price).toLocaleString('vi-VN')} đ`}
                        </td>
                        <td>{asset.downloads_count || 0}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            Đang mở bán
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Link to={`/assets/${asset.asset_id}`} className="btn btn-outline-info btn-sm rounded-circle p-1" title="Xem trang">
                              <i className="bi bi-eye"></i>
                            </Link>
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm rounded-circle p-1"
                              title="Chỉnh sửa"
                              onClick={() => {
                                setActionMessage({ type: '', text: '' });
                                setEditingAsset({ ...asset });
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-circle p-1"
                              title="Xóa"
                              onClick={() => handleDeleteAsset(asset)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          {editingAsset && (
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}>
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <form className="modal-content border-0 rounded-4 shadow" style={{ backgroundColor: 'var(--card-bg)' }} onSubmit={handleSaveEdit}>
                  <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                    <h5 className="modal-title fw-bold" style={{ color: 'var(--text-main)' }}>Chỉnh sửa tài nguyên</h5>
                    <button type="button" className="btn-close" aria-label="Đóng" disabled={isSaving} onClick={() => setEditingAsset(null)}></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Tên tài nguyên</label>
                      <input className="form-control" name="title" value={editingAsset.title || ''} onChange={handleEditChange} required />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">Giá</label>
                        <input className="form-control" type="number" min="0" step="0.01" name="price" value={editingAsset.price ?? 0} onChange={handleEditChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">Giấy phép</label>
                        <select className="form-select" name="license" value={editingAsset.license || ''} onChange={handleEditChange}>
                          <option value="">Không chọn</option>
                          <option value="CC0 (Public Domain)">CC0 (Public Domain)</option>
                          <option value="CC-BY 4.0 (Commercial)">CC-BY 4.0 (Commercial)</option>
                          <option value="Standard Commercial License">Standard Commercial</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Link ảnh bìa</label>
                      <input className="form-control" type="url" name="thumbnail_url" value={editingAsset.thumbnail_url || ''} onChange={handleEditChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Mô tả ngắn</label>
                      <input className="form-control" name="short_description" value={editingAsset.short_description || ''} onChange={handleEditChange} />
                    </div>
                    <div>
                      <label className="form-label fw-bold small">Mô tả chi tiết</label>
                      <textarea className="form-control" rows="5" name="description" value={editingAsset.description || ''} onChange={handleEditChange}></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" disabled={isSaving} onClick={() => setEditingAsset(null)}>Hủy</button>
                    <button type="submit" className="rn-btn-pill rn-btn-primary px-4" disabled={isSaving || !editingAsset.title?.trim()}>
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
