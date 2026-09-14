-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS GameAssetDB;
USE GameAssetDB;

-- Bảng Người dùng (User)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'modder', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Danh mục (Category)
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Bảng Tài nguyên Game (Asset)
CREATE TABLE Assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    file_url VARCHAR(255) NOT NULL, -- Đường dẫn tải file (vd: .skel, .png)
    uploader_id INT,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- Bảng Đơn hàng (Order)
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Chi tiết Đơn hàng (Order Detail)
CREATE TABLE OrderDetails (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    asset_id INT,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id) ON DELETE CASCADE
);

-- Insert dữ liệu mẫu
INSERT INTO Users (username, email, password_hash, role) VALUES 
('hieunt', 'hieunt@st.phenikaa-uni.edu.vn', 'hash123', 'modder'),
('customer1', 'khachhang@gmail.com', 'hash456', 'customer');

INSERT INTO Categories (name, description) VALUES 
('2D Animations', 'Spine files (.skel, .atlas), spritesheets'),
('3D Models', 'FBX, OBJ, and rigged models');

INSERT INTO Assets (title, description, price, file_url, uploader_id, category_id) VALUES 
('Sci-fi Character Idle Animation', 'Includes .skel and .atlas files', 15.00, '/assets/scifi_idle.zip', 1, 1);