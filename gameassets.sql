CREATE DATABASE IF NOT EXISTS GameAssetDB;
USE GameAssetDB;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'creator', 'customer') DEFAULT 'customer',
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS Assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    thumbnail_url VARCHAR(255),
    file_url VARCHAR(255) NOT NULL,
    downloads_count INT NOT NULL DEFAULT 0,
    status ENUM('active', 'archived', 'pending') DEFAULT 'active',
    uploader_id INT,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'wallet', 
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OrderDetails (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    asset_id INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id) ON DELETE RESTRICT
);

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

INSERT INTO Users (username, email, password_hash, role, balance) VALUES 
('admin', 'admin@gameasset.vn', '$2b$10$xyzAdminHashPlaceholder', 'admin', 0.00),
('creator_alex', 'alex@creator.com', '$2b$10$xyzCreatorHashPlaceholder', 'creator', 150.00),
('customer_john', 'john@gamer.com', '$2b$10$xyzCustomerHashPlaceholder', 'customer', 50.00);

INSERT INTO Categories (name, slug, description) VALUES 
('2D Animations', '2d-animations', 'Spine files (.skel, .atlas), spritesheets'),
('3D Models', '3d-models', 'FBX, OBJ, and rigged 3D models'),
('Audio & SFX', 'audio-sfx', 'Background music and sound effects'),
('UI Elements', 'ui-elements', 'Game HUD, icons, and menus');

INSERT INTO Assets (title, description, price, thumbnail_url, file_url, downloads_count, status, uploader_id, category_id) VALUES 
('Sci-fi Character Idle Animation', 'Includes Spine 2D .skel and .atlas files', 15.00, '/thumbnails/scifi_idle.png', '/uploads/assets/scifi_idle.zip', 12, 'active', 2, 1),
('Low Poly Medieval Knight', 'Rigged 3D model with FBX and Blender sources', 25.00, '/thumbnails/knight_3d.png', '/uploads/assets/knight_3d.zip', 5, 'active', 2, 2);

INSERT INTO Orders (user_id, total_amount, payment_method, status) VALUES
(3, 15.00, 'wallet', 'completed');

INSERT INTO OrderDetails (order_id, asset_id, price_at_purchase) VALUES
(1, 1, 15.00);

INSERT INTO Reviews (user_id, asset_id, rating, comment) VALUES
(3, 1, 5, 'Chất lượng animation mượt mà, tài nguyên rất sạch!');