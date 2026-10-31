const { pool } = require('../config/db');

function formatOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerCity: row.customer_city,
    customerAddress: row.customer_address,
    customerNote: row.customer_note || '',
    paymentMethod: row.payment_method || 'cod',
    status: row.status || 'pending',
    subtotal: Number(row.subtotal),
    discount: Number(row.discount || 0),
    shippingFee: Number(row.shipping_fee || 0),
    totalAmount: Number(row.total_amount),
    items: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : (row.items || []),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    const orders = rows.map(formatOrder);

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách đơn hàng', error: error.message });
  }
};

// GET /api/orders/stats (KPI metrics)
exports.getOrderStats = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    const orders = rows.map(formatOrder);

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const shippingCount = orders.filter((o) => o.status === 'shipping').length;
    const completedCount = orders.filter((o) => o.status === 'completed').length;
    const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

    const [productCountRow] = await pool.query('SELECT COUNT(*) as count FROM products');
    const totalProducts = productCountRow[0]?.count || 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        pendingCount,
        shippingCount,
        completedCount,
        cancelledCount,
        totalProducts,
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thống kê KPI', error: error.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    res.json({
      success: true,
      data: formatOrder(rows[0])
    });
  } catch (error) {
    console.error('Error fetching order by id:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
  }
};

// POST /api/orders (Tạo đơn hàng từ khách hàng)
exports.createOrder = async (req, res) => {
  try {
    const o = req.body;
    if (!o.customerName || !o.customerPhone || !o.customerAddress) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ họ tên, SĐT và địa chỉ nhận hàng' });
    }

    const orderId = o.id || 'BC-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = Number(o.subtotal || 0);
    const discount = Number(o.discount || 0);
    const shippingFee = Number(o.shippingFee || 0);
    const totalAmount = Number(o.totalAmount || Math.max(0, subtotal - discount + shippingFee));

    const sql = `
      INSERT INTO orders (
        id, customer_name, customer_phone, customer_city, customer_address,
        customer_note, payment_method, status, subtotal, discount,
        shipping_fee, total_amount, items, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const params = [
      orderId,
      o.customerName,
      o.customerPhone,
      o.customerCity || 'Việt Nam',
      o.customerAddress,
      o.customerNote || '',
      o.paymentMethod || 'cod',
      o.status || 'pending',
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      JSON.stringify(o.items || [])
    ];

    await pool.query(sql, params);

    const [newOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: formatOrder(newOrder[0])
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
};

// PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Cho phép: ${validStatuses.join(', ')}`
      });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng để cập nhật' });
    }

    const [updatedRow] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Đã đổi trạng thái đơn sang: ${status}`,
      data: formatOrder(updatedRow[0])
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái đơn', error: error.message });
  }
};
