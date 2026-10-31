const { pool } = require('../config/db');

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const [rows] = await pool.query(
      'SELECT id, username, password, email, full_name, created_at FROM admins WHERE LOWER(username) = ? OR LOWER(email) = ?',
      [cleanUsername, cleanUsername]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại trong hệ thống' });
    }

    const admin = rows[0];
    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác' });
    }

    // Generate simulated token
    const token = 'biocella_token_' + Buffer.from(`${admin.id}:${admin.username}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          fullName: admin.full_name
        }
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Lỗi xác thực máy chủ', error: error.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, full_name, created_at FROM admins LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Chưa có tài khoản quản trị' });
    }
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching admin info:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
  }
};
