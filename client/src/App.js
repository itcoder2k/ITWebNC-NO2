import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/theme.css';
import HomePage from './pages/HomePage';
import BlankPage from './pages/BlankPage';
import AssetDetailPage from './pages/AssetDetailPage';
import CatalogPage from './pages/CatalogPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/assets/:id" element={<AssetDetailPage />} />
        <Route path="/blank" element={<BlankPage />} />
        {/* Bất kỳ route nào chưa định nghĩa cũng tự động về BlankPage */}
        <Route path="*" element={<BlankPage title="404 - Trang chưa khả dụng" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
