import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchAssets, fetchCategories } from '../services/assetApi';
import './CatalogPage.css';

const PAGE_SIZE = 12;

const categoryAliases = {
  all: null,
  '2d-game-assets': '2d-game-assets',
  '3d-models': '3d-models',
  'audio-sfx': 'audio-sfx',
  'gui-fonts': 'gui-fonts',
  'visual-effects': 'visual-effects',
  freebies: 'free',
  free: 'free',
};

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('cat') || 'all';
  const searchTerm = searchParams.get('search') || '';
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setIsLoading(true);
      setError('');
      try {
        const [assetData, categoryData] = await Promise.all([
          fetchAssets(),
          fetchCategories(),
        ]);
        if (isMounted) {
          setAssets(assetData);
          setCategories(categoryData);
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
  }, [categorySlug, searchTerm, priceFilter, sortBy]);

  const selectedCategory = categoryAliases[categorySlug] ?? categorySlug;
  const category = categories.find(
    (item) => item.slug === selectedCategory || String(item.category_id) === selectedCategory,
  );
  const title = categorySlug === 'all'
    ? 'Khám phá tài nguyên game'
    : categorySlug === 'free' || categorySlug === 'freebies'
      ? 'Tài nguyên miễn phí'
      : category?.name || 'Danh mục tài nguyên';

  const filteredAssets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
    const filtered = assets.filter((asset) => {
      if (selectedCategory === 'free' && Number(asset.price) !== 0) return false;
      if (
        selectedCategory &&
        selectedCategory !== 'free' &&
        category &&
        Number(asset.category_id) !== Number(category.category_id)
      ) {
        return false;
      }
      if (
        selectedCategory &&
        selectedCategory !== 'free' &&
        !category &&
        categorySlug !== 'all'
      ) {
        return false;
      }
      if (priceFilter === 'free' && Number(asset.price) !== 0) return false;
      if (priceFilter === 'paid' && Number(asset.price) === 0) return false;
      if (
        normalizedSearch &&
        !`${asset.title} ${asset.short_description || ''} ${asset.description || ''}`
          .toLocaleLowerCase()
          .includes(normalizedSearch)
      ) {
        return false;
      }
      return true;
    });

    return filtered.sort((left, right) => {
      if (sortBy === 'price-asc') return Number(left.price) - Number(right.price);
      if (sortBy === 'price-desc') return Number(right.price) - Number(left.price);
      if (sortBy === 'popular') return Number(right.downloads_count) - Number(left.downloads_count);
      return new Date(right.created_at) - new Date(left.created_at);
    });
  }, [assets, category, categorySlug, priceFilter, searchTerm, selectedCategory, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const visibleAssets = filteredAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateCategory = (slug) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'all') nextParams.delete('cat');
    else nextParams.set('cat', slug);
    setSearchParams(nextParams);
  };

  const updateSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set('search', value);
    else nextParams.delete('search');
    setSearchParams(nextParams);
  };

  return (
    <div className="catalog-page">
      <Navbar />
      <main className="catalog-main">
        <div className="catalog-container">
          <div className="catalog-heading">
            <div>
              <span className="catalog-kicker">GAME ASSET MARKETPLACE</span>
              <h1>{title}</h1>
              <p>Duyệt và khám phá tài nguyên từ cộng đồng sáng tạo game.</p>
            </div>
            <label className="catalog-search">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                placeholder="Tìm asset..."
                onChange={(event) => updateSearch(event.target.value)}
                aria-label="Tìm asset"
              />
            </label>
          </div>

          <div className="catalog-layout">
            <aside className="catalog-sidebar">
              <h2>Danh mục</h2>
              <div className="catalog-category-list">
                <button
                  type="button"
                  className={categorySlug === 'all' ? 'is-active' : ''}
                  onClick={() => updateCategory('all')}
                >
                  <i className="bi bi-grid" aria-hidden="true" /> Tất cả tài nguyên
                </button>
                {categories.map((item) => (
                  <button
                    type="button"
                    className={categorySlug === item.slug ? 'is-active' : ''}
                    key={item.category_id}
                    onClick={() => updateCategory(item.slug)}
                  >
                    <i className="bi bi-folder2" aria-hidden="true" /> {item.name}
                  </button>
                ))}
                <button
                  type="button"
                  className={categorySlug === 'free' || categorySlug === 'freebies' ? 'is-active' : ''}
                  onClick={() => updateCategory('free')}
                >
                  <i className="bi bi-gift" aria-hidden="true" /> Tài nguyên miễn phí
                </button>
              </div>

              <h2 className="catalog-filter-heading">Giá</h2>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === 'all'}
                  onChange={() => setPriceFilter('all')}
                />
                Tất cả
              </label>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === 'free'}
                  onChange={() => setPriceFilter('free')}
                />
                Miễn phí
              </label>
              <label className="catalog-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === 'paid'}
                  onChange={() => setPriceFilter('paid')}
                />
                Có phí
              </label>
            </aside>

            <section className="catalog-results" aria-label="Danh sách tài nguyên">
              <div className="catalog-toolbar">
                <span>
                  {filteredAssets.length
                    ? `Hiển thị ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredAssets.length)} trên ${filteredAssets.length} tài nguyên`
                    : 'Không có tài nguyên phù hợp'}
                </span>
                <label>
                  Sắp xếp
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Bán chạy</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                  </select>
                </label>
              </div>

              {isLoading ? (
                <div className="catalog-state" role="status">
                  <span className="spinner-border text-primary" aria-hidden="true" />
                  <p>Đang tải tài nguyên...</p>
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
                    {visibleAssets.map((asset) => (
                      <Link className="catalog-asset-card" to={`/assets/${asset.asset_id}`} key={asset.asset_id}>
                        <div className="catalog-asset-card__image">
                          {asset.thumbnail_url ? (
                            <img src={asset.thumbnail_url} alt="" loading="lazy" />
                          ) : (
                            <i className="bi bi-image" aria-hidden="true" />
                          )}
                          <span className={Number(asset.price) === 0 ? 'is-free' : ''}>
                            {Number(asset.price) === 0 ? 'FREE' : formatPrice(asset.price)}
                          </span>
                        </div>
                        <div className="catalog-asset-card__body">
                          <h3>{asset.title}</h3>
                          <p>{asset.short_description || 'Tài nguyên game dành cho dự án của bạn.'}</p>
                          <div>
                            <span><i className="bi bi-download" aria-hidden="true" /> {asset.downloads_count || 0}</span>
                            <strong>Xem chi tiết <i className="bi bi-arrow-right" aria-hidden="true" /></strong>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {pageCount > 1 && (
                    <nav className="catalog-pagination" aria-label="Phân trang">
                      <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Trước
                      </button>
                      <span>Trang {page} / {pageCount}</span>
                      <button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>
                        Tiếp
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="catalog-state">
                  <i className="bi bi-inbox" aria-hidden="true" />
                  <h2>Chưa có tài nguyên trong danh mục này</h2>
                  <p>Thử chọn danh mục khác hoặc xóa bộ lọc tìm kiếm.</p>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setPriceFilter('all');
                      updateCategory('all');
                      updateSearch('');
                    }}
                  >
                    Xóa bộ lọc
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
