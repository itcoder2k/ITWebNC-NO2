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

export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function saveAuthData(token, user) {
  if (token) localStorage.setItem('accessToken', token);
  if (user) localStorage.setItem('currentUser', JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('currentUser');
}

function authConfig() {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Vui lòng đăng nhập để tiếp tục thao tác này.');
  }
  return { headers: { Authorization: `Bearer ${token}` } };
}

/* ================= AUTH APIS ================= */
export async function loginUser(usernameOrEmail, password) {
  const { data } = await api.post('/auth/login', {
    username: usernameOrEmail,
    password: password,
  });
  if (data?.accessToken) {
    saveAuthData(data.accessToken, data.user);
  }
  return data;
}

export async function registerUser({ username, email, password, display_name }) {
  const { data } = await api.post('/auth/register', {
    username,
    email,
    password,
    display_name: display_name || username,
  });
  if (data?.accessToken) {
    saveAuthData(data.accessToken, data.user);
  }
  return data;
}

export async function fetchUserProfile() {
  const { data } = await api.get('/auth/profile', authConfig());
  if (data) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
  return data;
}

/* ================= ASSET & CATALOG APIS ================= */
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

/* ================= CREATOR APIS ================= */
export async function createAsset(assetData) {
  const { data } = await api.post('/assets', assetData, authConfig());
  return data;
}

export async function updateAsset(id, assetData) {
  const { data } = await api.patch(`/assets/${id}`, assetData, authConfig());
  return data;
}

export async function deleteAsset(id) {
  const { data } = await api.delete(`/assets/${id}`, authConfig());
  return data;
}

/* ================= USER & WALLET APIS ================= */
export async function updateUserProfile(profileData) {
  const { data } = await api.put('/users/profile', profileData, authConfig());
  if (data) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
  return data;
}

export async function depositWallet(amount) {
  const { data } = await api.post(
    '/users/wallet/deposit',
    { amount: Number(amount) },
    authConfig(),
  );
  if (data) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
  return data;
}

/* ================= LIBRARY & ORDER APIS ================= */
export async function fetchMyLibrary() {
  const { data } = await api.get('/order/my-library', authConfig());
  return data;
}

export async function fetchMyOrders() {
  const { data } = await api.get('/order/my-orders', authConfig());
  return data;
}

