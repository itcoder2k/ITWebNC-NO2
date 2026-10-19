import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="craftpix-footer pt-5 pb-4">
      <div className="container">
        
        {/* Banner Đăng ký nhận Asset Miễn phí hàng tuần (Phong cách CraftPix) */}
        <div className="footer-newsletter-banner">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-7">
              <div className="footer-newsletter-title">
                <i className="bi bi-gift-fill text-warning fs-4"></i>
                <span>Nhận Gói Game Asset Miễn Phí Mỗi Tuần!</span>
              </div>
              <p className="footer-newsletter-desc">
                Đăng ký bản tin để nhận ngay bộ sưu tập 2D Spritesheets, 3D Low-Poly và SFX bản quyền miễn phí cùng các ưu đãi độc quyền dành cho Game Dev.
              </p>
            </div>
            <div className="col-12 col-lg-5">
              {isSubscribed ? (
                <div className="d-flex align-items-center gap-2 p-2 px-3 rounded-pill bg-success bg-opacity-25 border border-success text-success small fw-semibold">
                  <i className="bi bi-check-circle-fill fs-5"></i>
                  <span>Tuyệt vời! Gói asset quà tặng đã được gửi đến email của bạn.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-newsletter-input-group">
                  <input
                    type="email"
                    className="footer-newsletter-input"
                    placeholder="Nhập địa chỉ email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="footer-newsletter-btn">
                    <i className="bi bi-send-fill me-1"></i> Nhận Quà
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Cột Chính */}
        <div className="footer-grid">
          
          {/* CỘT 1: Về Marketplace (Giới thiệu ngắn & Thương hiệu) */}
          <div className="footer-col">
            <Link to="/" className="footer-brand">
              <div className="footer-brand-icon">
                <i className="bi bi-controller"></i>
              </div>
              <div>
                <div className="footer-brand-name">
                  GAME<span className="footer-brand-highlight">MARKET</span>
                </div>
                <span className="footer-brand-tagline">Crafted for Indie Game Devs</span>
              </div>
            </Link>

            <p className="footer-about-text">
              Nền tảng thương mại điện tử và chia sẻ tài nguyên chuyên biệt dành riêng cho cộng đồng lập trình game độc lập. Cung cấp hàng ngàn asset đồ họa 2D, mô hình 3D, âm thanh SFX và mã nguồn chuẩn tối ưu cho Unity, Godot & Unreal Engine.
            </p>

            <div className="footer-trust-tags">
              <span className="footer-trust-tag">
                <i className="bi bi-patch-check-fill text-info"></i> 10,000+ Assets
              </span>
              <span className="footer-trust-tag">
                <i className="bi bi-shield-check text-success"></i> 100% Commercial
              </span>
              <span className="footer-trust-tag">
                <i className="bi bi-lightning-charge-fill text-warning"></i> Instant DL
              </span>
            </div>

            {/* Mạng xã hội */}
            <div className="footer-social-links">
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn discord" 
                title="Discord Community"
              >
                <i className="bi bi-discord"></i>
              </a>
              <a 
                href="https://github.com/itcoder2k/ITWebNC-NO2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn github" 
                title="GitHub Repository"
              >
                <i className="bi bi-github"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn twitter" 
                title="Twitter / X"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn youtube" 
                title="YouTube Channel"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn telegram" 
                title="Telegram Channel"
              >
                <i className="bi bi-telegram"></i>
              </a>
            </div>
          </div>

          {/* CỘT 2: Danh mục (2D, 3D, Audio, UI Kits, Free) */}
          <div className="footer-col">
            <h4 className="footer-heading">Danh Mục Assets</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <Link to="/blank?cat=2d" className="footer-nav-link">
                  <i className="bi bi-grid-fill"></i>
                  <span>2D Sprites & Tilesets</span>
                  <span className="footer-badge badge-hot">HOT</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?cat=3d" className="footer-nav-link">
                  <i className="bi bi-box-fill"></i>
                  <span>3D Models & Low-Poly</span>
                  <span className="footer-badge badge-pbr">PBR</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?cat=audio" className="footer-nav-link">
                  <i className="bi bi-music-note-beamed"></i>
                  <span>Âm thanh & SFX Nhạc nền</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?cat=uikit" className="footer-nav-link">
                  <i className="bi bi-window-stack"></i>
                  <span>Game UI Kits & HUD</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?cat=vfx" className="footer-nav-link">
                  <i className="bi bi-stars"></i>
                  <span>VFX & Spine Animations</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?cat=free" className="footer-nav-link">
                  <i className="bi bi-gift-fill text-success"></i>
                  <span className="fw-semibold text-white">Tài nguyên Miễn phí</span>
                  <span className="footer-badge badge-free">FREE</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: Cộng đồng Dev (Discord, GitHub, Forum, Bán tài nguyên) */}
          <div className="footer-col">
            <h4 className="footer-heading">Cộng Đồng Dev</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer-nav-link"
                >
                  <i className="bi bi-discord text-primary"></i>
                  <span>Máy chủ Discord Devs</span>
                  <span className="footer-badge badge-dev">15K+</span>
                </a>
              </li>
              <li className="footer-nav-item">
                <a 
                  href="https://github.com/itcoder2k/ITWebNC-NO2" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer-nav-link"
                >
                  <i className="bi bi-github"></i>
                  <span>Kho mã nguồn GitHub</span>
                </a>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=forum" className="footer-nav-link">
                  <i className="bi bi-chat-square-quote-fill"></i>
                  <span>Diễn đàn Dev & Q&A</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=creator-guide" className="footer-nav-link">
                  <i className="bi bi-shop"></i>
                  <span>Đăng ký Bán Asset (0% Phí)</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=pwyw" className="footer-nav-link">
                  <i className="bi bi-heart-fill text-danger"></i>
                  <span>Cơ chế Trả-Tùy-Tâm (PWYW)</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=showcase" className="footer-nav-link">
                  <i className="bi bi-display"></i>
                  <span>Showcase Game Indie</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 4: Bản quyền & Pháp lý (Quy định bản quyền, liên hệ) */}
          <div className="footer-col">
            <h4 className="footer-heading">Bản Quyền & Pháp Lý</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <Link to="/blank?p=license" className="footer-nav-link">
                  <i className="bi bi-file-earmark-check-fill"></i>
                  <span>Quy định Giấy phép Bản quyền</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=commercial" className="footer-nav-link">
                  <i className="bi bi-briefcase-fill"></i>
                  <span>Quyền sử dụng Thương mại</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=dmca" className="footer-nav-link">
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>Báo cáo Vi phạm DMCA</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=terms" className="footer-nav-link">
                  <i className="bi bi-journal-text"></i>
                  <span>Điều khoản dịch vụ & Hoàn tiền</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?p=privacy" className="footer-nav-link">
                  <i className="bi bi-incognito"></i>
                  <span>Chính sách bảo mật GDPR</span>
                </Link>
              </li>
            </ul>

            {/* Hộp liên hệ hỗ trợ trực tiếp */}
            <div className="footer-contact-box">
              <div className="footer-contact-item">
                <i className="bi bi-envelope-at-fill"></i>
                <div>
                  <span className="d-block text-muted small">Hỗ trợ kỹ thuật & Bản quyền:</span>
                  <a href="mailto:support@gameasset.vn">support@gameasset.vn</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <i className="bi bi-clock-history"></i>
                <div>
                  <span className="d-block text-muted small">Phản hồi 24/7 cho Creators</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Chân trang đáy: Bản quyền, Đồ án, Phương thức thanh toán & Nút cuộn lên */}
        <div className="footer-bottom">
          <div className="footer-bottom-info">
            <div className="footer-bottom-copy">
              © {new Date().getFullYear()} <strong>GAMEASSET MARKETPLACE</strong>. Tất cả quyền được bảo lưu.
            </div>
            <div className="footer-bottom-project">
              Đồ án môn: <strong>Thiết Kế Web Nâng Cao</strong> — Nhóm <strong>ITWebNC-NO2</strong> (Đại học Phenikaa).
            </div>
          </div>

          <div className="footer-bottom-actions">
            {/* Phương thức thanh toán & bảo mật */}
            <div className="footer-payment-badges">
              <span className="footer-payment-badge" title="Visa / Mastercard">
                <i className="bi bi-credit-card-2-front-fill text-light"></i> VISA
              </span>
              <span className="footer-payment-badge" title="PayPal Global">
                <i className="bi bi-paypal text-primary"></i> PayPal
              </span>
              <span className="footer-payment-badge" title="Ví nội bộ hệ thống">
                <i className="bi bi-wallet2 text-success"></i> GameWallet
              </span>
              <span className="footer-payment-badge" title="Mã hóa SSL 256-bit an toàn tuyệt đối">
                <i className="bi bi-lock-fill text-warning"></i> SSL 256-Bit
              </span>
            </div>

            {/* Nút Cuộn lên đầu trang */}
            <button 
              type="button" 
              onClick={scrollToTop} 
              className="footer-scroll-top"
              title="Cuộn lên đầu trang"
            >
              <i className="bi bi-arrow-up-short fs-5"></i>
              <span>Lên đầu trang</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
