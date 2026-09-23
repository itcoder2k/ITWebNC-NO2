-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS GameAssetDB;
USE GameAssetDB;

-- 1. Bảng Người dùng (Users)
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    role ENUM('admin', 'creator', 'customer') DEFAULT 'customer',
    bio TEXT,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Danh mục (Categories)
CREATE TABLE IF NOT EXISTS Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 3. Bảng Thẻ gắn (Tags - đặc trưng phong cách itch.io)
CREATE TABLE IF NOT EXISTS Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Bảng Tài nguyên Game (Assets)
CREATE TABLE IF NOT EXISTS Assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    short_description VARCHAR(255), -- Tagline ngắn gọn hiển thị trên card
    description TEXT, -- Mô tả chi tiết (hỗ trợ Markdown/HTML)
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- 0.00 là tài nguyên miễn phí
    thumbnail_url VARCHAR(255), -- Ảnh bìa/cover
    file_url VARCHAR(255) NOT NULL, -- Đường dẫn tệp tải (.zip, .rar, .unitypackage)
    file_size BIGINT NOT NULL DEFAULT 0, -- Kích thước tệp (bytes)
    license VARCHAR(100) DEFAULT 'Standard Commercial', -- Giấy phép sử dụng
    views_count INT NOT NULL DEFAULT 0,
    downloads_count INT NOT NULL DEFAULT 0,
    status ENUM('active', 'archived', 'pending') DEFAULT 'active',
    uploader_id INT,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- 5. Bảng Thư viện ảnh/GIF xem trước (AssetMedia - Screenshot & Demo Gallery)
CREATE TABLE IF NOT EXISTS AssetMedia (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    media_type ENUM('image', 'gif', 'video') DEFAULT 'image',
    display_order INT DEFAULT 0,
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id) ON DELETE CASCADE
);

-- 6. Bảng liên kết nhiều-nhiều Tài nguyên và Thẻ (AssetTags)
CREATE TABLE IF NOT EXISTS AssetTags (
    asset_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (asset_id, tag_id),
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- 7. Bảng Đơn hàng (Orders)
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'wallet', -- wallet, vnpay, momo, paypal
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 8. Bảng Chi tiết Đơn hàng (OrderDetails)
CREATE TABLE IF NOT EXISTS OrderDetails (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    asset_id INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id) ON DELETE RESTRICT
);

-- 9. Bảng Đánh giá & Bình luận (Reviews)
CREATE TABLE IF NOT EXISTS Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_asset_review (user_id, asset_id)
);

-- =========================================================
-- DỮ LIỆU MẪU (SEED DATA THEO PHONG CÁCH ITCH.IO)
-- =========================================================

-- 1. Users
INSERT INTO Users (username, display_name, email, password_hash, avatar_url, role, bio, balance) VALUES 
('admin', 'System Administrator', 'admin@gameasset.vn', '$2b$10$xyzAdminHashPlaceholder', '/avatars/admin.png', 'admin', 'Quản trị viên nền tảng Game Asset Marketplace', 0.00),
('pixel_master', 'Pixel Master Studio', 'alex@pixelmaster.dev', '$2b$10$xyzCreatorHashPlaceholder', '/avatars/pixelmaster.png', 'creator', 'Chuyên tạo tài nguyên 2D Pixel Art và Animation cho game indie.', 250.00),
('poly_craft', 'PolyCraft 3D', 'poly@polycraft.com', '$2b$10$xyzCreator2HashPlaceholder', '/avatars/polycraft.png', 'creator', 'Tạo mô hình 3D Low-poly tối ưu hóa cao cho Unity & Unreal Engine.', 180.00),
('gamer_viet', 'Nguyen Van A', 'gamer@gmail.com', '$2b$10$xyzCustomerHashPlaceholder', '/avatars/gamer.png', 'customer', 'Indie game developer đam mê làm game RPG.', 100.00);

-- 2. Categories
INSERT INTO Categories (name, slug, description) VALUES 
('2D Assets', '2d-assets', 'Spritesheets, pixel art, characters, backgrounds, and Spine 2D animations'),
('3D Models', '3d-models', 'Characters, environments, props, FBX, OBJ, and rigged models'),
('Audio & Music', 'audio-music', 'Sound effects (SFX), ambient loops, and original soundtracks'),
('UI & Fonts', 'ui-fonts', 'HUD interfaces, inventory systems, icons, buttons, and gaming fonts');

-- 3. Tags (phong cách lọc của itch.io)
INSERT INTO Tags (name, slug) VALUES 
('Pixel Art', 'pixel-art'),
('Low Poly', 'low-poly'),
('Fantasy', 'fantasy'),
('Sci-Fi', 'sci-fi'),
('Animated', 'animated'),
('Spine 2D', 'spine-2d'),
('Unity Ready', 'unity-ready'),
('Unreal Engine', 'unreal-engine'),
('Free', 'free');

-- 4. Assets
INSERT INTO Assets (title, short_description, description, price, thumbnail_url, file_url, file_size, license, views_count, downloads_count, status, uploader_id, category_id) VALUES 
(
    'Sci-Fi Cyber Hero 2D Spine Animation',
    'Bộ nhân vật chiến binh cyberpunk với 8 hoạt ảnh chiến đấu mượt mà.',
    'Tài nguyên nhân vật 2D chất lượng cao định dạng Spine 2D (.skel, .atlas) và Spritesheet PNG xuất sẵn. Bao gồm các animation: Idle, Run, Jump, Attack 1, Attack 2, Hurt, Die. Tương thích với Godot, Unity, Defold.',
    15.00,
    '/thumbnails/cyber_hero_cover.png',
    '/uploads/assets/cyber_hero_spine.zip',
    24576000, -- ~24MB
    'Creative Commons Attribution (CC-BY 4.0)',
    342,
    28,
    'active',
    2,
    1
),
(
    'Low Poly Medieval Knight & Weapons',
    'Gói nhân vật hiệp sĩ trung cổ kèm 10 loại vũ khí, đã gắn sẵn xương rig.',
    'Mô hình 3D phong cách Low-poly tối ưu hóa tuyệt đối cho game di động và VR. Định dạng FBX, OBJ kèm file Blender gốc. Đã thiết lập Humanoid Rig tương thích hoàn toàn với Unity Mixamo.',
    25.00,
    '/thumbnails/knight_cover.png',
    '/uploads/assets/lowpoly_knight.zip',
    52428800, -- 50MB
    'Standard Commercial License',
    512,
    45,
    'active',
    3,
    2
),
(
    'Retro 8-bit Dungeon Sound FX Pack',
    'Hơn 120 âm thanh hiệu ứng pixel cổ điển cho game phiêu lưu nhập vai.',
    'Bộ sưu tập hiệu ứng âm thanh 8-bit: chém kiếm, bắn phép, nhặt vàng, mở rương, bước chân. Định dạng WAV chất lượng cao và OGG tối ưu hóa.',
    0.00, -- Free asset
    '/thumbnails/dungeon_sfx_cover.png',
    '/uploads/assets/retro_dungeon_sfx.zip',
    10485760, -- 10MB
    'CC0 Public Domain (Free for any use)',
    1200,
    230,
    'active',
    2,
    3
);

-- 5. AssetMedia (Gallery ảnh chụp & demo GIF cho từng tài nguyên)
INSERT INTO AssetMedia (asset_id, media_url, media_type, display_order) VALUES 
(1, '/previews/cyber_hero_idle.gif', 'gif', 1),
(1, '/previews/cyber_hero_attack.gif', 'gif', 2),
(1, '/previews/cyber_hero_spritesheet.png', 'image', 3),
(2, '/previews/knight_wireframe.png', 'image', 1),
(2, '/previews/knight_weapons_showcase.png', 'image', 2),
(2, '/previews/knight_walk_demo.gif', 'gif', 3);

-- 6. AssetTags (Gắn thẻ phong cách itch.io)
INSERT INTO AssetTags (asset_id, tag_id) VALUES 
(1, 1), -- Pixel Art
(1, 4), -- Sci-Fi
(1, 5), -- Animated
(1, 6), -- Spine 2D
(2, 2), -- Low Poly
(2, 3), -- Fantasy
(2, 7), -- Unity Ready
(2, 8), -- Unreal Engine
(3, 1), -- Pixel Art
(3, 3), -- Fantasy
(3, 9); -- Free

-- 7. Orders
INSERT INTO Orders (user_id, total_amount, payment_method, status) VALUES 
(4, 15.00, 'wallet', 'completed');

-- 8. OrderDetails
INSERT INTO OrderDetails (order_id, asset_id, price_at_purchase) VALUES 
(1, 1, 15.00);

-- 9. Reviews
INSERT INTO Reviews (user_id, asset_id, rating, comment) VALUES 
(4, 1, 5, 'File Spine rất chuẩn, chuyển động cực kỳ mượt mà. Đáng giá từng xu!');