USE GameAssetDB;

INSERT INTO Users (user_id, username, display_name, email, password_hash, avatar_url, role, bio, balance) VALUES 
(1, 'admin', 'System Administrator', 'admin@gameasset.vn', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecDw5GYWnvWArRhWy', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', 'admin', 'Quan tri vien he thong Game Asset Marketplace.', 0.00),
(2, 'ansimuz', 'Ansimuz Indie Art', 'ansimuz@creator.io', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecDw5GYWnvWArRhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ansimuz', 'creator', 'Nghe si Pixel Art tu do chuyen tao asset platformer va retro game.', 320.00),
(3, 'kenney_nl', 'Kenney Asset Studio', 'kenney@assets.org', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecDw5GYWnvWArRhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=kenney', 'creator', 'Noi tieng voi cac goi tai nguyen game mien phi va thuong mai chat luong cao.', 580.00),
(4, 'craftpix', 'CraftPix Animation', 'info@craftpix.net', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecDw5GYWnvWArRhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=craftpix', 'creator', 'Chuyen thiet ke 2D Spine character animation va tilesets phong phu.', 195.00),
(5, 'gamer_john', 'John Developer', 'john@indiegamer.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecDw5GYWnvWArRhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', 'customer', 'Solo indie game dev dang phat trien game nhap vai tren Unity.', 45.00),
(6, 'dev_sarah', 'Sarah Connor', 'sarah@scifigames.net', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecDw5GYWnvWArRhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', 'customer', 'Lap trinh vien Godot Engine dam me game the loai Cyberpunk.', 120.00)
ON DUPLICATE KEY UPDATE username=VALUES(username);

INSERT INTO Categories (category_id, name, slug, description) VALUES 
(1, '2D Game Assets', '2d-game-assets', 'Spritesheets, nhan vat pixel art, tilesets phong canh 2D, backgrounds.'),
(2, '3D Models', '3d-models', 'Mo hinh 3D dinh dang FBX, OBJ, Blender, Low-Poly nhan vat va vat pham.'),
(3, 'Audio & SFX', 'audio-sfx', 'Hieu ung am thanh tro choi (SFX), nhac nen (BGM) loop 8-bit va hien dai.'),
(4, 'Visual Effects (VFX)', 'visual-effects', 'Hieu ung phep thuat, khoi lua, no, particle systems 2D va 3D.'),
(5, 'GUI & Fonts', 'gui-fonts', 'Giao dien game (HUD), thanh mau, inventory, hop thoai, font chu retro.'),
(6, 'Game Templates', 'game-templates', 'Source code du an mau hoan chinh danh cho Unity, Godot va Unreal Engine.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO Tags (tag_id, name, slug) VALUES 
(1, 'Pixel Art', 'pixel-art'),
(2, 'Animated', 'animated'),
(3, 'Low Poly', 'low-poly'),
(4, 'Retro', 'retro'),
(5, 'Sci-Fi', 'scifi'),
(6, 'Fantasy', 'fantasy'),
(7, 'Sound Effects', 'sound-effects'),
(8, 'Music', 'music'),
(9, 'Tileset', 'tileset'),
(10, 'Roguelike', 'roguelike'),
(11, 'Cyberpunk', 'cyberpunk'),
(12, 'Free', 'free')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO Assets (asset_id, title, short_description, description, price, thumbnail_url, file_url, file_size, license, views_count, downloads_count, status, uploader_id, category_id) VALUES 
(1, 'SunnyLand 2D Pixel Adventure', 'Goi nhan vat va vuon thu pixel art kem day du hoat anh chuyen dong.', 
 'SunnyLand la bo tai nguyen pixel art kinh dien bao gom nhan vat chinh, 6 loai ke thu, hieu ung nhat kim cuong va tileset khu rung. Ho tro day du cac trang thai Idle, Run, Jump, Hurt, Fall.', 
 0.00, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', '/uploads/assets/sunnyland_pixel_pack.zip', 13002342, 'CC0 (Public Domain)', 1540, 680, 'active', 2, 1),

(2, 'Cyberpunk Street Brawler Spritesheet', 'Nhan vat chien dau duong pho phong cach Cyberpunk cuc chat voi combo don danh.', 
 'Goi nhan vat do hoa pixel tinh xao voi hon 12 animation khac nhau: Combo dam 3 nhat, da xoay, luot nhanh, su dung sung dien. Dinh dang PNG spritesheet va file du an Aseprite goc.', 
 10.00, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80', '/uploads/assets/cyberpunk_brawler.zip', 9017753, 'Standard Indie Commercial License', 890, 142, 'active', 2, 1),

(3, 'Low Poly Fantasy Dungeon 3D', 'Bo 3D mo-dun ham nguc huyen bi toi uu hoa tot cho game mobile va PC.', 
 'Hon 120 mo hinh 3D Low-Poly gom tuong da, cot chong, rhom bau, duoc lua co anh sang, bay gai, cua ham. Da duoc rig san va texture atlas 512x512 tiet kiem hieu nang.', 
 15.00, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80', '/uploads/assets/lowpoly_fantasy_dungeon.zip', 35861299, 'Standard Indie Commercial License', 1210, 89, 'active', 3, 2),

(4, 'Retro 8-Bit Arcade SFX Collection', 'Bo 150+ am thanh chiptune retro cho game arcade, phieu luu co dien.', 
 'Bao gom am thanh tieng sung laser, no tung toe, nhat dong xu vang, nhay cao, hoan thanh man choi va Game Over. Dinh dang WAV 44.1kHz 16-bit va MP3 chat luong cao.', 
 5.00, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', '/uploads/assets/retro_arcade_sfx.zip', 48025804, 'CC-BY (Attribution)', 670, 75, 'active', 3, 3),

(5, 'Medieval Sci-Fi GUI & HUD Kit', 'Giao dien nguoi dung pha tron giua huyen ao va cong nghe cao tuyet dep.', 
 'Bo giao dien UI vector hoan chinh: Thanh sinh luc mau, thanh mana nang luong, ban do mini radar, khung tui do (Inventory), cua so hop thoai NPC. Cung cap file goc Figma va PSD.', 
 8.00, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', '/uploads/assets/scifi_gui_hud.zip', 18979225, 'Standard Indie Commercial License', 430, 52, 'active', 4, 5)
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO AssetMedia (asset_id, media_url, media_type, display_order) VALUES 
(1, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', 'image', 1),
(1, 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5pdmVyc2Fs/26AHONQ79FdWZhAI0/giphy.gif', 'gif', 2),
(2, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80', 'image', 1),
(2, 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5pdmVyc2Fs/l3vR1634Q3Goqw62c/giphy.gif', 'gif', 2),
(3, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80', 'image', 1),
(4, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80', 'image', 1),
(5, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80', 'image', 1);

INSERT INTO AssetTags (asset_id, tag_id) VALUES 
(1, 1),
(1, 2),
(1, 9),
(1, 12),
(2, 1),
(2, 2),
(2, 5),
(2, 11),
(3, 3),
(3, 6),
(3, 10),
(4, 4),
(4, 7),
(5, 5),
(5, 6)
ON DUPLICATE KEY UPDATE asset_id=VALUES(asset_id);

INSERT INTO Orders (order_id, user_id, total_amount, payment_method, status) VALUES 
(1, 5, 0.00, 'wallet', 'Completed'),
(2, 5, 10.00, 'wallet', 'Completed'),
(3, 6, 15.00, 'wallet', 'Completed')
ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);

INSERT INTO OrderDetails (order_detail_id, order_id, asset_id, price_at_purchase) VALUES 
(1, 1, 1, 0.00),
(2, 2, 2, 10.00),
(3, 3, 3, 15.00)
ON DUPLICATE KEY UPDATE price_at_purchase=VALUES(price_at_purchase);

INSERT INTO Reviews (user_id, asset_id, rating, comment) VALUES 
(5, 1, 5, 'Asset qua dep va tuyet voi cho nguoi moi bat dau hoc lam game!'),
(5, 2, 5, 'Animation combo danh rat muot ma, sprite sheet tach frame rat chuan.'),
(6, 4, 5, 'Am thanh 8-bit hoai niem, add vao game ban chim chay cuc ky phu hop.')
ON DUPLICATE KEY UPDATE rating=VALUES(rating);
