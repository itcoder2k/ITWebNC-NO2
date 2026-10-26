import { DataSource } from 'typeorm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load cấu hình từ file .env
dotenv.config({ path: path.join(__dirname, '.env') });

async function runSeed() {
  console.log('--- BẮT ĐẦU NẠP CƠ SỞ DỮ LIỆU SEED DATA CHO DỰ ÁN ---');

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = Number(process.env.DB_PORT) || 3306;
  const dbUser = process.env.DB_USERNAME || 'root';
  const dbPass = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';

  console.log(`🔌 Kết nối tới MySQL: ${dbUser}@${dbHost}:${dbPort}...`);

  const dataSource = new DataSource({
    type: 'mysql',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPass,
    multipleStatements: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Kết nối MySQL thành công!');

    // Tạo CSDL nếu chưa có
    await dataSource.query('CREATE DATABASE IF NOT EXISTS `GameAssetDB` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    await dataSource.query('USE `GameAssetDB`;');
    console.log('✅ Đã chọn cơ sở dữ liệu `GameAssetDB`.');

    const sqlFilePath = path.join(__dirname, 'seed_data.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('⏳ Đang thực thi nạp dữ liệu từ file seed_data.sql...');
    await dataSource.query(sqlContent);

    console.log('🎉 NẠP DATABASE HOÀN TẤT THÀNH CÔNG RỰC RỠ!');
    console.log('====================================================');
    console.log('📊 ĐÃ NẠP XONG TOÀN BỘ DỮ LIỆU THỰC TẾ:');
    console.log('   - 4 Tài khoản người dùng (Admin, Hùng, Toản, Buyer)');
    console.log('   - 4 Danh mục game chuẩn (2D, 3D, Âm thanh, UI Kits)');
    console.log('   - 8 Thẻ tags đa tiêu chí');
    console.log('   - 8 Tài nguyên game chất lượng cao kèm ảnh thực tế');
    console.log('   - Đơn hàng mẫu & đánh giá review');
    console.log('🔑 MẬT KHẨU TẤT CẢ TÀI KHOẢN: 123456');
    console.log('====================================================');

  } catch (error) {
    console.error('❌ Lỗi nạp database:', error.message);
    console.log('👉 Gợi ý: Hãy kiểm tra mật khẩu MySQL trong file server/.env và bật MySQL ở cổng 3306.');
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeed();
