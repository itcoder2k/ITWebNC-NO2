import React, { useState } from 'react';

export const HomePage = () => {
  const [showHeroBanner, setShowHeroBanner] = useState(true);

  // Danh mục game & asset phong phú khớp giao diện mẫu itch.io
  const featuredGames = [
    {
      id: 1,
      title: 'Battle Healer Hildegard',
      badge: 'WEB',
      desc: 'The healer finally gets to be the hero: action rogue battle.',
      author: 'DelightfulWorks',
      tag: '#Action, #Pixel Art',
      type: 'free',
      bgColor: '#2c3e50',
      icon: '🧙‍♀️',
    },
    {
      id: 2,
      title: 'Bru & Boegie: Episode 2 - Get da SUGAR!',
      badge: 'WEB',
      desc: '2D point & click comedy adventure collection.',
      author: 'BoegieStudio',
      tag: '#Exploration, #Point & Click',
      type: 'free',
      bgColor: '#16a085',
      icon: '🍬',
    },
    {
      id: 3,
      title: 'Eternal Mist',
      badge: 'FREE',
      desc: 'Lead small squads. Make hard decisions. Survive the Mist.',
      author: 'MysticRune',
      tag: '#Strategy, #Singleplayer',
      type: 'free',
      bgColor: '#2980b9',
      icon: '🗡️',
    },
    {
      id: 4,
      title: 'Alpine Journey',
      badge: 'WEB',
      desc: 'Climb high peaks through freezing terrain and steep cliffs.',
      author: 'FrostPeak Games',
      tag: '#Ludum Dare 59, #Platformer',
      type: 'free',
      bgColor: '#34495e',
      icon: '🏔️',
    },
    {
      id: 5,
      title: 'Rulehouse Master',
      badge: 'WEB',
      desc: 'Think you know chess? Forget some of that. Puzzle battle.',
      author: 'MindLogic',
      tag: '#Comedy, #Puzzle',
      type: 'free',
      bgColor: '#8e44ad',
      icon: '♟️',
    },
    {
      id: 6,
      title: 'Uppercut Demo',
      badge: 'FREE',
      desc: 'Cyberpunk 3D action platformer with visceral combat moves.',
      author: 'NeonForge Studio',
      tag: '#Singleplayer, #Cyberpunk',
      type: 'free',
      bgColor: '#d35400',
      icon: '🥊',
    },
    {
      id: 7,
      title: 'Petal Crash 2 Deluxe',
      badge: '$16.99',
      desc: 'The freshest in arcade puzzle action blossoms again!',
      author: 'FriendshipAfternoon',
      tag: '#Score Attack, #Colorful',
      type: 'paid',
      bgColor: '#c0392b',
      icon: '🌸',
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* 1. TOP DOWNLOAD BAR (Xám nhạt) */}
      <div
        style={{
          backgroundColor: '#232329',
          color: '#ffffff',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          borderBottom: '1px solid #383842',
        }}
      >
        <button
          className="btn btn-outline"
          style={{
            borderColor: '#666675',
            color: '#ffffff',
            padding: '2px 8px',
            fontSize: '11px',
            height: '24px',
          }}
        >
          Tải ứng dụng
        </button>
        <span style={{ color: '#d1d1d6' }}>
          <strong>Trải nghiệm tốt nhất trên máy tính!</strong> Cài đặt và quản lý tài nguyên game thuận tiện hơn.
        </span>
      </div>

      {/* 2. HERO FEATURED SPOTLIGHT SHOWCASE (Khối tím/đen lớn như trong ảnh) */}
      {showHeroBanner && (
        <div className="hero-showcase">
          {/* Nút đóng banner góc trên phải */}
          <button
            onClick={() => setShowHeroBanner(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: '#000000',
              color: '#ffffff',
              border: '1px solid #444',
              borderRadius: '2px',
              padding: '1px 6px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
            title="Đóng banner"
          >
            ✕
          </button>

          {/* Video / Trailer Showcase mô phỏng */}
          <div
            style={{
              width: '420px',
              height: '210px',
              backgroundColor: '#38164a',
              borderRadius: '4px',
              border: '2px solid #5d257a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: '42px', cursor: 'pointer' }}>▶️</div>
            <div style={{ fontWeight: '800', fontSize: '15px', color: '#ffcc00', marginTop: '8px' }}>
              About Time! - Incremental Roguelike
            </div>
            <span style={{ fontSize: '11px', color: '#d5bbf0', marginTop: '4px' }}>
              Xem trên YouTube ↗
            </span>
          </div>

          {/* Thông tin Game Nổi Bật */}
          <div style={{ flex: 1, paddingRight: '30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>
              About Time!
            </h1>
            <p style={{ color: '#c7b8db', fontSize: '13px', marginBottom: '14px' }}>
              Tựa game Roguelike xây dựng nhịp thời gian cực kỳ độc đáo và gây nghiện.
            </p>

            {/* Screenshots nhỏ bên cạnh */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: '90px',
                    height: '56px',
                    backgroundColor: '#4a1e63',
                    border: '1px solid #702e96',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  ⏱️
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge badge-free" style={{ padding: '3px 8px', fontSize: '11px' }}>
                MIỄN PHÍ • 🪟
              </span>
              <button className="btn btn-itch" style={{ padding: '6px 16px', fontSize: '12px' }}>
                Tải game ngay →
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#9d8baa', marginTop: '10px' }}>
              #Incremental, #Pixel Art, #Roguelike
            </div>
          </div>
        </div>
      )}

      {/* 3. LATEST FEATURED GAMES (Thanh tiêu đề + Lưới game rộng kín màn hình) */}
      <div style={{ padding: '20px 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
              Game Nổi Bật Mới Nhất
            </h2>
            <button className="btn-outline-red">Xem tất cả →</button>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Cập nhật liên tục 24/7
          </span>
        </div>

        {/* Lưới sản phẩm trải đều toàn bộ bề ngang màn hình (Full-width grid) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px 14px',
          }}
        >
          {featuredGames.map((game) => (
            <div
              key={game.id}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Thumbnail Ảnh Game */}
              <div
                style={{
                  height: '115px',
                  backgroundColor: game.bgColor,
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '38px',
                  position: 'relative',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}
              >
                {game.icon}
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '1px 4px',
                    borderRadius: '2px',
                  }}
                >
                  GIF
                </span>
              </div>

              {/* Tên game & Huy hiệu giá tiền */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginTop: '6px',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    lineHeight: '1.25',
                    maxHeight: '32px',
                    overflow: 'hidden',
                  }}
                  title={game.title}
                >
                  {game.title}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '1px 5px',
                    borderRadius: '2px',
                    backgroundColor: game.type === 'paid' ? '#f0fdf4' : '#f0f0f4',
                    color: game.type === 'paid' ? '#0e9f6e' : '#44444d',
                    border: '1px solid var(--border-color)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {game.badge}
                </span>
              </div>

              {/* Mô tả ngắn */}
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-sub)',
                  marginTop: '3px',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {game.desc}
              </div>

              {/* Tags phụ */}
              <div style={{ fontSize: '10px', color: 'var(--itch-red)', marginTop: '4px', fontWeight: '600' }}>
                {game.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
