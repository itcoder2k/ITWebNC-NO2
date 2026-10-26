import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import CartBadge from './CartBadge';
import UserMenuDropdown from './UserMenuDropdown';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('app-theme') === 'dark';
  });
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Đồng bộ theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('app-theme', 'light');
    }
  }, [isDarkMode]);

  // Phím tắt Ctrl + K / Cmd + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <header className="rn-navbar sticky-top d-flex align-items-center">
        <div className="container-fluid px-3 px-xl-4 d-flex align-items-center justify-content-between">
          
          {/* 1. Left: Logo GameAsset */}
          <Link className="d-flex align-items-center gap-2.5 text-decoration-none me-2 me-xl-4 flex-shrink-0" to="/">
            <div 
              className="d-flex align-items-center justify-content-center lh-1"
              style={{ fontSize: '26px', color: 'var(--primary-color)' }}
            >
              <i className="bi bi-controller"></i>
            </div>
            <span className="fs-5 fw-bold tracking-tight lh-1" style={{ color: 'var(--text-main)' }}>
              Game<span style={{ color: 'var(--primary-color)' }}>Asset</span>
            </span>
          </Link>

          {/* 2. Middle: Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-1 gap-xl-2 mx-1">
            <Link className="rn-nav-link d-inline-flex align-items-center gap-1.5" to="/catalog">
              <i className="bi bi-grid lh-1" style={{ color: 'var(--primary-color)' }}></i>
              <span>Khám phá</span>
            </Link>
            <Link className="rn-nav-link" to="/catalog?cat=2d-game-assets">2D Sprites</Link>
            <Link className="rn-nav-link" to="/catalog?cat=3d-models">3D Models</Link>
            <Link className="rn-nav-link" to="/catalog?cat=audio-sfx">Âm thanh</Link>
            <Link className="rn-nav-link" to="/catalog?cat=gui-fonts">UI Kits</Link>
          </nav>

          {/* 3. Center Search Box */}
          <form onSubmit={handleSearch} className="d-none d-sm-block mx-2 mx-xl-3 flex-grow-1" style={{ maxWidth: '270px' }}>
            <div className="rn-search-box d-flex align-items-center gap-2">
              <i className="bi bi-search lh-1 text-muted"></i>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Tìm kiếm tài nguyên..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span 
                className="badge px-1.5 py-0.5 flex-shrink-0" 
                style={{ 
                  backgroundColor: 'var(--card-header-bg)', 
                  color: 'var(--text-muted)', 
                  border: '1px solid var(--border-color)', 
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
                onClick={() => searchInputRef.current?.focus()}
                title="Bấm phím tắt Ctrl + K"
              >
                ctrl K
              </span>
            </div>
          </form>

          {/* 4. Right: Cụm chức năng (Giãn cách rõ ràng với khoảng đệm an toàn 12px) */}
          <div className="d-flex align-items-center ms-auto flex-nowrap" style={{ gap: '12px' }}>
            
            {/* Nút chuyển Sáng/Tối */}
            <button 
              className="btn-theme-toggle flex-shrink-0" 
              onClick={toggleTheme} 
              title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              type="button"
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'} lh-1`}></i>
            </button>

            {/* Nút Đăng bán Asset */}
            <Link 
              to="/upload" 
              className="btn btn-sm rounded-pill px-3.5 py-1 fw-semibold d-none d-md-inline-flex align-items-center gap-1.5 text-nowrap m-0 flex-shrink-0 shadow-sm"
              style={{ 
                height: '38px',
                fontSize: '13.5px', 
                border: '1.5px solid var(--primary-color)', 
                color: 'var(--primary-color)',
                backgroundColor: 'transparent'
              }}
            >
              <i className="bi bi-cloud-arrow-up fs-6 lh-1"></i>
              <span>Đăng bán</span>
            </Link>

            {/* Giỏ hàng độc lập có margin an toàn */}
            <div className="d-flex align-items-center flex-shrink-0">
              <CartBadge count={1} />
            </div>

            {/* Cụm User Dropdown / Đăng nhập & Đăng ký */}
            <div className="d-flex align-items-center flex-shrink-0">
              <UserMenuDropdown onOpenAuth={(tab) => { setAuthTab(tab); setIsAuthOpen(true); }} />
            </div>

          </div>

        </div>
      </header>

      {/* Auth Modal kết nối Backend thật */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialTab={authTab}
        onAuthSuccess={() => {
          window.location.reload();
        }}
      />
    </>
  );
}
