import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/blank?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header style={{
      backgroundColor: '#1b1d24',
      borderBottom: '1px solid #2e3035',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '64px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 2px 10px rgba(0, 210, 255, 0.35)'
            }}>
              🕹️
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff' }}>
              GAME<span style={{ color: '#00d2ff' }}>ASSET</span>
            </span>
          </Link>

          {/* Nav Categories */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', fontWeight: '500' }}>
            <Link to="/blank?cat=2d" style={{ color: '#d1d5db', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#00d2ff'} onMouseLeave={e => e.target.style.color = '#d1d5db'}>2D Sprites</Link>
            <Link to="/blank?cat=3d" style={{ color: '#d1d5db', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#00d2ff'} onMouseLeave={e => e.target.style.color = '#d1d5db'}>3D Models</Link>
            <Link to="/blank?cat=audio" style={{ color: '#d1d5db', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#00d2ff'} onMouseLeave={e => e.target.style.color = '#d1d5db'}>Âm thanh</Link>
            <Link to="/blank?cat=uikit" style={{ color: '#d1d5db', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#00d2ff'} onMouseLeave={e => e.target.style.color = '#d1d5db'}>UI Kits</Link>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: '1', maxWidth: '380px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ position: 'absolute', left: '14px', color: '#9aa0a6', fontSize: '14px' }}>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm tài nguyên, shader, âm thanh... (Ctrl + K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 16px 9px 38px',
                borderRadius: '9999px',
                backgroundColor: '#282a30',
                border: '1px solid #3e4046',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s, background-color 0.2s'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#00d2ff';
                e.target.style.backgroundColor = '#1e2025';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#3e4046';
                e.target.style.backgroundColor = '#282a30';
              }}
            />
          </div>
        </form>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/blank?action=upload" className="btn-pill btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            + Đăng bán Asset
          </Link>
          <Link to="/blank?action=login" className="btn-pill btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
