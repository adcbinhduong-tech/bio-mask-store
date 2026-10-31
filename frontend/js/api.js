/**
 * BIOCELLA - Centralized API Service Client
 * Kết nối REST API Node.js / Express với cơ sở dữ liệu MySQL (Port 5000)
 * Tự động chuyển đổi sang LocalStorage nếu Backend chưa được bật
 */

const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT_MS: 3000
};

class BiocellaAPI {
  constructor() {
    this.isBackendOnline = false;
    this.hasCheckedHealth = false;
  }

  // Kiểm tra trạng thái máy chủ Backend & MySQL
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

      const res = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isBackendOnline = data.database?.status === 'connected';
        this.hasCheckedHealth = true;
        return { online: true, dbStatus: data.database?.status, info: data };
      }
    } catch (e) {
      // Backend offline
    }
    this.isBackendOnline = false;
    this.hasCheckedHealth = true;
    return { online: false, dbStatus: 'disconnected' };
  }

  // =========================================================================
  // 1. SẢN PHẨM (PRODUCTS)
  // =========================================================================

  async getProducts(params = {}) {
    const health = await this.checkHealth();
    if (health.online && this.isBackendOnline) {
      try {
        const query = new URLSearchParams(params).toString();
        const url = `${API_CONFIG.BASE_URL}/products${query ? '?' + query : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Sync into localStorage cache
          localStorage.setItem('biocella_products', JSON.stringify(data.data));
          return data.data;
        }
      } catch (err) {
        console.warn('Fallback to localStorage for products:', err);
      }
    }

    // LocalStorage Fallback
    const raw = localStorage.getItem('biocella_products');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const fallback = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
    localStorage.setItem('biocella_products', JSON.stringify(fallback));
    return fallback;
  }

  async getProductById(id) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`);
        const data = await res.json();
        if (data.success) return data.data;
      } catch (err) {}
    }
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  async createProduct(productData) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (data.success) {
          await this.getProducts(); // refresh cache
          return data.data;
        }
      } catch (err) {
        console.error('Error creating product in BE:', err);
      }
    }

    // Offline create
    const products = await this.getProducts();
    const newProd = {
      ...productData,
      id: productData.id || 'bio-' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0
    };
    products.unshift(newProd);
    localStorage.setItem('biocella_products', JSON.stringify(products));
    return newProd;
  }

  async updateProduct(id, productData) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (data.success) {
          await this.getProducts(); // refresh cache
          return data.data;
        }
      } catch (err) {
        console.error('Error updating product in BE:', err);
      }
    }

    // Offline update
    const products = await this.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...productData };
      localStorage.setItem('biocella_products', JSON.stringify(products));
      return products[idx];
    }
    return null;
  }

  async deleteProduct(id) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          await this.getProducts();
          return true;
        }
      } catch (err) {
        console.error('Error deleting product in BE:', err);
      }
    }

    // Offline delete
    let products = await this.getProducts();
    products = products.filter((p) => p.id !== id);
    localStorage.setItem('biocella_products', JSON.stringify(products));
    return true;
  }

  // =========================================================================
  // 2. ĐƠN HÀNG (ORDERS) & THỐNG KÊ (KPIs)
  // =========================================================================

  async getOrders(params = {}) {
    await this.checkHealth();
    if (this.isBackendOnline) {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_CONFIG.BASE_URL}/orders${query ? '?' + query : ''}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          localStorage.setItem('biocella_orders', JSON.stringify(data.data));
          return data.data;
        }
      } catch (err) {
        console.warn('Fallback to localStorage for orders:', err);
      }
    }

    const raw = localStorage.getItem('biocella_orders');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return [];
  }

  async getOrderKPIs() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/orders/stats`);
        const data = await res.json();
        if (data.success) return data.data;
      } catch (err) {}
    }

    // Offline KPI calculation
    const orders = await this.getOrders();
    const products = await this.getProducts();
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingCount: orders.filter((o) => o.status === 'pending').length,
      shippingCount: orders.filter((o) => o.status === 'shipping').length,
      completedCount: orders.filter((o) => o.status === 'completed').length,
      cancelledCount: orders.filter((o) => o.status === 'cancelled').length,
      totalProducts: products.length,
      recentOrders: orders.slice(0, 5)
    };
  }

  async createOrder(orderData) {
    let createdOrder = null;
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (data.success) {
          createdOrder = data.data;
        }
      } catch (err) {
        console.error('Error creating order in BE:', err);
      }
    }

    if (!createdOrder) {
      createdOrder = {
        ...orderData,
        id: orderData.id || 'BC-' + Math.floor(100000 + Math.random() * 900000),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }

    // Always update local storage
    try {
      const stored = JSON.parse(localStorage.getItem('biocella_orders') || '[]');
      stored.unshift(createdOrder);
      localStorage.setItem('biocella_orders', JSON.stringify(stored));
    } catch (e) {}

    return createdOrder;
  }

  async updateOrderStatus(id, status) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/orders/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) {
          await this.getOrders(); // refresh cache
          return data.data;
        }
      } catch (err) {
        console.error('Error updating order status in BE:', err);
      }
    }

    // Offline update
    const orders = await this.getOrders();
    const target = orders.find((o) => o.id === id);
    if (target) {
      target.status = status;
      localStorage.setItem('biocella_orders', JSON.stringify(orders));
      return target;
    }
    return null;
  }

  // =========================================================================
  // 3. MÃ KHUYẾN MÃI (VOUCHERS)
  // =========================================================================

  async getVouchers() {
    await this.checkHealth();
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/vouchers`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          localStorage.setItem('biocella_vouchers', JSON.stringify(data.data));
          return data.data;
        }
      } catch (err) {}
    }

    const raw = localStorage.getItem('biocella_vouchers');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return [];
  }

  async validateVoucher(code, subtotal) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/vouchers/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, subtotal })
        });
        const data = await res.json();
        return data;
      } catch (err) {}
    }

    // Offline validation
    const vouchers = await this.getVouchers();
    const cleanCode = code.trim().toUpperCase();
    const v = vouchers.find((item) => item.code.toUpperCase() === cleanCode);
    if (!v) {
      return { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' };
    }
    if (v.minOrder && subtotal < v.minOrder) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(v.minOrder)}đ để áp dụng`
      };
    }
    let discountAmount = 0;
    if (v.type === 'percent') {
      discountAmount = Math.round((subtotal * v.value) / 100);
    } else {
      discountAmount = v.value;
    }
    return {
      success: true,
      message: `Đã áp dụng mã: ${v.label || v.code}`,
      data: { ...v, discountAmount }
    };
  }

  async createVoucher(voucherData) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/vouchers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(voucherData)
        });
        const data = await res.json();
        if (data.success) {
          await this.getVouchers();
          return data.data;
        }
      } catch (err) {}
    }

    const vouchers = await this.getVouchers();
    vouchers.unshift(voucherData);
    localStorage.setItem('biocella_vouchers', JSON.stringify(vouchers));
    return voucherData;
  }

  async deleteVoucher(code) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/vouchers/${code}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          await this.getVouchers();
          return true;
        }
      } catch (err) {}
    }

    let vouchers = await this.getVouchers();
    vouchers = vouchers.filter((v) => v.code !== code);
    localStorage.setItem('biocella_vouchers', JSON.stringify(vouchers));
    return true;
  }

  // =========================================================================
  // 4. CÀI ĐẶT NỘI DUNG WEBSITE (SITE SETTINGS)
  // =========================================================================

  async getSettings() {
    await this.checkHealth();
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/settings`);
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('biocella_site_settings', JSON.stringify(data.data));
          return data.data;
        }
      } catch (err) {}
    }

    const raw = localStorage.getItem('biocella_site_settings');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }

    const defaultSettings = {
      brandName: 'BIOCELLA',
      brandSlogan: 'BIO-CELLULOSE LAB',
      announcementText: '🎁 ƯU ĐÃI THÁNG MỚI: Nhập mã BIOCELLA10 giảm ngay 10% đơn đầu tiên',
      shippingNotice: '🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 350.000đ',
      freeShippingThreshold: 350000,
      hotline: '1900 6828',
      heroTitle: 'Đánh Thức Làn Da Tái Sinh Cùng Mặt Nạ Men Dừa Chuẩn Y Khoa',
      heroDesc: 'Dệt từ 100% nước dừa tươi Bến Tre lên men tự nhiên. Màng sợi sinh học Bio-Cellulose nano 20nm ôm khít như làn da thứ hai, đưa dưỡng chất thẩm thấu sâu gấp 20 lần mặt nạ giấy thông thường.',
      bankId: 'MB',
      bankAccount: '0988776655',
      bankOwner: 'CONG TY BIOCELLA VIET NAM'
    };
    return defaultSettings;
  }

  async updateSettings(settingsData) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsData)
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('biocella_site_settings', JSON.stringify(data.data));
          return data.data;
        }
      } catch (err) {}
    }

    localStorage.setItem('biocella_site_settings', JSON.stringify(settingsData));
    return settingsData;
  }

  async resetSettings() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/settings/reset`, {
          method: 'POST'
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('biocella_site_settings', JSON.stringify(data.data));
          return data.data;
        }
      } catch (err) {}
    }
    localStorage.removeItem('biocella_site_settings');
    return this.getSettings();
  }

  // =========================================================================
  // 5. XÁC THỰC QUẢN TRỊ (AUTH)
  // =========================================================================

  async login(username, password) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        return await res.json();
      } catch (err) {}
    }

    // Offline auth fallback
    if (
      (username.toLowerCase() === 'admin' || username.toLowerCase() === 'admin@biocella.vn') &&
      password === 'admin123'
    ) {
      return {
        success: true,
        message: 'Đăng nhập thành công (Chế độ Local/Offline)',
        data: {
          token: 'offline_token_' + Date.now(),
          user: { id: 1, username: 'admin', fullName: 'Quản Trị Viên' }
        }
      };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' };
  }

  // =========================================================================
  // 6. UI BADGE HIỂN THỊ KẾT NỐI DATABASE
  // =========================================================================

  renderStatusBadge(containerSelector = 'body') {
    const existing = document.getElementById('biocella-db-status-badge');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.id = 'biocella-db-status-badge';
    badge.style.position = 'fixed';
    badge.style.bottom = '16px';
    badge.style.right = '16px';
    badge.style.zIndex = '99999';
    badge.style.fontSize = '12px';
    badge.style.padding = '6px 14px';
    badge.style.borderRadius = '9999px';
    badge.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.gap = '8px';
    badge.style.fontWeight = '600';
    badge.style.transition = 'all 0.3s ease';
    badge.style.cursor = 'pointer';

    if (this.isBackendOnline) {
      badge.style.backgroundColor = '#0d4a3e';
      badge.style.color = '#ffffff';
      badge.style.border = '1px solid #2ec4b6';
      badge.innerHTML = `
        <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; animation: pulse 2s infinite;"></span>
        <span>MySQL Backend: Online (Port 5000)</span>
      `;
      badge.title = 'Đang đồng bộ trực tiếp với MySQL Database qua Express Backend';
    } else {
      badge.style.backgroundColor = '#1f2937';
      badge.style.color = '#fef08a';
      badge.style.border = '1px solid #ca8a04';
      badge.innerHTML = `
        <span style="width: 8px; height: 8px; background: #eab308; border-radius: 50%;"></span>
        <span>Database: LocalStorage (Offline Mode)</span>
      `;
      badge.title = 'Chưa bật Node.js Backend. Click để xem hướng dẫn bật MySQL.';
    }

    badge.addEventListener('click', () => {
      if (!this.isBackendOnline) {
        alert(
          '💡 Để kết nối MySQL Server:\n1. Mở XAMPP/Laragon và bấm Start MySQL\n2. Mở terminal thư mục backend và chạy: npm start\n3. Refresh lại trang web này!'
        );
      } else {
        alert('✅ Hệ thống đang kết nối trực tiếp với Cơ Sở Dữ Liệu MySQL [biocella_db] trên cổng 5000!');
      }
    });

    const target = document.querySelector(containerSelector) || document.body;
    target.appendChild(badge);
  }
}

// Global API instance
window.biocellaAPI = new BiocellaAPI();
