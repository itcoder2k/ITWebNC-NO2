import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchAssets, fetchCategories, fetchTags } from '../services/assetApi';
import './CatalogPage.css';

const PAGE_SIZE = 12;

const categoryAliases = {
  all: null,
  '2d-game-assets': '2d-game-assets',
  '3d-models': '3d-models',
  'audio-sfx': 'audio-sfx',
  'gui-fonts': 'gui-fonts',
  'visual-effects': 'visual-effects',
  'game-templates': 'game-templates',
  freebies: 'free',
  free: 'free',
};

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('cat') || 'all';
  const tagSlug = searchParams.get('tag') || '';
  const searchTerm = searchParams.get('search') || '';
  const priceFilter = searchParams.get('price') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setIsLoading(true);
      setError('');
      try {
        const [assetData, categoryData, tagData] = await Promise.all([
          fetchAssets(),
          fetchCategories(),
          fetchTags().catch(() => []),
        ]);
        if (isMounted) {
          setAssets(assetData || []);
          setCategories(categoryData || []);
          setTags(tagData || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              'Không tải được danh mục. Hãy kiểm tra backend, database và thử lại.',
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [categorySlug, tagSlug, searchTerm, priceFilter, sortBy]);

  const selectedCategory = categoryAliases[categorySlug] ?? categorySlug;
  const currentCategory = categories.find(
    (item) => item.slug === selectedCategory || String(item.category_id) === selectedCategory,
  );
  const currentTag = tags.find((t) => t.slug === tagSlug || String(t.tag_id) === tagSlug);

  const title = useMemo(() => {
    if (tagSlug && currentTag) {
      return `Thẻ: #${currentTag.name}`;
    }
    if (categorySlug === 'all') return 'Khám phá tài nguyên game';
    if (categorySlug === 'free' || categorySlug === 'freebies') return 'Tài nguyên miễn phí';
    return currentCategory?.name || 'Danh mục tài nguyên';
  }, [categorySlug, currentCategory, currentTag, tagSlug]);

  const filteredAssets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = assets.filter((asset) => {
      // 1. Lọc theo Danh mục
      if (selectedCategory === 'free' && Number(asset.price) !== 0) return false;
      if (
        selectedCategory &&
        selectedCategory !== 'free' &&
        currentCategory &&
        Number(asset.category_id) !== Number(currentCategory.category_id)
      ) {
        return false;
      }
      if (
        selectedCategory &&
        selectedCategory !== 'free' &&
        !currentCategory &&
        categorySlug !== 'all'
      ) {
        return false;
      }

      // 2. Lọc theo Mức giá
      const price = Number(asset.price);
      if (priceFilter === 'free' && price !== 0) return false;
      if (priceFilter === 'paid' && price === 0) return false;
      if (priceFilter === 'under-5' && (price === 0 || price > 5)) return false;
      if (priceFilter === '5-15' && (price < 5 || price > 15)) return false;
      if (priceFilter === 'above-15' && price < 15) return false;

      // 3. Lọc theo Từ khóa tìm kiếm
      if (normalizedSearch) {
        const text = `${asset.title} ${asset.short_description || ''} ${asset.description || ''} ${asset.license || ''}`.toLowerCase();
        if (!text.includes(normalizedSearch)) return false;
      }

      return true;
    });

    return filtered.sort((left, right) => {
      if (sortBy === 'price-asc') return Number(left.price) - Number(right.price);
      if (sortBy === 'price-desc') return Number(right.price) - Number(left.price);
      if (sortBy === 'popular') return Number(right.downloads_count || 0) - Number(left.downloads_count || 0);
      if (sortBy === 'views') return Number(right.views_count || 0) - Number(left.views_count || 0);
      return new Date(right.created_at || 0) - new Date(left.created_at || 0);
    });
  }, [assets, categorySlug, currentCategory, priceFilter, searchTerm, selectedCategory, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const visibleAssets = filteredAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    (categorySlug && categorySlug !== 'all') ||
      tagSlug ||
      (priceFilter && priceFilter !== 'all') ||
      searchTerm ||
      (sortBy && sortBy !== 'newest')
  );

  return (
    <div className="catalog-page">
      <Navbar />
      <main className="catalog-main">
        <div className="catalog-container">
          {/* Header & Tiêu đề đa chiều */}
          <div className="catalog-heading">
            <div>
              <span className="catalog-kicker">GAME ASSET MARKETPLACE • KHÁM PHÁ</span>
              <h1>{title}</h1>
              <p>Duyệt, phân loại và tìm kiếm tài nguyên chuẩn 2D, 3D, SFX từ cộng đồng sáng tạo game.</p>
            </div>
            <label className="catalog-search">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                placeholder="Tìm tên, mô tả asset..."
                onChange={(event) => updateParam('search', event.target.value)}
                aria-label="Tìm kiếm asset"
              />
            </label>
          </div>

          {/* Thanh Filter Pills khi đang áp dụng bộ lọc */}
          {hasActiveFilters && (
            <div className="catalog-active-filters mb-3 d-flex flex-wrap align-items-center gap-2">
              <span className="small text-muted fw-semibold">Đang lọc:</span>
              {categorySlug && categorySlug !== 'all' && (
                <span className="badge bg-secondary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1.5 py-1.5 px-2.5">
                  <i className="bi bi-folder2"></i> {currentCategory?.name || categorySlug}
                  <button type="button" className="btn-close btn-close-white ms-1" style={{ fontSize: '0.65rem' }} onClick={() => updateParam('cat', null)} aria-label="Bỏ lọc danh mục" />
                </span>
              )}
              {tagSlug && (
                <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle d-inline-flex align-items-center gap-1.5 py-1.5 px-2.5">
                  <i className="bi bi-tag-fill"></i> #{currentTag?.name || tagSlug}
                  <button type="button" className="btn-close ms-1" style={{ fontSize: '0.65rem' }} onClick={() => updateParam('tag', null)} aria-label="Bỏ lọc thẻ" />
                </span>
              )}
              {priceFilter && priceFilter !== 'all' && (
                <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1.5 py-1.5 px-2.5">
                  <i className="bi bi-cash-stack"></i> Giá: {priceFilter === 'free' ? 'Miễn phí' : priceFilter}
                  <button type="button" className="btn-close ms-1" style={{ fontSize: '0.65rem' }} onClick={() => updateParam('price', null)} aria-label="Bỏ lọc giá" />
                </span>
              )}
              {searchTerm && (
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center gap-1.5 py-1.5 px-2.5">
                  <i className="bi bi-search"></i> &ldquo;{searchTerm}&rdquo;
                  <button type="button" className="btn-close ms-1" style={{ fontSize: '0.65rem' }} onClick={() => updateParam('search', null)} aria-label="Bỏ từ khóa" />
                </span>
              )}
              <button
                type="button"
                className="btn btn-sm btn-link text-danger text-decoration-none p-0 ms-2"
                onClick={clearAllFilters}
              >
                <i className="bi bi-x-circle"></i> Xóa tất cả
              </button>
            </div>
          )}

          <div className="catalog-layout">
            {/* SIDEBAR BỘ LỌC ĐA CHIỀU */}
            <aside className="catalog-sidebar">
              <h2>Danh mục</h2>
              <div className="catalog-category-list">
                <button
                  type="button"
                  className={categorySlug === 'all' ? 'is-active' : ''}
                  onClick={() => updateParam('cat', 'all')}
                >
                  <i className="bi bi-grid" aria-hidden="true" /> Tất cả tài nguyên
                </button>
                {categories.map((item) => (
                  <button
                  type="button"
                    className={categorySlug === item.slug ? 'is-active' : ''}
                    key={item.category_id}
                    onClick={() => updateParam('cat', item.slug)}
                  >
                    <i className="bi bi-folder2" aria-hidden="true" /> {item.name}
                  </button>
                ))}
                <button
                  type="button"
                  className={categorySlug === 'free' || categorySlug === 'freebies' ? 'is-active' : ''}
                  onClick={() => updateParam('cat', 'free')}
                >
                  <i className="bi bi-gift" aria-hidden="true" /> Tài nguyên miễn phí
                </button>
              </div>

              {/* Lọc theo mức giá */}
              <h2 className="catalog-filter-heading">Mức giá</h2>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === 'all'}
                  onChange={() => updateParam('price', 'all')}
                />
                Tất cả mức giá
              </label>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === 'free'}
                  onChange={() => updateParam('price', 'free')}
                />
                Miễn phí (FREE)
              </label>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === 'under-5'}
                  onChange={() => updateParam('price', 'under-5')}
                />
                Dưới $5
              </label>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === '5-15'}
                  onChange={() => updateParam('price', '5-15')}
                />
                $5.00 – $15.00
              </label>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === 'above-15'}
                  onChange={() => updateParam('price', 'above-15')}
                />
                Trên $15.00
              </label>

              {/* Lọc theo Thẻ gắn (Tags) */}
              {tags.length > 0 && (
                <>
                  <h2 className="catalog-filter-heading">Thẻ phân loại (Tags)</h2>
                  <div className="catalog-tags-cloud d-flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => (
                      <button
                        key={t.tag_id}
                        type="button"
                        className={`btn btn-sm catalog-tag-pill ${tagSlug === t.slug ? 'is-active' : ''}`}
                        onClick={() => updateParam('tag', tagSlug === t.slug ? null : t.slug)}
                      >
                        #{t.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </aside>

            {/* VÙNG HIỂN THỊ KẾT QUẢ */}
            <section className="catalog-results" aria-label="Danh sách tài nguyên">
              <div className="catalog-toolbar">
                <span>
                  {filteredAssets.length
                    ? `Hiển thị ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredAssets.length)} trên ${filteredAssets.length} tài nguyên`
                    : 'Không có tài nguyên phù hợp'}
                </span>
                <label>
                  Sắp xếp:
                  <select value={sortBy} onChange={(event) => updateParam('sort', event.target.value)}>
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Lượt tải nhiều nhất</option>
                    <option value="views">Lượt xem nhiều nhất</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                  </select>
                </label>
              </div>

              {isLoading ? (
                <div className="catalog-state" role="status">
                  <span className="spinner-border text-primary" aria-hidden="true" />
                  <p>Đang tải danh mục tài nguyên...</p>
                </div>
              ) : error ? (
                <div className="catalog-state catalog-state--error" role="alert">
                  <i className="bi bi-exclamation-triangle" aria-hidden="true" />
                  <p>{error}</p>
                  <button type="button" className="btn btn-app-primary" onClick={() => window.location.reload()}>
                    Tải lại
                  </button>
                </div>
              ) : visibleAssets.length ? (
                <>
                  <div className="catalog-grid">
                    {visibleAssets.map((asset) => {
                      const assetCat = categories.find((c) => c.category_id === asset.category_id);
                      return (
                        <Link className="catalog-asset-card" to={`/assets/${asset.asset_id}`} key={asset.asset_id}>
                          <div className="catalog-asset-card__image">
                            {asset.thumbnail_url ? (
                              <img src={asset.thumbnail_url} alt={asset.title} loading="lazy" />
                            ) : (
                              <i className="bi bi-image" aria-hidden="true" />
                            )}
                            <span className={Number(asset.price) === 0 ? 'is-free' : ''}>
                              {Number(asset.price) === 0 ? 'FREE' : formatPrice(asset.price)}
                            </span>
                            {assetCat && (
                              <span className="catalog-asset-card__category-badge">
                                {assetCat.name}
                              </span>
                            )}
                          </div>
                          <div className="catalog-asset-card__body">
                            <h3>{asset.title}</h3>
                            <p>{asset.short_description || 'Tài nguyên game chất lượng cao dành cho dự án của bạn.'}</p>
                            <div className="catalog-asset-card__footer">
                              <span title={`${asset.downloads_count || 0} lượt tải`}>
                                <i className="bi bi-download" aria-hidden="true" /> {asset.downloads_count || 0}
                              </span>
                              <span title={`${asset.views_count || 0} lượt xem`}>
                                <i className="bi bi-eye" aria-hidden="true" /> {asset.views_count || 0}
                              </span>
                              <strong>Xem chi tiết <i className="bi bi-arrow-right" aria-hidden="true" /></strong>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {pageCount > 1 && (
                    <nav className="catalog-pagination" aria-label="Phân trang">
                      <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        <i className="bi bi-chevron-left"></i> Trước
                      </button>
                      <span>Trang {page} / {pageCount}</span>
                      <button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>
                        Tiếp <i className="bi bi-chevron-right"></i>
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="catalog-state">
                  <i className="bi bi-inbox" aria-hidden="true" />
                  <h2>Không tìm thấy tài nguyên phù hợp</h2>
                  <p>Hãy thử thay đổi từ khóa, chọn danh mục khác hoặc xóa bộ lọc.</p>
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-2"
                    onClick={clearAllFilters}
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
}
