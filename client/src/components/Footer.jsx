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
      behavior: 'smooth',
    });
  };

  return (
    <footer className="craftpix-footer pt-5 pb-4">
      <div className="container">
        {/* Banner Bản tin Game Dev */}
        <div className="footer-newsletter-banner mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <div className="footer-newsletter-title">
                <i className="bi bi-envelope-paper-heart-fill me-2 text-danger"></i>
                <span>Nhận Tài Nguyên Game Miễn Phí Mỗi Tuần</span>
              </div>
              <p className="footer-newsletter-desc mb-0">
                Đăng ký nhận email thông báo các gói 2D Spritesheets, 3D Low-Poly và SFX âm thanh game miễn phí độc quyền!
              </p>
            </div>
            <div className="col-lg-6">
              {isSubscribed ? (
                <div className="footer-subscribed-alert">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Tuyệt vời! Chúng tôi đã gửi email xác nhận và link tải kho tài nguyên miễn phí tới hòm thư của bạn.
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
                    <i className="bi bi-send-fill me-1"></i> Đăng Ký
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Cột Liên kết chính */}
        <div className="footer-grid mb-5">
          {/* Cột 1: Về Sàn GameAsset */}
          <div className="footer-col">
            <Link to="/" className="footer-brand mb-3 d-inline-flex align-items-center gap-2">
              <div className="footer-brand-icon">
                <i className="bi bi-controller"></i>
              </div>
              <div className="footer-brand-text">
                <div className="footer-brand-name">
                  GAME<span className="footer-brand-highlight">MARKET</span>
                </div>
                <span className="footer-brand-tagline">Crafted for Indie Game Devs</span>
              </div>
            </Link>
            <p className="footer-about-text">
              Sàn giao dịch và phân phối tài nguyên game bản quyền hàng đầu cho lập trình viên Unity, Godot và Unreal Engine.
            </p>
            <div className="footer-trust-tags">
              <span className="footer-trust-tag">
                <i className="bi bi-shield-check text-success"></i> 100% Virus Free
              </span>
              <span className="footer-trust-tag">
                <i className="bi bi-patch-check text-info"></i> Commercial Safe
              </span>
              <span className="footer-trust-tag">
                <i className="bi bi-lightning-charge text-warning"></i> Instant Delivery
              </span>
            </div>
            <div className="footer-social-links mt-3">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn discord"
                title="Discord Game Dev Community"
              >
                <i className="bi bi-discord"></i>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn github"
                title="GitHub Repositories"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn twitter"
                title="X / Twitter Feed"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn youtube"
                title="Tutorials & Speed Arts"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn telegram"
                title="Telegram Channel"
              >
                <i className="bi bi-telegram"></i>
              </a>
            </div>
          </div>

          {/* Cột 2: Danh Mục Assets */}
          <div className="footer-col">
            <h4 className="footer-heading">Danh Mục Assets</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <Link to="/catalog?cat=2d-game-assets" className="footer-nav-link">
                  <span>2D Sprites & Tilesets</span>
                  <span className="footer-badge badge-hot">HOT</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/catalog?cat=3d-models" className="footer-nav-link">
                  <span>3D Models & Low Poly</span>
                  <span className="footer-badge badge-pbr">PBR</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/catalog?cat=audio-sfx" className="footer-nav-link">
                  <span>Âm Thanh & Nhạc BGM</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/catalog?cat=gui-fonts" className="footer-nav-link">
                  <span>Game GUI & HUD Fonts</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/catalog?cat=visual-effects" className="footer-nav-link">
                  <span>Visual Effects (VFX 2D/3D)</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/catalog?cat=free" className="footer-nav-link">
                  <span>Kho Tài Nguyên Miễn Phí</span>
                  <span className="footer-badge badge-free">FREE</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cộng Đồng Dev */}
          <div className="footer-col">
            <h4 className="footer-heading">Cộng Đồng Dev</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-nav-link"
                >
                  <span>Cộng đồng Discord</span>
                  <span className="footer-badge badge-dev">15K+</span>
                </a>
              </li>
              <li className="footer-nav-item">
                <a
                  href="https://github.com/itcoder2k/ITWebNC-NO2"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-nav-link"
                >
                  <span>Mã nguồn GitHub</span>
                </a>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?topic=forum" className="footer-nav-link">
                  <span>Diễn đàn Indie Game Dev</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?topic=showcase" className="footer-nav-link">
                  <span>Showcase Game nổi bật</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?topic=contribute" className="footer-nav-link">
                  <span>Chính sách Pay-What-You-Want</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Bản Quyền & Pháp Lý */}
          <div className="footer-col">
            <h4 className="footer-heading">Bản Quyền & Pháp Lý</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <Link to="/blank?topic=terms" className="footer-nav-link">
                  <span>Giấy phép Standard License</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?topic=terms" className="footer-nav-link">
                  <span>Sử dụng thương mại (Commercial)</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?topic=conduct" className="footer-nav-link">
                  <span>Chính sách bản quyền DMCA</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?topic=terms" className="footer-nav-link">
                  <span>Điều khoản dịch vụ sàn</span>
                </Link>
              </li>
              <li className="footer-nav-item">
                <Link to="/blank?topic=privacy" className="footer-nav-link">
                  <span>Chính sách quyền riêng tư</span>
                </Link>
              </li>
            </ul>

            <div className="footer-contact-box mt-3">
              <div className="footer-contact-item">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                <span>Trường Đại học Phenikaa, Yên Nghĩa, Hà Đông, Hà Nội</span>
              </div>
              <div className="footer-contact-item">
                <i className="bi bi-people-fill text-primary me-2"></i>
                <span>Đồ án nhóm: ITWebNC-NO2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chân trang đáy */}
        <div className="footer-bottom">
          <div className="footer-bottom-info">
            <div className="footer-bottom-copy">
              © {new Date().getFullYear()} GameAsset Marketplace. Nhóm 02 — Thiết Kế Web Nâng Cao.
            </div>
            <div className="footer-bottom-project">
              Khoa Công nghệ Thông tin • Trường Đại học Phenikaa. Giảng viên hướng dẫn: ThS. Nguyễn Lệ Thu.
            </div>
          </div>
          <div className="footer-bottom-actions">
            <div className="footer-payment-badges">
              <span className="footer-payment-badge" title="Visa / Mastercard">
                <i className="bi bi-credit-card-2-front"></i> VISA / MASTER
              </span>
              <span className="footer-payment-badge" title="Ví nội bộ hệ thống">
                <i className="bi bi-wallet2"></i> VÍ NỘI BỘ
              </span>
              <span className="footer-payment-badge" title="Mã hóa SSL 256-bit an toàn tuyệt đối">
                <i className="bi bi-shield-lock-fill text-success"></i> SSL 256-BIT
              </span>
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className="footer-scroll-top"
              title="Cuộn lên đầu trang"
            >
              <i className="bi bi-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
