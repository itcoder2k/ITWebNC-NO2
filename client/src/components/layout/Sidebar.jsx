import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="itch-sidebar">
      {/* KHÁM PHÁ / THẺ PHỔ BIẾN */}
      <div className="sidebar-heading">Thẻ phổ biến</div>
      <div className="sidebar-grid">
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Game Web</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Kinh dị</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Nhiều người</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Tiểu thuyết ảo</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Mô phỏng</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">macOS</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Roguelike</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Linux</span>
      </div>
      <div style={{ marginTop: '4px' }}>
        <span className="sidebar-item disabled" style={{ color: 'var(--text-muted)' }}>
          Xem tất cả thẻ →
        </span>
      </div>

      {/* DUYỆT TÀI NGUYÊN */}
      <div className="sidebar-heading">Duyệt danh mục</div>
      <div className="sidebar-grid">
        <Link to="/" className="sidebar-item" style={{ fontWeight: '700', color: 'var(--itch-red)' }}>
          Tất cả Games
        </Link>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Asset Game</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Công cụ Dev</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Nhạc & FX</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Bản vật lý</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Truyện tranh</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Sách</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Ngẫu nhiên</span>
      </div>

      {/* DUYỆT THEO MỨC GIÁ */}
      <div className="sidebar-heading">Lọc theo mức giá</div>
      <div className="sidebar-grid">
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Đang giảm giá</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Miễn phí</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Có bản thử</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Bán chạy nhất</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Dưới $5</span>
        <span className="sidebar-item disabled" title="Chức năng đang phát triển">Dưới $15</span>
      </div>

      {/* MẠNG XÃ HỘI & TẢI ỨNG DỤNG */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '15px', cursor: 'pointer' }} title="Reddit">👾</span>
        <span style={{ fontSize: '15px', cursor: 'pointer' }} title="Twitter / X">🐦</span>
        <span style={{ fontSize: '15px', cursor: 'pointer' }} title="Facebook">📘</span>
        <span style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: '600', marginLeft: 'auto', cursor: 'pointer' }}>
          Tải ứng dụng
        </span>
      </div>

      {/* TIN TỨC / BLOG */}
      <div className="sidebar-heading">Tin tức hệ thống</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: 'var(--text-sub)' }}>
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Cập nhật kiến trúc 4 tầng NestJS</div>
          <div style={{ color: 'var(--text-dim)' }}>Hôm nay • Nguyễn Trọng Hùng</div>
        </div>
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Hệ thống ví điện tử MySQL ACID</div>
          <div style={{ color: 'var(--text-dim)' }}>Hôm qua • Đồ án Web Nâng Cao</div>
        </div>
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Xác thực bảo mật chuẩn JWT + RBAC</div>
          <div style={{ color: 'var(--text-dim)' }}>3 ngày trước</div>
        </div>
      </div>
    </aside>
  );
};
