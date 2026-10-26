-- ====================================================================
-- HỆ CƠ SỞ DỮ LIỆU ĐỒ ÁN SÀN GIAO DỊCH TÀI NGUYÊN GAME (GAME ASSET MARKETPLACE)
-- HỆ QUẢN TRỊ: MySQL 8.0 / MariaDB
-- NHÓM THỰC HIỆN: ITWebNC-NO2 (Phenikaa University)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `GameAssetDB` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `GameAssetDB`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. BẢNG USERS (Người dùng, Creator, Admin, Số dư ví)
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin', 'creator', 'customer') DEFAULT 'customer',
  `bio` TEXT DEFAULT NULL,
  `balance` DECIMAL(12, 2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG CATEGORIES (Danh mục phân loại)
DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG TAGS (Thẻ phong cách, thể loại)
DROP TABLE IF EXISTS `Tags`;
CREATE TABLE `Tags` (
  `tag_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG ASSETS (Tài nguyên game - Bảng trung tâm)
DROP TABLE IF EXISTS `Assets`;
CREATE TABLE `Assets` (
  `asset_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `short_description` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10, 2) DEFAULT 0.00,
  `thumbnail_url` VARCHAR(255) DEFAULT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `file_size` BIGINT DEFAULT 0,
  `license` VARCHAR(100) DEFAULT 'Standard Indie Commercial License',
  `views_count` INT DEFAULT 0,
  `downloads_count` INT DEFAULT 0,
  `status` ENUM('active', 'archived', 'pending') DEFAULT 'active',
  `uploader_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_assets_user` FOREIGN KEY (`uploader_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assets_category` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG ASSET_MEDIA (Ảnh demo, GIF hoạt họa, video showcase)
DROP TABLE IF EXISTS `AssetMedia`;
CREATE TABLE `AssetMedia` (
  `media_id` INT AUTO_INCREMENT PRIMARY KEY,
  `asset_id` INT NOT NULL,
  `media_url` VARCHAR(255) NOT NULL,
  `media_type` ENUM('image', 'video', 'gif') DEFAULT 'image',
  `display_order` INT DEFAULT 0,
  CONSTRAINT `fk_media_asset` FOREIGN KEY (`asset_id`) REFERENCES `Assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG ASSET_TAGS (Liên kết nhiều - nhiều giữa Asset và Tag)
DROP TABLE IF EXISTS `AssetTags`;
CREATE TABLE `AssetTags` (
  `asset_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`asset_id`, `tag_id`),
  CONSTRAINT `fk_assettags_asset` FOREIGN KEY (`asset_id`) REFERENCES `Assets` (`asset_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assettags_tag` FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BẢNG ORDERS (Đơn hàng mua asset & nạp tiền)
DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'wallet',
  `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BẢNG ORDER_DETAILS (Chi tiết sản phẩm đã mua)
DROP TABLE IF EXISTS `OrderDetails`;
CREATE TABLE `OrderDetails` (
  `order_detail_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `asset_id` INT NOT NULL,
  `price_at_purchase` DECIMAL(10, 2) NOT NULL,
  CONSTRAINT `fk_orderdetails_order` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderdetails_asset` FOREIGN KEY (`asset_id`) REFERENCES `Assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. BẢNG REVIEWS (Đánh giá sao và nhận xét)
DROP TABLE IF EXISTS `Reviews`;
CREATE TABLE `Reviews` (
  `review_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `asset_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_asset` FOREIGN KEY (`asset_id`) REFERENCES `Assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- DỮ LIỆU MẪU ĐẦY ĐỦ (SEED DATA DEMO CHUẨN ĐỒ ÁN)
-- Mật khẩu mặc định của tất cả tài khoản bên dưới là: 123456
-- Chuỗi băm Bcrypt: $2b$10$w8kF5n12N0gD9XpD8bN5Me1j2q9E4Fz7R9Y4X2C1B8V6A3Z0L8P2a
-- ====================================================================

-- 1. NẠP USERS MẪU
INSERT INTO `Users` (`user_id`, `username`, `display_name`, `email`, `password_hash`, `avatar_url`, `role`, `bio`, `balance`) VALUES
(1, 'admin', 'Quản Trị Viên Phenikaa', 'admin@phenikaa.edu.vn', '$2b$10$w8kF5n12N0gD9XpD8bN5Me1j2q9E4Fz7R9Y4X2C1B8V6A3Z0L8P2a', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'admin', 'Quản trị viên hệ thống sàn giao dịch GameAsset.', 15000000.00),
(2, 'hung_creator', 'Nguyễn Trọng Hùng', 'hung.nt23010083@phenikaa.edu.vn', '$2b$10$w8kF5n12N0gD9XpD8bN5Me1j2q9E4Fz7R9Y4X2C1B8V6A3Z0L8P2a', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 'creator', 'Họa sĩ Pixel Art & Nhà phát triển game độc lập.', 2500000.00),
(3, 'toan_3d', 'Bùi Khắc Toản', 'toan.bk23010003@phenikaa.edu.vn', '$2b$10$w8kF5n12N0gD9XpD8bN5Me1j2q9E4Fz7R9Y4X2C1B8V6A3Z0L8P2a', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'creator', 'Chuyên viên dựng hình 3D Low-Poly và PBR Texture.', 1800000.00),
(4, 'buyer_demo', 'Lập Trình Viên Indie', 'buyer@gmail.com', '$2b$10$w8kF5n12N0gD9XpD8bN5Me1j2q9E4Fz7R9Y4X2C1B8V6A3Z0L8P2a', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'customer', 'Đang tìm kiếm tài nguyên đồ họa làm game tốt nghiệp.', 500000.00);

-- 2. NẠP CATEGORIES MẪU
INSERT INTO `Categories` (`category_id`, `name`, `slug`, `description`) VALUES
(1, '2D Sprites & Pixel Art', '2d-game-assets', 'Các gói nhân vật, hoạt họa chuyển động cắt lát (spritesheet), tileset bản đồ 2D cho Unity, Godot.'),
(2, '3D Models & Low-Poly', '3d-models', 'Vật thể 3D, nhân vật, vũ khí, xe cộ chuẩn định dạng FBX, OBJ, GLTF kèm vật liệu PBR.'),
(3, 'Âm thanh & SFX Bản quyền', 'audio-sfx', 'Nhạc nền lặp (BGM), hiệu ứng âm thanh tiếng nổ, tiếng kiếm, âm thanh môi trường 100% Royalty-Free.'),
(4, 'Game UI Kits & HUD', 'gui-fonts', 'Bộ giao diện thanh máu, minimap, khung thoại, nút bấm sci-fi, fantasy và font chữ game retro.');

-- 3. NẠP TAGS MẪU
INSERT INTO `Tags` (`tag_id`, `name`, `slug`) VALUES
(1, 'Pixel Art', 'pixel-art'),
(2, 'Low-Poly', 'low-poly'),
(3, 'Fantasy RPG', 'fantasy-rpg'),
(4, 'Cyberpunk', 'cyberpunk'),
(5, 'Freebies', 'freebies'),
(6, 'Sci-Fi', 'sci-fi'),
(7, '8-Bit Retro', '8-bit-retro'),
(8, 'Unity Ready', 'unity-ready');

-- 4. NẠP ASSETS MẪU (8 SẢN PHẨM PHONG PHÚ ĐỦ 4 DANH MỤC)
INSERT INTO `Assets` (`asset_id`, `title`, `short_description`, `description`, `price`, `thumbnail_url`, `file_url`, `file_size`, `license`, `views_count`, `downloads_count`, `status`, `uploader_id`, `category_id`) VALUES
(1, 'Cyberpunk Sci-Fi Soldier 2D Spritesheet', 'Nhân vật lính đánh thuê cyberpunk 2D với 8 hoạt ảnh chuyển động mượt mà.', 'Gói tài nguyên bao gồm spritesheet độ phân giải cao định dạng PNG và tệp JSON atlas. Tích hợp sẵn hoạt ảnh: Idle, Run, Shoot, Reload, Jump, Hurt, Death. Chuẩn bị sẵn sàng kéo thả vào Unity và Godot Engine.', 0.00, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/cyber_soldier_2d.zip', 14500000, 'CC-BY 4.0 (Commercial Free)', 1240, 480, 'active', 2, 1),

(2, 'Medieval Low-Poly Castle & Fortress Pack', 'Bộ công trình lâu đài, thành trì trung cổ low-poly tối ưu cho game mobile.', 'Hơn 45 prefab lâu đài, tháp canh, cổng sắt, cầu treo và tường thành cổ kính. Định dạng .FBX và .OBJ kèm bảng màu texture palette siêu nhẹ, giúp game chạy ổn định 60 FPS trên thiết bị di động.', 89000.00, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/lowpoly_castle.zip', 48200000, 'Standard Commercial License', 890, 142, 'active', 3, 2),

(3, 'Arcade 8-Bit Retro SFX & Chiptune BGM', 'Gói hơn 150 hiệu ứng âm thanh 8-bit và 5 bản nhạc nền phiêu lưu kinh điển.', 'Âm thanh chất lượng cao chuẩn WAV không nén (44.1kHz, 16-bit). Bao gồm: âm nhảy nhót, laser, chém đao, nổ bom, ăn tiền vàng, game over và nhạc nền màn chơi phong cách NES/GameBoy.', 0.00, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/retro_sfx_pack.zip', 95000000, 'CC0 Public Domain', 2100, 895, 'active', 2, 3),

(4, 'Futuristic Neon HUD & Game UI Kit', 'Bộ giao diện người dùng công nghệ viễn tưởng với thanh máu, menu và minimap.', 'Giao diện vector sắc nét (SVG, PSD, PNG) hỗ trợ màn hình 4K. Bao gồm thanh máu neon, bảng nhiệm vụ, vòng radar xoay, nút bấm chuyển trạng thái và 2 font chữ điện tử cyberpunk.', 120000.00, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/neon_hud_kit.zip', 32000000, 'Standard Commercial License', 750, 98, 'active', 2, 4),

(5, 'Tiny Dungeon Pixel Monsters & Bosses', 'Bộ sưu tập 20 quái vật hầm ngục và 3 trùm cuối phong cách pixel retro.', 'Mỗi quái vật đều có các animation chuẩn 16x16: di chuyển, tấn công, chịu đòn và biến mất. Rất thích hợp cho các tựa game Roguelike hoặc Metroidvania 2D.', 45000.00, 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/dungeon_monsters.zip', 8500000, 'Standard Commercial License', 620, 85, 'active', 2, 1),

(6, 'Stylized 3D Fantasy Weapon Arsenal', 'Kho vũ khí thần thoại 3D bao gồm kiếm ánh sáng, rìu chiến và quyền trượng.', '24 mẫu vũ khí thần thoại phong cách hoạt họa stylized. Đi kèm hiệu ứng shader phát sáng và texture PBR hand-painted đầy ấn tượng cho Unity URP và Unreal Engine 5.', 150000.00, 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/fantasy_weapons_3d.zip', 67000000, 'Standard Commercial License', 1100, 215, 'active', 3, 2),

(7, 'Ambient Nature & Dark Forest Audio Loops', 'Nhạc nền môi trường thiên nhiên, rừng rậm bí ẩn và âm thanh thời tiết sống động.', '10 bản nhạc nền lặp vô tận (Loopable tracks) thời lượng dài mô tả rừng sâu đêm tối, tiếng mưa rơi sấm chớp, tiếng gió rít qua khe núi và hang động đổ nát.', 0.00, 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/nature_ambient_loops.zip', 120000000, 'Royalty-Free License', 930, 310, 'active', 3, 3),

(8, 'Fantasy Wooden RPG Dialog & Inventory UI', 'Bộ giao diện hòm đồ, bảng thuộc tính nhân vật và khung hội thoại gỗ cổ điển.', 'Thiết kế mộc mạc phong cách RPG kinh điển. Cung cấp đầy đủ icon vật phẩm vũ khí, bình thuốc, trang sức và các thanh cuộn dễ dàng ghép nối với Unity Canvas.', 65000.00, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'https://storage.gameasset.local/files/wooden_rpg_ui.zip', 21000000, 'Standard Commercial License', 510, 67, 'active', 2, 4);

-- 5. NẠP ASSET_MEDIA (Ảnh xem trước & Demo chi tiết)
INSERT INTO `AssetMedia` (`media_id`, `asset_id`, `media_url`, `media_type`, `display_order`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000', 'image', 1),
(2, 1, 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1000', 'image', 2),
(3, 2, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000', 'image', 1),
(4, 3, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000', 'image', 1),
(5, 4, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000', 'image', 1),
(6, 6, 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000', 'image', 1);

-- 6. NẠP ASSET_TAGS (Gắn thẻ đa tiêu chí)
INSERT INTO `AssetTags` (`asset_id`, `tag_id`) VALUES
(1, 1), (1, 4), (1, 5), (1, 8),
(2, 2), (2, 3), (2, 8),
(3, 5), (3, 7),
(4, 4), (4, 6),
(5, 1), (5, 3),
(6, 2), (6, 3), (6, 8),
(7, 3), (7, 5),
(8, 3), (8, 8);

-- 7. NẠP REVIEWS MẪU (Đánh giá thực tế)
INSERT INTO `Reviews` (`review_id`, `user_id`, `asset_id`, `rating`, `comment`, `created_at`) VALUES
(1, 4, 1, 5, 'Animation rất mượt mà, mình đã import vào Unity và chạy ngay trong 5 phút. Cảm ơn tác giả nhiều!', NOW()),
(2, 2, 2, 5, 'Mesh low-poly rất sạch sẽ, tối ưu polycount rất tốt cho dự án game mobile của mình.', NOW()),
(3, 4, 3, 5, 'Bộ âm thanh hoài niệm tuyệt vời, chuẩn chiptune không thể chê vào đâu được.', NOW()),
(4, 3, 4, 4, 'Thiết kế HUD sắc nét, màu sắc neon nổi bật trên nền tối.', NOW());

-- 8. NẠP ĐƠN HÀNG MẪU (Lịch sử giao dịch)
INSERT INTO `Orders` (`order_id`, `user_id`, `total_amount`, `payment_method`, `status`, `created_at`) VALUES
(1, 4, 89000.00, 'wallet', 'completed', NOW()),
(2, 4, 0.00, 'wallet', 'completed', NOW());

INSERT INTO `OrderDetails` (`order_detail_id`, `order_id`, `asset_id`, `price_at_purchase`) VALUES
(1, 1, 2, 89000.00),
(2, 2, 1, 0.00);

-- Hoàn tất seed dữ liệu!
