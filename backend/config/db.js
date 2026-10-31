const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'biocella_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL] Kết nối thành công đến cơ sở dữ liệu: ${dbConfig.database} (${dbConfig.host}:${dbConfig.port})`);
    connection.release();
    return true;
  } catch (error) {
    console.error('\n⚠️ [MySQL ERROR] Không thể kết nối đến MySQL Server:');
    console.error(`- Host: ${dbConfig.host}:${dbConfig.port}`);
    console.error(`- User: ${dbConfig.user}`);
    console.error(`- Database: ${dbConfig.database}`);
    console.error(`- Lỗi chi tiết: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      const fs = require('fs');
      const { spawn } = require('child_process');
      const mariaPath = 'C:\\Program Files\\MariaDB 13.0\\bin\\mysqld.exe';
      const dataPath = 'C:\\Program Files\\MariaDB 13.0\\data';
      if (fs.existsSync(mariaPath)) {
        console.log('🔄 Đang tự động kích hoạt MySQL Server trong nền...');
        try {
          spawn(mariaPath, [`--datadir=${dataPath}`, '--console'], {
            detached: true,
            stdio: 'ignore'
          }).unref();
          await new Promise((r) => setTimeout(r, 2000));
          const retryConn = await pool.getConnection();
          console.log(`[MySQL] Kết nối thành công đến cơ sở dữ liệu: ${dbConfig.database} (${dbConfig.host}:${dbConfig.port})`);
          retryConn.release();
          return true;
        } catch (e2) {}
      }
      console.error('\n👉 Gợi ý: Hãy mở XAMPP hoặc Laragon và bấm "Start" ở mục MySQL!\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n👉 Gợi ý: Database chưa được tạo. Hãy chạy lệnh: npm run init-db\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n👉 Gợi ý: Kiểm tra lại DB_USER và DB_PASSWORD trong file backend/.env\n');
    }
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  dbConfig
};
