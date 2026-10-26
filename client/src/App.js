import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/theme.css';
import HomePage from './pages/HomePage';
import BlankPage from './pages/BlankPage';
import AssetDetailPage from './pages/AssetDetailPage';
import CatalogPage from './pages/CatalogPage';
import UploadAssetPage from './pages/UploadAssetPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyLibraryPage from './pages/MyLibraryPage';
import ProfilePage from './pages/ProfilePage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 1. Trang chủ & Khám phá */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/assets/:id" element={<AssetDetailPage />} />

        {/* 2. Luồng Creator / Tác giả đăng bán */}
        <Route path="/upload" element={<UploadAssetPage />} />
        <Route path="/creator/dashboard" element={<CreatorDashboardPage />} />

        {/* 3. Luồng Giỏ hàng & Thanh toán (Buyer) */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/library" element={<MyLibraryPage />} />

        {/* 4. Hồ sơ cá nhân & Ví điện tử */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<ProfilePage />} />

        {/* 5. Trang thông tin chính sách & 404 */}
        <Route path="/blank" element={<BlankPage />} />
        <Route path="*" element={<BlankPage title="404 - Trang chưa khả dụng" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
