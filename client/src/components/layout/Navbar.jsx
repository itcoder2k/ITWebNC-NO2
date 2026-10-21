import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenuDropdown from './UserMenuDropdown';
import CartBadge from './CartBadge';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleOpenAuth = (tabName) => {
    setAuthTab(tabName);
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-light-subtle sticky-top py-2 shadow-sm">
        <div className="container">
          
          {/* Brand Logo */}
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
            <div 
              className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: '38px', height: '38px' }}
            >
              <i className="bi bi-controller fs-4"></i>
            </div>
            <span className="fs-5 fw-bolder text-dark tracking-tight">
              GAME<span className="text-primary">MARKET</span>
            </span>
          </Link>

          {/* Toggle button for mobile */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Navigation links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-1">
              <li className="nav-item">
                <Link className="nav-link text-dark fw-medium px-2" to="/catalog">
                  <i className="bi bi-grid me-1 text-primary"></i> Khám phá
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-medium px-2" to="/catalog?cat=2d-game-assets">
                  2D Sprites
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-medium px-2" to="/catalog?cat=3d-models">
                  3D Models
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-medium px-2" to="/catalog?cat=audio-sfx">
                  Âm thanh
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-medium px-2" to="/catalog?cat=gui-fonts">
                  UI Kits
                </Link>
              </li>
            </ul>

            {/* Central Search Bar */}
            <form onSubmit={handleSearch} className="d-flex mx-lg-3 my-2 my-lg-0" style={{ minWidth: '280px', maxWidth: '420px', flex: '1' }}>
              <div className="search-input-group-light w-100">
                <i className="bi bi-search text-muted me-2"></i>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tài nguyên, shader, âm thanh... (Ctrl + K)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>

            {/* Right User actions: Upload + Cart + User/Auth */}
            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
              <Link to="/blank?action=upload" className="btn btn-outline-primary rounded-pill px-3 py-1 btn-sm fw-medium">
                <i className="bi bi-cloud-arrow-up me-1"></i> Đăng bán Asset
              </Link>
              
              <CartBadge count={3} />

              <UserMenuDropdown onOpenAuth={handleOpenAuth} />
            </div>
          </div>

        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialTab={authTab}
      />
    </>
  );
}
