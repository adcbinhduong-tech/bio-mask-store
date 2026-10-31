const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { testConnection, pool } = require('./config/db');

// Load environment variables (hỗ trợ chạy từ root hoặc từ backend)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Hỗ trợ gọi từ Live Server, localhost, và file direct
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check & DB Status Endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const conn = await pool.getConnection();
    conn.release();
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'disconnected';
  }

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'BIOCELLA E-Commerce Backend API',
    database: {
      type: 'MySQL',
      status: dbStatus,
      name: process.env.DB_NAME || 'biocella_db',
      host: process.env.DB_HOST || 'localhost'
    }
  });
});

// Mount API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Serve Frontend Static Files (Storefront & Admin CMS)
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Đường dẫn truy cập trực tiếp
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

// 404 Route Handler cho các API không tồn tại
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Đường dẫn API không tồn tại: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi máy chủ nội bộ',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log('\n=============================================================');
  console.log(`🌿 [BIOCELLA FULLSTACK] Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`🛍️ Trang Bán Hàng (Storefront): http://localhost:${PORT}`);
  console.log(`⚙️ Trang Quản Trị (Admin CMS):  http://localhost:${PORT}/admin`);
  console.log(`📌 API Health Check:             http://localhost:${PORT}/api/health`);
  console.log('=============================================================');

  // Kiểm tra kết nối MySQL
  await testConnection();

  // Tự động mở trình duyệt trên Windows
  try {
    const { exec } = require('child_process');
    exec(`start http://localhost:${PORT}`);
  } catch (e) {}
});
