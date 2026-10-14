import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/theme.css';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { CookieConsent } from './components/common/CookieConsent';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <CookieConsent />
          {/* Thanh Header toàn màn hình chuẩn itch.io */}
          <Navbar />

          {/* Vùng thân trang 2 cột phủ kín màn hình */}
          <div className="layout-wrapper">
            {/* Sidebar bên trái 200px */}
            <Sidebar />

            {/* Nội dung chính bên phải */}
            <main className="itch-main-feed">
              <Routes>
                {/* Trang chủ với Banner Spotlight & Lưới Games */}
                <Route path="/" element={<HomePage />} />

                {/* Các trang đăng nhập / đăng ký / hồ sơ */}
                <Route
                  path="/login"
                  element={
                    <div style={{ padding: '24px 16px' }}>
                      <LoginPage />
                    </div>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <div style={{ padding: '24px 16px' }}>
                      <RegisterPage />
                    </div>
                  }
                />

                {/* Trang quản lý tài khoản & ví tiền (Được bảo vệ) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div style={{ padding: '24px 20px' }}>
                        <ProfilePage />
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback điều hướng về trang chủ */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Chân trang */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
