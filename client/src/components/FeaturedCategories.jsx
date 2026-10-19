import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: '2d',
    title: '2D Sprites & Pixel Art',
    desc: 'Nhân vật, tileset bản đồ, hoạt ảnh chuyển động cắt nhỏ cho Unity, Godot & Unreal.',
    icon: '👾',
    count: '1,240+ assets',
    tag: 'Phổ biến'
  },
  {
    id: '3d',
    title: '3D Models & Low-Poly',
    desc: 'Mô hình vật thể 3D, xe cộ, vũ khí, texture PBR chuẩn định dạng .FBX, .OBJ, .GLTF.',
    icon: '🧊',
    count: '850+ models',
    tag: 'Trending'
  },
  {
    id: 'audio',
    title: 'Âm thanh & SFX Bản quyền',
    desc: 'Nhạc nền vòng lặp (BGM), hiệu ứng chém, bắn súng, âm thanh môi trường chuẩn wav/mp3.',
    icon: '🎵',
    count: '2,100+ tracks',
    tag: 'Royalty-Free'
  },
  {
    id: 'uikit',
    title: 'Game UI Kits & HUD',
    desc: 'Giao diện bảng máu, nút bấm, menu cài đặt, khung hội thoại và font chữ game retro.',
    icon: '🖼️',
    count: '620+ packs',
    tag: 'Vector & PSD'
  }
];

export default function FeaturedCategories() {
  return (
    <section id="categories" style={{ padding: '70px 0', borderBottom: '1px solid #2e3035' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '10px' }}>
            Danh Mục Tài Nguyên Trọng Tâm
          </h2>
          <p style={{ color: '#9aa0a6', fontSize: '15px' }}>
            Được phân loại khoa học giúp lập trình viên game tìm kiếm nhanh chóng
          </p>
        </div>

        {/* Grid 4 Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/blank?cat=${cat.id}`}
              style={{
                backgroundColor: '#24252a',
                border: '1px solid #363840',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00d2ff';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#363840';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ fontSize: '36px' }}>{cat.icon}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(0, 210, 255, 0.12)',
                    color: '#00d2ff',
                    border: '1px solid rgba(0, 210, 255, 0.3)'
                  }}>
                    {cat.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#9aa0a6', lineHeight: '1.5', marginBottom: '20px' }}>
                  {cat.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid #2e3035',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                <span>{cat.count}</span>
                <span style={{ color: '#00d2ff', fontWeight: '600' }}>Xem ngay →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
