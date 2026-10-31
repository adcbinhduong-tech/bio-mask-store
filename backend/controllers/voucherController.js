const { pool } = require('../config/db');

function formatVoucher(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value),
    minOrder: Number(row.min_order || 0),
    label: row.label || '',
    isActive: Boolean(row.is_active),
    createdAt: row.created_at
  };
}

// GET /api/vouchers
exports.getAllVouchers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vouchers WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({
      success: true,
      data: rows.map(formatVoucher)
    });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách voucher', error: error.message });
  }
};

// POST /api/vouchers/validate (Kiểm tra và áp dụng mã giảm giá)
exports.validateVoucher = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mã giảm giá' });
    }

    const cleanCode = code.trim().toUpperCase();
    const [rows] = await pool.query('SELECT * FROM vouchers WHERE UPPER(code) = ? AND is_active = 1', [cleanCode]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    }

    const voucher = formatVoucher(rows[0]);
    const cartSubtotal = Number(subtotal || 0);

    if (voucher.minOrder > 0 && cartSubtotal < voucher.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Mã chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(voucher.minOrder)}đ trở lên`
      });
    }

    let discountAmount = 0;
    if (voucher.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * voucher.value) / 100);
    } else {
      discountAmount = voucher.value;
    }

    res.json({
      success: true,
      message: `Đã áp dụng mã: ${voucher.label || voucher.code}`,
      data: {
        ...voucher,
        discountAmount
      }
    });
  } catch (error) {
    console.error('Error validating voucher:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi kiểm tra mã giảm giá', error: error.message });
  }
};

// POST /api/vouchers (Tạo voucher mới từ Admin)
exports.createVoucher = async (req, res) => {
  try {
    const { code, type, value, minOrder, label } = req.body;
    if (!code || !type || value === undefined) {
      return res.status(400).json({ success: false, message: 'Mã code, loại giảm giá và giá trị là bắt buộc' });
    }

    const upperCode = code.trim().toUpperCase();
    const sql = `
      INSERT INTO vouchers (code, type, value, min_order, label, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE type=VALUES(type), value=VALUES(value), min_order=VALUES(min_order), label=VALUES(label), is_active=1
    `;

    await pool.query(sql, [upperCode, type, Number(value), Number(minOrder || 0), label || '']);

    const [rows] = await pool.query('SELECT * FROM vouchers WHERE code = ?', [upperCode]);
    res.status(201).json({
      success: true,
      message: 'Tạo mã voucher thành công',
      data: formatVoucher(rows[0])
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo voucher', error: error.message });
  }
};

// DELETE /api/vouchers/:code
exports.deleteVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    const [result] = await pool.query('DELETE FROM vouchers WHERE UPPER(code) = ?', [code.toUpperCase()]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy voucher để xóa' });
    }
    res.json({ success: true, message: 'Đã xóa mã voucher thành công' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa voucher', error: error.message });
  }
};
