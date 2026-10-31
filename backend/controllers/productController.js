const { pool } = require('../config/db');

// Helper to format DB product row into Frontend model format
function formatProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || '',
    category: row.category,
    skinTypes: typeof row.skin_types === 'string' ? JSON.parse(row.skin_types || '[]') : (row.skin_types || []),
    price: Number(row.price),
    originalPrice: Number(row.original_price || row.price),
    rating: parseFloat(row.rating) || 5.0,
    reviewCount: Number(row.review_count || 0),
    soldCount: Number(row.sold_count || 0),
    badge: row.badge || '',
    isBestSeller: Boolean(row.is_bestseller),
    image: row.image || '',
    description: row.description || '',
    keyIngredients: typeof row.key_ingredients === 'string' ? JSON.parse(row.key_ingredients || '[]') : (row.key_ingredients || []),
    features: typeof row.features === 'string' ? JSON.parse(row.features || '[]') : (row.features || []),
    usage: typeof row.usage_steps === 'string' ? JSON.parse(row.usage_steps || '[]') : (row.usage_steps || []),
    volume: row.volume || '28ml / 1 miếng',
    origin: row.origin || 'Công nghệ sinh học Bio-Cellulose chuẩn cGMP',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, skinType, search } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ' AND (name LIKE ? OR subtitle LIKE ? OR description LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    let products = rows.map(formatProduct);

    if (skinType && skinType !== 'all') {
      products = products.filter((p) => Array.isArray(p.skinTypes) && p.skinTypes.includes(skinType));
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sản phẩm', error: error.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({
      success: true,
      data: formatProduct(rows[0])
    });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const p = req.body;
    if (!p.name || !p.price) {
      return res.status(400).json({ success: false, message: 'Tên và giá sản phẩm là bắt buộc' });
    }

    const id = p.id || 'bio-' + Date.now();
    const sql = `
      INSERT INTO products (
        id, name, subtitle, category, skin_types, price, original_price,
        rating, review_count, sold_count, badge, is_bestseller, image,
        description, key_ingredients, features, usage_steps, volume, origin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      p.name,
      p.subtitle || '',
      p.category || 'recovery',
      JSON.stringify(p.skinTypes || ['normal']),
      p.price,
      p.originalPrice || p.price,
      p.rating || 5.0,
      p.reviewCount || 0,
      p.soldCount || 0,
      p.badge || '',
      p.isBestSeller ? 1 : 0,
      p.image || 'https://images.unsplash.com/photo-1608248597359-5f21297b4ec0?auto=format&fit=crop&w=800&q=80',
      p.description || '',
      JSON.stringify(p.keyIngredients || []),
      JSON.stringify(p.features || []),
      JSON.stringify(p.usage || []),
      p.volume || '28ml / 1 miếng',
      p.origin || 'Công nghệ sinh học Bio-Cellulose chuẩn cGMP'
    ];

    await pool.query(sql, params);

    const [newRow] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công',
      data: formatProduct(newRow[0])
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi thêm sản phẩm', error: error.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để cập nhật' });
    }

    const sql = `
      UPDATE products SET
        name = ?, subtitle = ?, category = ?, skin_types = ?,
        price = ?, original_price = ?, badge = ?, is_bestseller = ?,
        image = ?, description = ?, key_ingredients = ?, features = ?,
        usage_steps = ?, volume = ?, origin = ?
      WHERE id = ?
    `;

    const params = [
      p.name !== undefined ? p.name : existing[0].name,
      p.subtitle !== undefined ? p.subtitle : existing[0].subtitle,
      p.category !== undefined ? p.category : existing[0].category,
      JSON.stringify(p.skinTypes !== undefined ? p.skinTypes : (typeof existing[0].skin_types === 'string' ? JSON.parse(existing[0].skin_types) : existing[0].skin_types)),
      p.price !== undefined ? p.price : existing[0].price,
      p.originalPrice !== undefined ? p.originalPrice : existing[0].original_price,
      p.badge !== undefined ? p.badge : existing[0].badge,
      p.isBestSeller !== undefined ? (p.isBestSeller ? 1 : 0) : existing[0].is_bestseller,
      p.image !== undefined ? p.image : existing[0].image,
      p.description !== undefined ? p.description : existing[0].description,
      JSON.stringify(p.keyIngredients !== undefined ? p.keyIngredients : (typeof existing[0].key_ingredients === 'string' ? JSON.parse(existing[0].key_ingredients) : existing[0].key_ingredients)),
      JSON.stringify(p.features !== undefined ? p.features : (typeof existing[0].features === 'string' ? JSON.parse(existing[0].features) : existing[0].features)),
      JSON.stringify(p.usage !== undefined ? p.usage : (typeof existing[0].usage_steps === 'string' ? JSON.parse(existing[0].usage_steps) : existing[0].usage_steps)),
      p.volume !== undefined ? p.volume : existing[0].volume,
      p.origin !== undefined ? p.origin : existing[0].origin,
      id
    ];

    await pool.query(sql, params);

    const [updatedRow] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: formatProduct(updatedRow[0])
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm', error: error.message });
  }
};
