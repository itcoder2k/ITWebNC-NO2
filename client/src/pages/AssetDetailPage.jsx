import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MediaGallery from '../components/asset-detail/MediaGallery';
import ProductBuyBox from '../components/asset-detail/ProductBuyBox';
import ProductSpecTabs from '../components/asset-detail/ProductSpecTabs';
import ReviewSection from '../components/asset-detail/ReviewSection';
import RelatedAssetsSlider from '../components/asset-detail/RelatedAssetsSlider';
import {
  fetchAsset,
  fetchAssetMedia,
  fetchAssetReviews,
  fetchCategory,
  fetchRelatedAssets,
} from '../services/assetApi';
import './AssetDetailPage.css';

export default function AssetDetailPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [media, setMedia] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedAssets, setRelatedAssets] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loadWarnings, setLoadWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAsset = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const assetData = await fetchAsset(id);
      setAsset(assetData);

      const [mediaResult, reviewResult, relatedResult, categoryResult] = await Promise.allSettled([
        fetchAssetMedia(id),
        fetchAssetReviews(id),
        fetchRelatedAssets(),
        assetData.category_id ? fetchCategory(assetData.category_id) : Promise.resolve(null),
      ]);
      const warnings = [];
      if (mediaResult.status === 'fulfilled') {
        setMedia(mediaResult.value);
      } else {
        setMedia([]);
        warnings.push('Không tải được thư viện ảnh xem trước.');
      }
      if (reviewResult.status === 'fulfilled') {
        setReviews(reviewResult.value);
      } else {
        setReviews([]);
        warnings.push('Không tải được danh sách đánh giá.');
      }
      if (relatedResult.status === 'fulfilled') {
        setRelatedAssets(relatedResult.value);
      } else {
        setRelatedAssets([]);
        warnings.push('Không tải được tài nguyên gợi ý.');
      }
      if (categoryResult.status === 'fulfilled') {
        setCategoryName(categoryResult.value?.name || '');
      } else {
        setCategoryName('');
        warnings.push('Không tải được tên danh mục.');
      }
      setLoadWarnings(warnings);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Không tải được thông tin tài nguyên. Hãy kiểm tra backend và thử lại.',
      );
      setAsset(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAsset();
  }, [loadAsset]);

  const handleReviewCreated = (review) => {
    setReviews((currentReviews) => [
      review,
      ...currentReviews.filter((item) => item.review_id !== review.review_id),
    ]);
  };

  return (
    <div className="asset-detail-page">
      <Navbar />
      <main className="asset-detail-main">
        <div className="asset-detail-container">
          <nav className="asset-detail-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link>
            <i className="bi bi-chevron-right" aria-hidden="true" />
            <span>Chi tiết tài nguyên</span>
          </nav>

          {isLoading ? (
            <div className="asset-detail-state" role="status">
              <span className="spinner-border text-primary" aria-hidden="true" />
              <p>Đang tải thông tin tài nguyên...</p>
            </div>
          ) : error ? (
            <div className="asset-detail-state asset-detail-state--error" role="alert">
              <i className="bi bi-exclamation-triangle" aria-hidden="true" />
              <h1>Không thể tải tài nguyên</h1>
              <p>{error}</p>
              <button className="btn btn-app-primary" type="button" onClick={loadAsset}>
                Thử lại
              </button>
            </div>
          ) : asset ? (
            <>
              {loadWarnings.length > 0 && (
                <div className="alert alert-warning" role="status">
                  {loadWarnings.map((warning) => <div key={warning}>{warning}</div>)}
                </div>
              )}
              <div className="asset-detail-top-grid">
                <MediaGallery asset={asset} media={media} />
                <ProductBuyBox asset={asset} categoryName={categoryName} />
              </div>
              <ProductSpecTabs asset={asset} />
              <ReviewSection
                assetId={asset.asset_id}
                reviews={reviews}
                onReviewCreated={handleReviewCreated}
              />
              <RelatedAssetsSlider
                assets={relatedAssets}
                currentAssetId={asset.asset_id}
              />
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
