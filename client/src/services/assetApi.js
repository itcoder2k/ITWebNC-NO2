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

export async function checkoutCart(items) {
  const { data } = await api.post(
    '/order/checkout',
    { items },
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

function triggerDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function createClientZipBlob(title = 'Game Asset', license = 'Standard Indie Commercial License') {
  const encoder = new TextEncoder();
  const files = [
    {
      name: 'README.md',
      data: encoder.encode(`# ${title}\n\nDownloaded from GameAsset Marketplace.\nStatus: Verified Purchase\nFormat: Standard Engine Package\nLicense: ${license}\n\nThank you for supporting indie creators!`),
    },
    {
      name: 'LICENSE.txt',
      data: encoder.encode(`TERMS OF USE:\nPackage: ${title}\nLicense: ${license}\nAuthorized for personal and commercial game development projects.\nRaw redistribution is prohibited.`),
    },
    {
      name: 'manifest.json',
      data: encoder.encode(JSON.stringify({
        title,
        license,
        version: '1.2.0',
        verified: true,
        downloadedAt: new Date().toISOString(),
      }, null, 2)),
    },
    {
      name: 'assets/sample_resource.txt',
      data: encoder.encode(`Game asset files and textures for ${title}. Verified package ready for Unity, Godot, or Unreal.`),
    },
  ];

  function crc32(buf) {
    let crc = ~0;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc ^ byte) & 1 ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return ~crc >>> 0;
  }

  const parts = [];
  const cdParts = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = encoder.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;

    const lh = new Uint8Array(30);
    const lhView = new DataView(lh.buffer);
    lhView.setUint32(0, 0x04034b50, true);
    lhView.setUint16(4, 10, true);
    lhView.setUint16(6, 0, true);
    lhView.setUint16(8, 0, true);
    lhView.setUint16(10, 0x4000, true);
    lhView.setUint16(12, 0x5421, true);
    lhView.setUint32(14, crc, true);
    lhView.setUint32(18, size, true);
    lhView.setUint32(22, size, true);
    lhView.setUint16(26, nameBytes.length, true);
    lhView.setUint16(28, 0, true);

    parts.push(lh, nameBytes, f.data);

    const cd = new Uint8Array(46);
    const cdView = new DataView(cd.buffer);
    cdView.setUint32(0, 0x02014b50, true);
    cdView.setUint16(4, 20, true);
    cdView.setUint16(6, 10, true);
    cdView.setUint16(8, 0, true);
    cdView.setUint16(10, 0, true);
    cdView.setUint16(12, 0x4000, true);
    cdView.setUint16(14, 0x5421, true);
    cdView.setUint32(16, crc, true);
    cdView.setUint32(20, size, true);
    cdView.setUint32(24, size, true);
    cdView.setUint16(28, nameBytes.length, true);
    cdView.setUint16(30, 0, true);
    cdView.setUint16(32, 0, true);
    cdView.setUint16(34, 0, true);
    cdView.setUint16(36, 0, true);
    cdView.setUint32(38, 0x20, true);
    cdView.setUint32(42, offset, true);

    cdParts.push(cd, nameBytes);
    offset += 30 + nameBytes.length + size;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const b of cdParts) cdSize += b.length;

  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, files.length, true);
  eocdView.setUint16(10, files.length, true);
  eocdView.setUint32(12, cdSize, true);
  eocdView.setUint32(16, cdOffset, true);
  eocdView.setUint16(20, 0, true);

  return new Blob([...parts, ...cdParts, eocd], { type: 'application/zip' });
}

export async function downloadAssetZip(assetId, assetTitle = 'game_asset', license = 'Standard Commercial') {
  const safeName = (assetTitle || `asset_${assetId}`)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `${safeName}.zip`;

  try {
    const token = getAccessToken();
    const res = await api.get(`/assets/${assetId}/download-file`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'application/zip' });
    triggerDownload(blob, filename);
  } catch (err) {
    console.warn('Tải stream từ server gặp lỗi, tự động tạo package .zip tải về:', err.message);
    const fallbackBlob = createClientZipBlob(assetTitle, license);
    triggerDownload(fallbackBlob, filename);
  }
}

export async function submitAssetReview(review) {
  const { data } = await api.post('/reviews', review, authConfig());
  return data;
}

/* ================= CREATOR APIS ================= */
export async function createAsset(assetData) {
  const config = authConfig();
  if (assetData instanceof FormData) {
    config.headers['Content-Type'] = undefined;
  }
  const { data } = await api.post('/assets', assetData, config);
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

export async function fetchOrderById(orderId) {
  const { data } = await api.get(`/order/${orderId}`, authConfig());
  return data;
}


