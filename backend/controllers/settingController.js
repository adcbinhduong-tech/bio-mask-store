const { pool } = require('../config/db');

function formatSettings(row) {
  if (!row) return null;
  return {
    brandName: row.brand_name || 'BIOCELLA',
    brandSlogan: row.brand_slogan || 'BIO-CELLULOSE LAB',
    announcementText: row.announcement_text || '🎁 ƯU ĐÃI THÁNG MỚI: Nhập mã BIOCELLA10 giảm ngay 10% đơn đầu tiên',
    shippingNotice: row.shipping_notice || '🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 350.000đ',
    freeShippingThreshold: Number(row.free_shipping_threshold || 350000),
    hotline: row.hotline || '1900 6828',
    heroTitle: row.hero_title || 'Đánh Thức Làn Da Tái Sinh Cùng Mặt Nạ Men Dừa Chuẩn Y Khoa',
    heroDesc: row.hero_desc || 'Dệt từ 100% nước dừa tươi Bến Tre lên men tự nhiên. Màng sợi sinh học Bio-Cellulose nano 20nm ôm khít như làn da thứ hai, đưa dưỡng chất thẩm thấu sâu gấp 20 lần mặt nạ giấy thông thường.',
    bankId: row.bank_id || 'MB',
    bankAccount: row.bank_account || '0988776655',
    bankOwner: row.bank_owner || 'CONG TY BIOCELLA VIET NAM',
    updatedAt: row.updated_at
  };
}

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    if (rows.length === 0) {
      // Return defaults
      return res.json({
        success: true,
        data: formatSettings({})
      });
    }
    res.json({
      success: true,
      data: formatSettings(rows[0])
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải cài đặt website', error: error.message });
  }
};

// PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const s = req.body;
    const sql = `
      INSERT INTO site_settings (
        id, brand_name, brand_slogan, announcement_text, shipping_notice,
        free_shipping_threshold, hotline, hero_title, hero_desc,
        bank_id, bank_account, bank_owner
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        brand_name = VALUES(brand_name),
        brand_slogan = VALUES(brand_slogan),
        announcement_text = VALUES(announcement_text),
        shipping_notice = VALUES(shipping_notice),
        free_shipping_threshold = VALUES(free_shipping_threshold),
        hotline = VALUES(hotline),
        hero_title = VALUES(hero_title),
        hero_desc = VALUES(hero_desc),
        bank_id = VALUES(bank_id),
        bank_account = VALUES(bank_account),
        bank_owner = VALUES(bank_owner)
    `;

    const params = [
      s.brandName || 'BIOCELLA',
      s.brandSlogan || 'BIO-CELLULOSE LAB',
      s.announcementText || '',
      s.shippingNotice || '',
      Number(s.freeShippingThreshold || 350000),
      s.hotline || '1900 6828',
      s.heroTitle || '',
      s.heroDesc || '',
      s.bankId || 'MB',
      s.bankAccount || '',
      s.bankOwner || ''
    ];

    await pool.query(sql, params);

    const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    res.json({
      success: true,
      message: 'Cập nhật cấu hình website thành công',
      data: formatSettings(rows[0])
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật cấu hình', error: error.message });
  }
};

// POST /api/settings/reset (Khôi phục mặc định)
exports.resetToDefaults = async (req, res) => {
  try {
    const defaultSql = `
      UPDATE site_settings SET
        brand_name = 'BIOCELLA',
        brand_slogan = 'BIO-CELLULOSE LAB',
        announcement_text = '🎁 ƯU ĐÃI THÁNG MỚI: Nhập mã BIOCELLA10 giảm ngay 10% đơn đầu tiên',
        shipping_notice = '🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 350.000đ',
        free_shipping_threshold = 350000,
        hotline = '1900 6828',
        hero_title = 'Đánh Thức Làn Da Tái Sinh Cùng Mặt Nạ Men Dừa Chuẩn Y Khoa',
        hero_desc = 'Dệt từ 100% nước dừa tươi Bến Tre lên men tự nhiên. Màng sợi sinh học Bio-Cellulose nano 20nm ôm khít như làn da thứ hai, đưa dưỡng chất thẩm thấu sâu gấp 20 lần mặt nạ giấy thông thường.',
        bank_id = 'MB',
        bank_account = '0988776655',
        bank_owner = 'CONG TY BIOCELLA VIET NAM'
      WHERE id = 1
    `;
    await pool.query(defaultSql);

    const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    res.json({
      success: true,
      message: 'Đã khôi phục cài đặt mặc định thành công',
      data: formatSettings(rows[0])
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi khôi phục cài đặt', error: error.message });
  }
};
