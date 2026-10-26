/**
 * cartService.js - Quản lý giỏ hàng tài nguyên (Shopping Cart Service)
 * Lưu trữ giỏ hàng trong localStorage, phát sự kiện 'cart-updated' đồng bộ UI
 */

const CART_STORAGE_KEY = 'user_game_cart';

export function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error('Lỗi đọc giỏ hàng:', err);
    return [];
  }
}

export function saveCartItems(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: items.length } }));
  } catch (err) {
    console.error('Lỗi lưu giỏ hàng:', err);
  }
}

export function getCartCount() {
  return getCartItems().length;
}

export function addToCart(asset, tipAmount = 0) {
  if (!asset || !asset.asset_id) return false;
  const items = getCartItems();
  const existingIndex = items.findIndex((item) => Number(item.id) === Number(asset.asset_id));

  const priceNum = Number(asset.price) || 0;
  const suggestedNum = Number(asset.suggested_price) || priceNum;

  const cartItem = {
    id: asset.asset_id,
    title: asset.title || 'Tài nguyên Game',
    author: asset.uploader_name || (asset.uploader_id ? `Creator #${asset.uploader_id}` : 'Indie Studio'),
    price: priceNum,
    suggestedPrice: suggestedNum,
    tipAmount: Math.max(0, Number(tipAmount)),
    thumbnail: asset.thumbnail_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
    addedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    // Đã có trong giỏ, cập nhật
    items[existingIndex] = { ...items[existingIndex], ...cartItem };
  } else {
    items.push(cartItem);
  }

  saveCartItems(items);
  return true;
}

export function removeFromCart(assetId) {
  const items = getCartItems();
  const updated = items.filter((item) => Number(item.id) !== Number(assetId));
  saveCartItems(updated);
  return updated;
}

export function updateCartTip(assetId, tipAmount) {
  const items = getCartItems();
  const updated = items.map((item) =>
    Number(item.id) === Number(assetId)
      ? { ...item, tipAmount: Math.max(0, Number(tipAmount)) }
      : item
  );
  saveCartItems(updated);
  return updated;
}

export function clearCart() {
  saveCartItems([]);
}
