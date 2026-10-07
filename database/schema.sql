CREATE DATABASE IF NOT EXISTS GameAssetDB 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE GameAssetDB;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NULL,
    role ENUM('admin', 'creator', 'customer') NOT NULL DEFAULT 'customer',
    bio TEXT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_tag_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    short_description VARCHAR(255) NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    thumbnail_url VARCHAR(255) NULL,
    file_url VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    license VARCHAR(100) DEFAULT 'Standard Indie Commercial License',
    views_count INT NOT NULL DEFAULT 0,
    downloads_count INT NOT NULL DEFAULT 0,
    status ENUM('active', 'archived', 'pending') NOT NULL DEFAULT 'active',
    uploader_id INT NULL,
    category_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asset_price (price),
    INDEX idx_asset_status (status),
    INDEX idx_asset_uploader (uploader_id),
    INDEX idx_asset_category (category_id),
    CONSTRAINT fk_assets_uploader FOREIGN KEY (uploader_id) 
        REFERENCES Users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_assets_category FOREIGN KEY (category_id) 
        REFERENCES Categories(category_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS AssetMedia (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    media_type ENUM('image', 'gif', 'audio', 'video') NOT NULL DEFAULT 'image',
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_assetmedia_asset (asset_id),
    CONSTRAINT fk_assetmedia_asset FOREIGN KEY (asset_id) 
        REFERENCES Assets(asset_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS AssetTags (
    asset_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (asset_id, tag_id),
    INDEX idx_assettags_tag (tag_id),
    CONSTRAINT fk_assettags_asset FOREIGN KEY (asset_id) 
        REFERENCES Assets(asset_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_assettags_tag FOREIGN KEY (tag_id) 
        REFERENCES Tags(tag_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'wallet',
    status ENUM('Pending', 'Completed', 'Cancelled', 'pending', 'completed', 'cancelled') NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) 
        REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS OrderDetails (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    asset_id INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    INDEX idx_orderdetails_order (order_id),
    INDEX idx_orderdetails_asset (asset_id),
    CONSTRAINT fk_orderdetails_order FOREIGN KEY (order_id) 
        REFERENCES Orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_orderdetails_asset FOREIGN KEY (asset_id) 
        REFERENCES Assets(asset_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_asset_review (user_id, asset_id),
    INDEX idx_reviews_asset (asset_id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) 
        REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_asset FOREIGN KEY (asset_id) 
        REFERENCES Assets(asset_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
