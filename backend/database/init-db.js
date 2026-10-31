const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT, 10) || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'biocella_db';

async function initDatabase() {
  console.log('====================================================');
  console.log('🚀 [BIOCELLA] Khởi tạo Cơ Sở Dữ Liệu MySQL...');
  console.log(`📌 Kết nối đến: ${user}@${host}:${port}`);
  console.log('====================================================');

  let connection;
  try {
    // 1. Kết nối đến MySQL Server (tự động bật nếu chưa chạy)
    try {
      connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        multipleStatements: true
      });
    } catch (connectErr) {
      if (connectErr.code === 'ECONNREFUSED') {
        const { spawn } = require('child_process');
        const mariaPath = 'C:\\Program Files\\MariaDB 13.0\\bin\\mysqld.exe';
        const dataPath = 'C:\\Program Files\\MariaDB 13.0\\data';
        if (fs.existsSync(mariaPath)) {
          console.log('🔄 Đang tự động kích hoạt MySQL Server trên cổng 3306...');
          try {
            spawn(mariaPath, [`--datadir=${dataPath}`, '--console'], {
              detached: true,
              stdio: 'ignore'
            }).unref();
            await new Promise((r) => setTimeout(r, 2500));
            connection = await mysql.createConnection({
              host,
              port,
              user,
              password,
              multipleStatements: true
            });
          } catch (retryErr) {
            throw connectErr;
          }
        } else {
          throw connectErr;
        }
      } else {
        throw connectErr;
      }
    }
    console.log('✅ Đã kết nối thành công đến MySQL Server!');

    // 2. Đọc file schema.sql và thực thi
    const schemaSqlPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaSqlPath)) {
      console.log('📄 Đang thực thi schema.sql (Tạo Database & Bảng)...');
      const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Đã tạo Database và các Bảng thành công!');
    }

    // 3. Đọc file seed.sql và nạp dữ liệu mẫu
    const seedSqlPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedSqlPath)) {
      console.log('🌱 Đang thực thi seed.sql (Nạp dữ liệu mẫu sản phẩm, đơn hàng, voucher, cài đặt)...');
      const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
      await connection.query(seedSql);
      console.log('✅ Đã nạp dữ liệu khởi tạo thành công!');
    }

    console.log('\n🎉 ====================================================');
    console.log(`🎉 Cơ sở dữ liệu [${database}] đã sẵn sàng hoạt động!`);
    console.log('👉 Bây giờ bạn có thể khởi động backend bằng lệnh:');
    console.log('   npm start');
    console.log('====================================================\n');
  } catch (error) {
    console.error('\n❌ [LỖI KHỞI TẠO DATABASE]:');
    console.error(`- Mã lỗi: ${error.code}`);
    console.error(`- Thông báo: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n👉 Gợi ý: Hãy mở XAMPP hoặc Laragon và bấm nút "Start" ở module MySQL!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n👉 Gợi ý: Sai tài khoản hoặc mật khẩu MySQL trong file backend/.env!');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
