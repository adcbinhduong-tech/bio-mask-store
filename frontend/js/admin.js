/**
 * BIOCELLA - Admin Portal Logic
 * Quản lý Sản phẩm (CRUD), Đơn hàng, Voucher & Cài đặt Nội dung Website
 */

document.addEventListener("DOMContentLoaded", () => {
  // State from LocalStorage
  let products = getStoredProducts();
  let orders = getStoredOrders();
  let settings = getStoredSettings();
  let vouchers = getStoredVouchers();

  let editingProductId = null;

  // Format currency VND
  function formatMoney(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace("₫", "đ");
  }

  // Toast Notification
  function showAdminToast(message, type = "success") {
    const container = document.getElementById("admin-toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-in`;
    toast.style.background = "white";
    toast.style.padding = "0.75rem 1.25rem";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
    toast.style.borderLeft = type === "success" ? "4px solid #10b981" : "4px solid #ef4444";
    toast.style.marginBottom = "0.5rem";
    toast.style.fontSize = "0.875rem";
    toast.style.fontWeight = "600";
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Storage Helpers
  function getStoredProducts() {
    const raw = localStorage.getItem("biocella_products");
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch (e) {}
    }
    // Fallback to initial PRODUCTS if products.js is loaded
    const fallback = typeof PRODUCTS !== "undefined" ? PRODUCTS : [];
    localStorage.setItem("biocella_products", JSON.stringify(fallback));
    return fallback;
  }

  function getStoredOrders() {
    const raw = localStorage.getItem("biocella_orders");
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch (e) {}
    }
    // Initial demo orders
    const initialOrders = [
      {
        id: "BC-839210",
        createdAt: "2026-10-02T14:25:00.000Z",
        customerName: "Nguyễn Thị Ngọc Mai",
        customerPhone: "0982345678",
        customerCity: "Hà Nội",
        customerAddress: "Số 45 Tràng Tiền, Hoàn Kiếm",
        customerNote: "Giao trong giờ hành chính giúp mình",
        paymentMethod: "vietqr",
        status: "completed",
        items: [
          { id: "bio-combo-discovery", name: "Hộp Quà Cao Cấp Combo 10 Miếng BIOCELLA", price: 590000, quantity: 1 }
        ],
        subtotal: 590000,
        discount: 59000,
        shippingFee: 0,
        totalAmount: 531000
      },
      {
        id: "BC-718293",
        createdAt: "2026-10-03T09:12:00.000Z",
        customerName: "Trần Minh Quân",
        customerPhone: "0918765432",
        customerCity: "Đà Nẵng",
        customerAddress: "K120/15 Lê Duẩn, Hải Châu",
        customerNote: "Gọi trước khi giao 15p",
        paymentMethod: "cod",
        status: "shipping",
        items: [
          { id: "bio-b5-hydra", name: "Mặt Nạ Sinh Học B5 & Hyaluronic Cấp Ẩm", price: 65000, quantity: 4 },
          { id: "bio-cica-acne", name: "Mặt Nạ Sinh Học Rau Má Centella Giảm Mụn", price: 62000, quantity: 2 }
        ],
        subtotal: 384000,
        discount: 0,
        shippingFee: 0,
        totalAmount: 384000
      },
      {
        id: "BC-629104",
        createdAt: "2026-10-03T11:40:00.000Z",
        customerName: "Phạm Thu Hương",
        customerPhone: "0934567890",
        customerCity: "TP. Hồ Chí Minh",
        customerAddress: "28/4 Thảo Điền, Quận 2",
        customerNote: "",
        paymentMethod: "vietqr",
        status: "pending",
        items: [
          { id: "bio-glow-niacinamide", name: "Mặt Nạ Sinh Học Niacinamide 10% & Arbutin Trắng Hồng", price: 69000, quantity: 3 }
        ],
        subtotal: 207000,
        discount: 0,
        shippingFee: 30000,
        totalAmount: 237000
      }
    ];
    localStorage.setItem("biocella_orders", JSON.stringify(initialOrders));
    return initialOrders;
  }

  function getStoredSettings() {
    const raw = localStorage.getItem("biocella_site_settings");
    const defaultSettings = {
      brandName: "BIOCELLA",
      brandSlogan: "BIO-CELLULOSE LAB",
      announcementText: "🎁 ƯU ĐÃI THÁNG MỚI: Nhập mã BIOCELLA10 giảm ngay 10% đơn đầu tiên",
      shippingNotice: "🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 350.000đ",
      freeShippingThreshold: 350000,
      hotline: "1900 6828",
      heroTitle: "Đánh Thức Làn Da Tái Sinh Cùng Mặt Nạ Men Dừa Chuẩn Y Khoa",
      heroDesc: "Dệt từ 100% nước dừa tươi Bến Tre lên men tự nhiên. Màng sợi sinh học Bio-Cellulose nano 20nm ôm khít như làn da thứ hai, đưa dưỡng chất thẩm thấu sâu gấp 20 lần mặt nạ giấy thông thường.",
      bankId: "MB",
      bankAccount: "0988776655",
      bankOwner: "CONG TY BIOCELLA VIET NAM"
    };

    if (raw) {
      try {
        return { ...defaultSettings, ...JSON.parse(raw) };
      } catch (e) {}
    }
    localStorage.setItem("biocella_site_settings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  function getStoredVouchers() {
    const raw = localStorage.getItem("biocella_vouchers");
    const defaultVouchers = [
      { code: "BIOCELLA10", type: "percent", value: 10, label: "Giảm 10% tổng đơn", minOrder: 0 },
      { code: "FREESHIP", type: "fixed", value: 30000, label: "Trợ giá ship 30.000đ", minOrder: 0 },
      { code: "SKINTEST15", type: "percent", value: 15, label: "Quà tặng Trắc Nghiệm Da - Giảm 15%", minOrder: 0 },
      { code: "SPA50K", type: "fixed", value: 50000, minOrder: 300000, label: "Giảm 50.000đ cho đơn từ 300k" }
    ];

    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch (e) {}
    }
    localStorage.setItem("biocella_vouchers", JSON.stringify(defaultVouchers));
    return defaultVouchers;
  }

  // Tab Navigation Handling
  const navItems = document.querySelectorAll(".admin-nav-item");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");
  const pageTitleEl = document.getElementById("admin-page-title");
  const pageSubtitleEl = document.getElementById("admin-page-subtitle");

  const TAB_METAS = {
    overview: { title: "Tổng Quan Kinh Doanh", sub: "Thống kê doanh số, đơn hàng và tỷ lệ chuyển đổi" },
    products: { title: "Quản Lý Danh Mục Mặt Nạ", sub: "Thêm mới, sửa giá bán, hoạt chất và tồn kho sản phẩm" },
    orders: { title: "Quản Lý Đơn Đặt Hàng", sub: "Theo dõi trạng thái đơn hàng COD & Chuyển khoản VietQR" },
    vouchers: { title: "Chương Trình Khuyến Mãi & Voucher", sub: "Tạo mã giảm giá theo phần trăm hoặc số tiền cố định" },
    settings: { title: "Cài Đặt Nội Dung Website", sub: "Tùy biến tiêu đề banner, tài khoản VietQR và ngưỡng miễn phí vận chuyển" }
  };

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      navItems.forEach((b) => b.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) targetPane.classList.add("active");

      if (TAB_METAS[targetTab]) {
        pageTitleEl.textContent = TAB_METAS[targetTab].title;
        pageSubtitleEl.textContent = TAB_METAS[targetTab].sub;
      }
    });
  });

  // Calculate & Render KPIs
  function renderKPIs() {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
    const completedOrdersCount = orders.filter((o) => o.status === "completed").length;

    document.getElementById("kpi-revenue").textContent = formatMoney(totalRevenue);
    document.getElementById("kpi-orders-count").textContent = orders.length;
    document.getElementById("kpi-products-count").textContent = products.length;
    document.getElementById("kpi-pending-count").textContent = `${pendingOrdersCount} đơn chờ`;

    // Overview Table (Top 5 Recent Orders)
    const recentOrdersTable = document.getElementById("overview-recent-orders");
    if (recentOrdersTable) {
      const recent = [...orders].slice(0, 5);
      recentOrdersTable.innerHTML = recent
        .map(
          (o) => `
        <tr>
          <td><strong>#${o.id}</strong></td>
          <td>${o.customerName}<br><small class="text-gray-500">${o.customerPhone}</small></td>
          <td>${o.items.length} món</td>
          <td><strong>${formatMoney(o.totalAmount)}</strong></td>
          <td><span class="badge-status ${o.status}">${getStatusLabel(o.status)}</span></td>
          <td>${new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
        </tr>
      `
        )
        .join("");
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "pending":
        return "⏳ Chờ xác nhận";
      case "shipping":
        return "🚚 Đang giao hàng";
      case "completed":
        return "✓ Đã hoàn thành";
      case "cancelled":
        return "✕ Đã hủy";
      default:
        return status;
    }
  }

  // Render Products Table
  function renderProductsTable() {
    const tableBody = document.getElementById("admin-products-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td>
          <div class="product-row-info">
            <img src="${p.image}" alt="${p.name}" class="product-thumb" />
            <div>
              <div class="product-title-bold">${p.name}</div>
              <div class="product-category-text">${p.subtitle || ""} • ${p.volume || "28ml"}</div>
            </div>
          </div>
        </td>
        <td><span class="badge-status completed">${getCategoryLabel(p.category)}</span></td>
        <td>
          <strong>${formatMoney(p.price)}</strong>
          ${p.originalPrice > p.price ? `<br><small class="text-gray-400 line-through">${formatMoney(p.originalPrice)}</small>` : ""}
        </td>
        <td>⭐ ${p.rating || 5.0} (${p.reviewCount || 0})</td>
        <td><strong>${p.soldCount || 0}</strong> đã bán</td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon edit-product-btn" data-id="${p.id}" title="Chỉnh sửa sản phẩm">
              ✏️
            </button>
            <button class="btn-icon danger delete-product-btn" data-id="${p.id}" title="Xóa sản phẩm">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");

    // Attach Edit & Delete Listeners
    tableBody.querySelectorAll(".edit-product-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openEditProductModal(id);
      });
    });

    tableBody.querySelectorAll(".delete-product-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        handleDeleteProduct(id);
      });
    });
  }

  function getCategoryLabel(cat) {
    const map = {
      recovery: "💧 Cấp ẩm phục hồi",
      brightening: "✨ Trắng sáng mờ thâm",
      acne: "🌿 Giảm mụn kiềm dầu",
      "anti-aging": "👑 Trẻ hóa nâng cơ",
      combo: "🎁 Combo hộp quà"
    };
    return map[cat] || cat;
  }

  // Render Orders Table
  function renderOrdersTable() {
    const tableBody = document.getElementById("admin-orders-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = orders
      .map(
        (o) => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>
          <strong>${o.customerName}</strong><br>
          <small class="text-gray-500">${o.customerPhone} • ${o.customerCity}</small>
        </td>
        <td>
          <div class="text-xs space-y-1">
            ${o.items.map((i) => `<div>• ${i.name} (x${i.quantity})</div>`).join("")}
          </div>
        </td>
        <td>
          <strong>${formatMoney(o.totalAmount)}</strong><br>
          <small class="text-gray-500">${o.paymentMethod === "vietqr" ? "Chuyển khoản QR" : "Thanh toán COD"}</small>
        </td>
        <td>
          <select class="custom-select order-status-select" data-id="${o.id}" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700;">
            <option value="pending" ${o.status === "pending" ? "selected" : ""}>⏳ Chờ xác nhận</option>
            <option value="shipping" ${o.status === "shipping" ? "selected" : ""}>🚚 Đang giao hàng</option>
            <option value="completed" ${o.status === "completed" ? "selected" : ""}>✓ Đã hoàn thành</option>
            <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>✕ Đã hủy</option>
          </select>
        </td>
        <td>${new Date(o.createdAt).toLocaleString("vi-VN")}</td>
        <td>
          <button class="admin-btn admin-btn-outline admin-btn-sm view-order-detail-btn" data-id="${o.id}">
            Chi tiết
          </button>
        </td>
      </tr>
    `
      )
      .join("");

    // Attach Status Change Listener
    tableBody.querySelectorAll(".order-status-select").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const id = select.getAttribute("data-id");
        const newStatus = e.target.value;
        const ord = orders.find((o) => o.id === id);
        if (ord) {
          ord.status = newStatus;
          if (window.biocellaAPI) {
            await window.biocellaAPI.updateOrderStatus(id, newStatus);
          }
          localStorage.setItem("biocella_orders", JSON.stringify(orders));
          renderKPIs();
          showAdminToast(`Đã cập nhật trạng thái đơn #${id} thành "${getStatusLabel(newStatus)}"`);
        }
      });
    });

    // Attach View Detail Listener
    tableBody.querySelectorAll(".view-order-detail-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openOrderDetailModal(id);
      });
    });
  }

  // Render Vouchers Table
  function renderVouchersTable() {
    const tableBody = document.getElementById("admin-vouchers-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = vouchers
      .map(
        (v, idx) => `
      <tr>
        <td><strong class="font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded">${v.code}</strong></td>
        <td>${v.label}</td>
        <td><strong>${v.type === "percent" ? `Giảm ${v.value}%` : `Giảm ${formatMoney(v.value)}`}</strong></td>
        <td>${v.minOrder > 0 ? `Đơn từ ${formatMoney(v.minOrder)}` : "Mọi đơn hàng"}</td>
        <td>
          <button class="btn-icon danger delete-voucher-btn" data-index="${idx}" title="Xóa mã">
            🗑️
          </button>
        </td>
      </tr>
    `
      )
      .join("");

    tableBody.querySelectorAll(".delete-voucher-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idx = parseInt(btn.getAttribute("data-index"));
        const targetVoucher = vouchers[idx];
        if (targetVoucher && window.biocellaAPI) {
          await window.biocellaAPI.deleteVoucher(targetVoucher.code);
        }
        vouchers.splice(idx, 1);
        localStorage.setItem("biocella_vouchers", JSON.stringify(vouchers));
        renderVouchersTable();
        showAdminToast("Đã xóa mã voucher thành công");
      });
    });
  }

  // Product Modal (Add / Edit)
  const productModal = document.getElementById("product-modal");
  const productModalOverlay = document.getElementById("product-modal-overlay");
  const productForm = document.getElementById("product-form");
  const addProductBtn = document.getElementById("add-product-btn");

  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      editingProductId = null;
      document.getElementById("product-modal-title").textContent = "Thêm Mặt Nạ Mới";
      productForm.reset();
      document.getElementById("form-img-preview").src = "https://images.unsplash.com/photo-1608248597359-5f21297b4ec0?auto=format&fit=crop&w=800&q=80";
      productModal.classList.add("open");
      productModalOverlay.classList.add("open");
    });
  }

  function openEditProductModal(id) {
    const p = products.find((item) => item.id === id);
    if (!p) return;

    editingProductId = p.id;
    document.getElementById("product-modal-title").textContent = "Chỉnh Sửa Mặt Nạ Sinh Học";

    document.getElementById("prod-name").value = p.name;
    document.getElementById("prod-subtitle").value = p.subtitle || "";
    document.getElementById("prod-category").value = p.category || "recovery";
    document.getElementById("prod-price").value = p.price;
    document.getElementById("prod-original-price").value = p.originalPrice || p.price;
    document.getElementById("prod-badge").value = p.badge || "";
    document.getElementById("prod-volume").value = p.volume || "28ml";
    document.getElementById("prod-image").value = p.image;
    document.getElementById("prod-desc").value = p.description || "";
    
    // Ingredients text format
    const ingText = p.keyIngredients ? p.keyIngredients.map((ing) => `${ing.name}: ${ing.role}`).join("\n") : "";
    document.getElementById("prod-ingredients").value = ingText;

    document.getElementById("form-img-preview").src = p.image;

    productModal.classList.add("open");
    productModalOverlay.classList.add("open");
  }

  function closeProductModal() {
    productModal.classList.remove("open");
    productModalOverlay.classList.remove("open");
  }

  document.querySelectorAll(".close-product-modal-btn").forEach((btn) => {
    btn.addEventListener("click", closeProductModal);
  });

  // Image URL input live preview
  const prodImgInput = document.getElementById("prod-image");
  if (prodImgInput) {
    prodImgInput.addEventListener("input", (e) => {
      const url = e.target.value.trim();
      if (url) {
        document.getElementById("form-img-preview").src = url;
      }
    });
  }

  // Handle Product Form Submit
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("prod-name").value.trim();
      const subtitle = document.getElementById("prod-subtitle").value.trim();
      const category = document.getElementById("prod-category").value;
      const price = parseInt(document.getElementById("prod-price").value) || 0;
      const originalPrice = parseInt(document.getElementById("prod-original-price").value) || price;
      const badge = document.getElementById("prod-badge").value.trim();
      const volume = document.getElementById("prod-volume").value.trim();
      const image = document.getElementById("prod-image").value.trim();
      const description = document.getElementById("prod-desc").value.trim();
      const ingRaw = document.getElementById("prod-ingredients").value.trim();

      const keyIngredients = ingRaw
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .map((line) => {
          const parts = line.split(":");
          return {
            name: parts[0]?.trim() || "Hoạt chất",
            role: parts[1]?.trim() || "Tái tạo & phục hồi"
          };
        });

      if (editingProductId) {
        // Update existing
        const pIndex = products.findIndex((p) => p.id === editingProductId);
        if (pIndex !== -1) {
          const updatePayload = {
            name,
            subtitle,
            category,
            price,
            originalPrice,
            badge,
            volume,
            image,
            description,
            keyIngredients: keyIngredients.length > 0 ? keyIngredients : products[pIndex].keyIngredients
          };
          products[pIndex] = {
            ...products[pIndex],
            ...updatePayload
          };
          if (window.biocellaAPI) {
            window.biocellaAPI.updateProduct(editingProductId, updatePayload).catch(console.error);
          }
          showAdminToast("Đã cập nhật sản phẩm thành công!");
        }
      } else {
        // Create new
        const newId = "bio-" + Date.now();
        const newProduct = {
          id: newId,
          name,
          subtitle,
          category,
          skinTypes: ["all"],
          price,
          originalPrice,
          rating: 5.0,
          reviewCount: 0,
          soldCount: 0,
          badge: badge || "Mới Ra Mắt",
          isBestSeller: false,
          image: image || "https://images.unsplash.com/photo-1608248597359-5f21297b4ec0?auto=format&fit=crop&w=800&q=80",
          description,
          keyIngredients: keyIngredients.length > 0 ? keyIngredients : [{ name: "Nước dừa tươi lên men", role: "Màng sinh học nano" }],
          features: ["Màng cellulose nano siêu mỏng 20nm", "Thẩm thấu gấp 20 lần"],
          usage: ["Bước 1: Rửa mặt", "Bước 2: Gỡ lớp màng 1", "Bước 3: Đắp và thư giãn 30p"],
          volume: volume || "28ml",
          origin: "Công nghệ sinh học Bio-Cellulose chuẩn cGMP"
        };
        products.unshift(newProduct);
        if (window.biocellaAPI) {
          window.biocellaAPI.createProduct(newProduct).catch(console.error);
        }
        showAdminToast("Đã thêm sản phẩm mặt nạ mới thành công!");
      }

      localStorage.setItem("biocella_products", JSON.stringify(products));
      renderProductsTable();
      renderKPIs();
      closeProductModal();
    });
  }

  async function handleDeleteProduct(id) {
    const p = products.find((item) => item.id === id);
    if (!p) return;

    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" không?`)) {
      if (window.biocellaAPI) {
        await window.biocellaAPI.deleteProduct(id);
      }
      products = products.filter((item) => item.id !== id);
      localStorage.setItem("biocella_products", JSON.stringify(products));
      renderProductsTable();
      renderKPIs();
      showAdminToast("Đã xóa sản phẩm thành công");
    }
  }

  // Order Details Modal
  const orderDetailModal = document.getElementById("order-detail-modal");
  const orderDetailOverlay = document.getElementById("order-detail-overlay");

  function openOrderDetailModal(id) {
    const ord = orders.find((o) => o.id === id);
    if (!ord) return;

    const modalBody = document.getElementById("order-detail-body");
    modalBody.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-gray-200">
          <div>
            <h4 class="text-xl font-bold">Đơn hàng #${ord.id}</h4>
            <p class="text-xs text-gray-500">Thời gian tạo: ${new Date(ord.createdAt).toLocaleString("vi-VN")}</p>
          </div>
          <span class="badge-status ${ord.status}">${getStatusLabel(ord.status)}</span>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
          <div>
            <div class="text-gray-500 text-xs">Người nhận:</div>
            <div class="font-bold text-gray-800">${ord.customerName}</div>
            <div class="text-gray-600">${ord.customerPhone}</div>
          </div>
          <div>
            <div class="text-gray-500 text-xs">Địa chỉ giao:</div>
            <div class="font-medium text-gray-800">${ord.customerAddress}, ${ord.customerCity}</div>
            ${ord.customerNote ? `<div class="text-xs text-amber-700 mt-1">Ghi chú: ${ord.customerNote}</div>` : ""}
          </div>
        </div>

        <div>
          <h5 class="font-bold text-sm mb-2">Danh sách mặt nạ đặt mua:</h5>
          <div class="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden text-sm">
            ${ord.items
              .map(
                (item) => `
              <div class="p-3 flex justify-between items-center">
                <div>
                  <div class="font-semibold text-gray-800">${item.name}</div>
                  <div class="text-xs text-gray-500">Số lượng: ${item.quantity} x ${formatMoney(item.price)}</div>
                </div>
                <div class="font-bold">${formatMoney(item.price * item.quantity)}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="pt-2 space-y-1 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Tạm tính:</span>
            <span>${formatMoney(ord.subtotal || ord.totalAmount)}</span>
          </div>
          ${
            ord.discount > 0
              ? `
            <div class="flex justify-between text-emerald-600 font-medium">
              <span>Giảm giá voucher:</span>
              <span>-${formatMoney(ord.discount)}</span>
            </div>
          `
              : ""
          }
          <div class="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span>${ord.shippingFee === 0 ? "MIỄN PHÍ" : formatMoney(ord.shippingFee || 30000)}</span>
          </div>
          <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Tổng thanh toán:</span>
            <span class="text-emerald-700 text-lg">${formatMoney(ord.totalAmount)}</span>
          </div>
        </div>
      </div>
    `;

    orderDetailModal.classList.add("open");
    orderDetailOverlay.classList.add("open");
  }

  function closeOrderDetailModal() {
    orderDetailModal.classList.remove("open");
    orderDetailOverlay.classList.remove("open");
  }

  document.querySelectorAll(".close-order-modal-btn").forEach((btn) => {
    btn.addEventListener("click", closeOrderDetailModal);
  });

  // Settings Form Handling
  const settingsForm = document.getElementById("site-settings-form");
  if (settingsForm) {
    // Populate form with current settings
    document.getElementById("set-announcement").value = settings.announcementText || "";
    document.getElementById("set-shipping-notice").value = settings.shippingNotice || "";
    document.getElementById("set-freeship-threshold").value = settings.freeShippingThreshold || 350000;
    document.getElementById("set-hotline").value = settings.hotline || "1900 6828";
    document.getElementById("set-hero-title").value = settings.heroTitle || "";
    document.getElementById("set-hero-desc").value = settings.heroDesc || "";
    document.getElementById("set-bank-id").value = settings.bankId || "MB";
    document.getElementById("set-bank-account").value = settings.bankAccount || "0988776655";
    document.getElementById("set-bank-owner").value = settings.bankOwner || "CONG TY BIOCELLA VIET NAM";

    settingsForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      settings = {
        ...settings,
        announcementText: document.getElementById("set-announcement").value.trim(),
        shippingNotice: document.getElementById("set-shipping-notice").value.trim(),
        freeShippingThreshold: parseInt(document.getElementById("set-freeship-threshold").value) || 350000,
        hotline: document.getElementById("set-hotline").value.trim(),
        heroTitle: document.getElementById("set-hero-title").value.trim(),
        heroDesc: document.getElementById("set-hero-desc").value.trim(),
        bankId: document.getElementById("set-bank-id").value.trim().toUpperCase(),
        bankAccount: document.getElementById("set-bank-account").value.trim(),
        bankOwner: document.getElementById("set-bank-owner").value.trim()
      };

      if (window.biocellaAPI) {
        await window.biocellaAPI.updateSettings(settings);
      }
      localStorage.setItem("biocella_site_settings", JSON.stringify(settings));
      showAdminToast("Đã lưu các thay đổi nội dung website thành công! Các nội dung trên trang bán hàng đã được cập nhật.");
    });
  }

  // Voucher Add Form
  const addVoucherForm = document.getElementById("add-voucher-form");
  if (addVoucherForm) {
    addVoucherForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const code = document.getElementById("vouch-code").value.trim().toUpperCase();
      const label = document.getElementById("vouch-label").value.trim();
      const type = document.getElementById("vouch-type").value;
      const value = parseInt(document.getElementById("vouch-val").value) || 0;
      const minOrder = parseInt(document.getElementById("vouch-min").value) || 0;

      if (!code || !label || value <= 0) {
        showAdminToast("Vui lòng điền đầy đủ thông tin voucher", "danger");
        return;
      }

      if (vouchers.some((v) => v.code === code)) {
        showAdminToast("Mã voucher này đã tồn tại", "danger");
        return;
      }

      const newVoucher = { code, label, type, value, minOrder };
      if (window.biocellaAPI) {
        await window.biocellaAPI.createVoucher(newVoucher);
      }
      vouchers.push(newVoucher);
      localStorage.setItem("biocella_vouchers", JSON.stringify(vouchers));
      renderVouchersTable();
      addVoucherForm.reset();
      showAdminToast(`Đã thêm mã ưu đãi ${code} thành công!`);
    });
  }

  // Reset to Factory Default Data
  const resetDataBtn = document.getElementById("reset-all-data-btn");
  if (resetDataBtn) {
    resetDataBtn.addEventListener("click", async () => {
      if (confirm("Bạn có chắc chắn muốn khôi phục lại toàn bộ dữ liệu gốc mẫu (sản phẩm, đơn hàng, cài đặt)?")) {
        if (window.biocellaAPI) {
          await window.biocellaAPI.resetSettings();
        }
        localStorage.removeItem("biocella_products");
        localStorage.removeItem("biocella_orders");
        localStorage.removeItem("biocella_site_settings");
        localStorage.removeItem("biocella_vouchers");
        location.reload();
      }
    });
  }

  // Authentication Logic
  const loginOverlay = document.getElementById("admin-login-overlay");
  const loginForm = document.getElementById("admin-login-form");
  const loginErrorMsg = document.getElementById("login-error-msg");
  const quickFillBtn = document.getElementById("quick-fill-login-btn");
  const logoutBtn = document.getElementById("admin-logout-btn");

  function checkAuthStatus() {
    if (!loginOverlay) return;
    const isAuth = sessionStorage.getItem("biocella_admin_auth") === "true";
    if (isAuth) {
      loginOverlay.classList.add("hidden");
    } else {
      loginOverlay.classList.remove("hidden");
    }
  }

  if (quickFillBtn) {
    quickFillBtn.addEventListener("click", () => {
      document.getElementById("login-username").value = "admin";
      document.getElementById("login-password").value = "admin123";
      if (loginErrorMsg) loginErrorMsg.style.display = "none";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const u = document.getElementById("login-username").value.trim().toLowerCase();
      const p = document.getElementById("login-password").value.trim();

      if (window.biocellaAPI) {
        const res = await window.biocellaAPI.login(u, p);
        if (res.success) {
          sessionStorage.setItem("biocella_admin_auth", "true");
          loginOverlay.classList.add("hidden");
          if (loginErrorMsg) loginErrorMsg.style.display = "none";
          showAdminToast("Đăng nhập thành công! Chào mừng Quản trị viên BIOCELLA.");
          syncAdminDataWithBackend();
          return;
        }
      }

      // Check credentials fallback
      if ((u === "admin" || u === "admin@biocella.vn") && p === "admin123") {
        sessionStorage.setItem("biocella_admin_auth", "true");
        loginOverlay.classList.add("hidden");
        if (loginErrorMsg) loginErrorMsg.style.display = "none";
        showAdminToast("Đăng nhập thành công! Chào mừng Quản trị viên BIOCELLA.");
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = "✕ Tên đăng nhập hoặc mật khẩu không đúng! Hãy kiểm tra thông tin mẫu ở trên.";
          loginErrorMsg.style.display = "block";
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("biocella_admin_auth");
      loginOverlay.classList.remove("hidden");
      showAdminToast("Bạn đã đăng xuất khỏi phiên làm việc an toàn.", "info");
    });
  }

  // Backend Sync
  async function syncAdminDataWithBackend() {
    if (window.biocellaAPI) {
      const health = await window.biocellaAPI.checkHealth();
      window.biocellaAPI.renderStatusBadge();

      if (health.online) {
        try {
          const liveProds = await window.biocellaAPI.getProducts();
          if (Array.isArray(liveProds)) products = liveProds;

          const liveOrders = await window.biocellaAPI.getOrders();
          if (Array.isArray(liveOrders)) orders = liveOrders;

          const liveVouchers = await window.biocellaAPI.getVouchers();
          if (Array.isArray(liveVouchers)) vouchers = liveVouchers;

          const liveSettings = await window.biocellaAPI.getSettings();
          if (liveSettings) settings = liveSettings;

          renderKPIs();
          renderProductsTable();
          renderOrdersTable();
          renderVouchersTable();
          populateSettingsForm();
        } catch (err) {
          console.warn("Admin BE sync notice:", err);
        }
      }
    }
  }

  checkAuthStatus();

  // Initial renders
  renderKPIs();
  renderProductsTable();
  renderOrdersTable();
  renderVouchersTable();
  syncAdminDataWithBackend();
});
