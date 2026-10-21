import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function authConfig() {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Vui lòng đăng nhập để tiếp tục thao tác này.');
  }
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function fetchAsset(id) {
  const { data } = await api.get(`/assets/${id}`);
  return data;
}

export async function fetchAssets() {
  const { data } = await api.get('/assets');
  return data;
}

export async function fetchCategory(id) {
  const { data } = await api.get(`/categories/${id}`);
  return data;
}

export async function fetchAssetMedia(id) {
  const { data } = await api.get(`/asset-media/asset/${id}`);
  return data;
}

export async function fetchAssetReviews(id) {
  const { data } = await api.get(`/reviews/asset/${id}`);
  return data;
}

export async function fetchRelatedAssets() {
  const { data } = await api.get('/assets');
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data;
}

export async function checkoutAsset(assetId, payAmount) {
  const { data } = await api.post(
    '/order/checkout',
    { asset_id: assetId, pay_amount: Number(payAmount) },
    authConfig(),
  );
  return data;
}

export async function requestAssetDownload(assetId) {
  const { data } = await api.get(
    `/assets/${assetId}/download`,
    authConfig(),
  );
  return data;
}

export async function submitAssetReview(review) {
  const { data } = await api.post('/reviews', review, authConfig());
  return data;
}
