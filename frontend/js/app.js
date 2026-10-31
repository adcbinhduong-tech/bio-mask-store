/**
 * BIOCELLA - Core Application Logic
 * Quản lý Giỏ hàng, Bộ lọc sản phẩm, Modal Chi tiết, Skin Quiz, Thanh toán VietQR & Hiệu ứng
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentCategory = "all";
  let currentSkinFilter = "all";
  let currentSort = "popular";
  let searchQuery = "";
  let appliedVoucher = null;
  let activeQuizStep = 0;
  let quizAnswers = {};

  // Initialize or fetch Products from localStorage
  function getLiveProducts() {
    const raw = localStorage.getItem("biocella_products");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { }
    }
    localStorage.setItem("biocella_products", JSON.stringify(PRODUCTS));
    return PRODUCTS;
  }

  // Initialize or fetch Settings from localStorage
  function getLiveSettings() {
    const defaultSettings = {
      brandName: "BIOCELLA",
      brandSlogan: "BIO-CELLULOSE LAB",
      announcementText: "🎁 ƯU ĐÃI THÁNG MỚI: Nhập mã BIOCELLA10 giảm ngay 10% đơn đầu tiên",
      shippingNotice: "🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 350.000đ",
      freeShippingThreshold: 300000,
      hotline: "1900 6828",
      heroTitle: "Đánh Thức Làn Da Tái Sinh Cùng Mặt Nạ Men Dừa Chuẩn Y Khoa",
      heroDesc: "Dệt từ 100% nước dừa tươi Bến Tre lên men tự nhiên. Màng sợi sinh học Bio-Cellulose nano 20nm ôm khít như làn da thứ hai, đưa dưỡng chất thẩm thấu sâu gấp 20 lần mặt nạ giấy thông thường.",
      bankId: "MB",
      bankAccount: "0865870879",
      bankOwner: "CONG TY BIOCELLA VIET NAM"
    };

    const raw = localStorage.getItem("biocella_site_settings");
    if (raw) {
      try {
        return { ...defaultSettings, ...JSON.parse(raw) };
      } catch (e) { }
    }
    localStorage.setItem("biocella_site_settings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  // Initialize or fetch Vouchers from localStorage
  function getLiveVouchers() {
    const defaultVouchers = {
      BIOCELLA10: { code: "BIOCELLA10", type: "percent", value: 10, label: "Giảm 10% tổng đơn", minOrder: 0 },
      FREESHIP: { code: "FREESHIP", type: "fixed", value: 30000, label: "Trợ giá ship 30.000đ", minOrder: 0 },
      SKINTEST15: { code: "SKINTEST15", type: "percent", value: 15, label: "Quà tặng Trắc Nghiệm Da - Giảm 15%", minOrder: 0 },
      SPA50K: { code: "SPA50K", type: "fixed", value: 50000, minOrder: 300000, label: "Giảm 50.000đ cho đơn từ 300k" }
    };

    const raw = localStorage.getItem("biocella_vouchers");
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const map = {};
          arr.forEach((v) => { map[v.code] = v; });
          return map;
        }
      } catch (e) { }
    }
    localStorage.setItem("biocella_vouchers", JSON.stringify(Object.values(defaultVouchers)));
    return defaultVouchers;
  }

  const currentProducts = getLiveProducts();
  const currentSettings = getLiveSettings();
  let VOUCHERS = getLiveVouchers();

  // Apply Site Settings to DOM if elements exist
  function applyLiveSettingsToUI() {
    const announcementEl = document.querySelector(".announcement-bar");
    if (announcementEl) {
      announcementEl.innerHTML = `
        <div>${currentSettings.announcementText}</div>
        <div>${currentSettings.shippingNotice}</div>
      `;
    }

    const heroTitleEl = document.querySelector(".hero-title");
    if (heroTitleEl && currentSettings.heroTitle) {
      heroTitleEl.innerHTML = currentSettings.heroTitle.includes("Mặt Nạ Men Dừa")
        ? currentSettings.heroTitle.replace("Mặt Nạ Men Dừa", "<em>Mặt Nạ Men Dừa</em>")
        : currentSettings.heroTitle;
    }

    const heroDescEl = document.querySelector(".hero-desc");
    if (heroDescEl && currentSettings.heroDesc) {
      heroDescEl.textContent = currentSettings.heroDesc;
    }
  }

  applyLiveSettingsToUI();

  // Async sync with MySQL Backend
  async function syncWithBackend() {
    if (window.biocellaAPI) {
      const health = await window.biocellaAPI.checkHealth();
      window.biocellaAPI.renderStatusBadge();

      if (health.online) {
        try {
          const liveProds = await window.biocellaAPI.getProducts();
          if (Array.isArray(liveProds) && liveProds.length > 0) {
            currentProducts = liveProds;
            renderProducts();
          }

          const liveSettings = await window.biocellaAPI.getSettings();
          if (liveSettings) {
            Object.assign(currentSettings, liveSettings);
            applyLiveSettingsToUI();
          }

          const liveVouchers = await window.biocellaAPI.getVouchers();
          if (Array.isArray(liveVouchers) && liveVouchers.length > 0) {
            const map = {};
            liveVouchers.forEach((v) => { map[v.code] = v; });
            VOUCHERS = map;
          }
        } catch (err) {
          console.warn("Backend sync notice:", err);
        }
      }
    }
  }
  syncWithBackend();

  // Cart State (Persisted in localStorage)
  let cart = JSON.parse(localStorage.getItem("biocella_cart_items") || "[]");

  // DOM Elements
  const productsGrid = document.getElementById("products-grid");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartToggleBtn = document.getElementById("cart-toggle-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartBadge = document.getElementById("cart-badge");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartDiscountEl = document.getElementById("cart-discount");
  const cartTotalEl = document.getElementById("cart-total");
  const cartShippingNotice = document.getElementById("cart-shipping-notice");
  const shippingProgressBar = document.getElementById("shipping-progress-bar");
  const emptyCartState = document.getElementById("empty-cart-state");
  const cartFooter = document.getElementById("cart-footer");


  // Filter Buttons
  const filterBtns = document.querySelectorAll(".category-btn");
  const skinFilterSelect = document.getElementById("skin-filter-select");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("product-search-input");

  // Modals
  const quickViewModal = document.getElementById("quickview-modal");
  const checkoutModal = document.getElementById("checkout-modal");
  const quizModal = document.getElementById("quiz-modal");
  const modalOverlay = document.getElementById("modal-overlay");

  // Format currency VND
  function formatMoney(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace("₫", "đ");
  }

  // Toast Notification
  function showToast(title, message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-in`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
    } else if (type === "warning") {
      iconSvg = `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    } else {
      iconSvg = `<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-body">
        <h4 class="toast-title">${title}</h4>
        <p class="toast-desc">${message}</p>
      </div>
      <button class="toast-close" aria-label="Đóng">&times;</button>
    `;

    container.appendChild(toast);

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add("toast-fade-out");
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  // Save Cart to LocalStorage
  function saveCart() {
    localStorage.setItem("biocella_cart_items", JSON.stringify(cart));
    updateCartUI();
  }

  // Update Cart UI
  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? "flex" : "none";
      cartBadge.classList.add("badge-pulse");
      setTimeout(() => cartBadge.classList.remove("badge-pulse"), 500);
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      emptyCartState.style.display = "block";
      cartItemsList.innerHTML = "";
      cartFooter.style.display = "none";
      if (cartShippingNotice) cartShippingNotice.style.display = "none";
      return;
    }

    emptyCartState.style.display = "none";
    cartFooter.style.display = "block";
    if (cartShippingNotice) cartShippingNotice.style.display = "block";

    let subtotal = 0;
    cartItemsList.innerHTML = cart
      .map((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.name}</h4>
              <p class="cart-item-volume">${item.volume || "28ml"}</p>
              <div class="cart-item-price">${formatMoney(item.price)}</div>
              <div class="cart-item-actions">
                <div class="qty-control">
                  <button class="qty-btn dec-qty" data-id="${item.id}" aria-label="Giảm số lượng">-</button>
                  <span class="qty-num">${item.quantity}</span>
                  <button class="qty-btn inc-qty" data-id="${item.id}" aria-label="Tăng số lượng">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" title="Xóa khỏi giỏ">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // Calculate Discounts & Shipping
    let discountAmount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.type === "percent") {
        discountAmount = Math.round((subtotal * appliedVoucher.value) / 100);
      } else if (appliedVoucher.type === "fixed") {
        discountAmount = appliedVoucher.value;
      }
    }

    const freeShippingThreshold = 350000;
    const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    if (shippingProgressBar) {
      shippingProgressBar.style.width = `${progress}%`;
    }

    const freeShipText = document.getElementById("shipping-text");
    if (freeShipText) {
      if (subtotal >= freeShippingThreshold) {
        freeShipText.innerHTML = `🎉 <strong>Chúc mừng!</strong> Đơn hàng của bạn đã đủ điều kiện <strong>MIỄN PHÍ VẬN CHUYỂN</strong>`;
        freeShipText.classList.add("text-success");
      } else {
        const remaining = freeShippingThreshold - subtotal;
        freeShipText.innerHTML = `Mua thêm <strong>${formatMoney(remaining)}</strong> để được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>`;
        freeShipText.classList.remove("text-success");
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(subtotal);
    if (cartDiscountEl) cartDiscountEl.textContent = discountAmount > 0 ? `-${formatMoney(discountAmount)}` : "0đ";
    if (cartTotalEl) cartTotalEl.textContent = formatMoney(finalTotal);

    // Attach event listeners for quantity buttons
    cartItemsList.querySelectorAll(".inc-qty").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        changeQuantity(id, 1);
      });
    });

    cartItemsList.querySelectorAll(".dec-qty").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        changeQuantity(id, -1);
      });
    });

    cartItemsList.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        removeFromCart(id);
      });
    });
  }

  function addToCart(productId, quantity = 1, showDrawer = true) {
    const product = currentProducts.find((p) => p.id === productId);
    if (!product) return;

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        volume: product.volume,
        quantity: quantity
      });
    }

    saveCart();
    showToast("Thêm vào giỏ hàng thành công!", `${product.name} (x${quantity})`);

    if (showDrawer) {
      openCart();
    }
  }

  function changeQuantity(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== productId);
    }
    saveCart();
  }

  function removeFromCart(productId) {
    const item = cart.find((i) => i.id === productId);
    cart = cart.filter((i) => i.id !== productId);
    saveCart();
    if (item) {
      showToast("Đã xóa khỏi giỏ", item.name, "info");
    }
  }

  function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  const applyVoucherBtn = document.getElementById("apply-voucher-btn");
  const voucherInput = document.getElementById("voucher-input");
  const voucherMsg = document.getElementById("voucher-msg");

  if (applyVoucherBtn && voucherInput) {
    applyVoucherBtn.addEventListener("click", async () => {
      const code = voucherInput.value.trim().toUpperCase();
      if (!code) {
        showToast("Lỗi", "Vui lòng nhập mã ưu đãi", "warning");
        return;
      }

      const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

      if (window.biocellaAPI) {
        const result = await window.biocellaAPI.validateVoucher(code, subtotal);
        if (result.success && result.data) {
          const v = result.data;
          appliedVoucher = { code: v.code, type: v.type, value: v.value, label: v.label || v.code };
          if (voucherMsg) {
            voucherMsg.textContent = `✓ Đã áp dụng: ${appliedVoucher.label}`;
            voucherMsg.className = "text-success font-semibold text-xs mt-1 block";
          }
          showToast("Áp mã thành công!", `Bạn được ${appliedVoucher.label}`);
          updateCartUI();
          return;
        } else {
          showToast("Chưa hợp lệ", result.message || "Mã không hợp lệ", "warning");
          if (voucherMsg) {
            voucherMsg.textContent = `✕ ${result.message || "Mã ưu đãi không hợp lệ"}`;
            voucherMsg.className = "text-danger font-semibold text-xs mt-1 block";
          }
          return;
        }
      }

      // Offline fallback
      if (VOUCHERS[code]) {
        const v = VOUCHERS[code];
        if (v.minOrder && subtotal < v.minOrder) {
          showToast("Chưa đủ điều kiện", `Mã này áp dụng cho đơn từ ${formatMoney(v.minOrder)}`, "warning");
          return;
        }

        appliedVoucher = { code, ...v };
        if (voucherMsg) {
          voucherMsg.textContent = `✓ Đã áp dụng: ${v.label}`;
          voucherMsg.className = "text-success font-semibold text-xs mt-1 block";
        }
        showToast("Áp mã thành công!", `Bạn được ${v.label}`);
        updateCartUI();
      } else {
        showToast("Mã không hợp lệ", "Mã giảm giá không tồn tại hoặc đã hết hạn", "warning");
        if (voucherMsg) {
          voucherMsg.textContent = "✕ Mã ưu đãi không hợp lệ";
          voucherMsg.className = "text-danger font-semibold text-xs mt-1 block";
        }
      }
    });
  }

  // Render Product Cards
  function renderProducts() {
    let filtered = [...currentProducts];

    // Filter by Category
    if (currentCategory !== "all") {
      filtered = filtered.filter((p) => p.category === currentCategory);
    }

    // Filter by Skin Type
    if (currentSkinFilter !== "all") {
      filtered = filtered.filter((p) => p.skinTypes.includes(currentSkinFilter) || p.skinTypes.includes("all"));
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.keyIngredients.some((ing) => ing.name.toLowerCase().includes(q))
      );
    }

    // Sort
    if (currentSort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === "best-seller") {
      filtered.sort((a, b) => b.soldCount - a.soldCount);
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 text-emerald-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm phù hợp</h3>
          <p class="text-gray-500 mb-6">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc da hiện tại.</p>
          <button id="reset-filters-btn" class="btn btn-outline">Xem tất cả sản phẩm</button>
        </div>
      `;
      document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
        currentCategory = "all";
        currentSkinFilter = "all";
        searchQuery = "";
        if (searchInput) searchInput.value = "";
        filterBtns.forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));
        if (skinFilterSelect) skinFilterSelect.value = "all";
        renderProducts();
      });
      return;
    }

    productsGrid.innerHTML = filtered
      .map((p) => {
        const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        return `
          <div class="product-card group" data-id="${p.id}">
            <div class="product-img-wrapper">
              ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
              <span class="discount-tag">-${discountPercent}%</span>
              <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
              <div class="product-overlay-actions">
                <button class="quick-view-btn" data-id="${p.id}" title="Xem chi tiết nhanh">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Xem Nhanh</span>
                </button>
              </div>
            </div>
            
            <div class="product-info">
              <div class="product-rating-row">
                <div class="stars">
                  ${"★".repeat(Math.floor(p.rating))}${"☆".repeat(5 - Math.floor(p.rating))}
                </div>
                <span class="rating-text">${p.rating} (${p.reviewCount})</span>
                <span class="sold-text">Đã bán ${p.soldCount > 1000 ? (p.soldCount / 1000).toFixed(1) + "k" : p.soldCount}</span>
              </div>

              <h3 class="product-title" title="${p.name}">${p.name}</h3>
              <p class="product-subtitle">${p.subtitle}</p>

              <div class="product-highlight-tags">
                ${p.keyIngredients.slice(0, 2).map((ing) => `<span class="tag-pill">${ing.name.split(" ")[0]} ${ing.name.split(" ")[1] || ""}</span>`).join("")}
              </div>

              <div class="product-price-row">
                <div class="price-box">
                  <span class="sale-price">${formatMoney(p.price)}</span>
                  <span class="original-price">${formatMoney(p.originalPrice)}</span>
                </div>
                <button class="add-to-cart-btn" data-id="${p.id}" aria-label="Thêm vào giỏ">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // Attach listeners
    productsGrid.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        addToCart(id, 1, true);
      });
    });

    productsGrid.querySelectorAll(".quick-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        openQuickView(id);
      });
    });

    productsGrid.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        openQuickView(id);
      });
    });
  }

  // Quick View Modal
  function openQuickView(productId) {
    const p = currentProducts.find((item) => item.id === productId);
    if (!p) return;

    const modalBody = document.getElementById("quickview-body");
    const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

    modalBody.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-gallery">
          <div class="quickview-main-img-wrapper">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
            <img src="${p.image}" alt="${p.name}" class="quickview-main-img" />
          </div>
          <div class="bio-tech-banner">
            <div class="bio-icon">🧬</div>
            <div>
              <strong>100% Nước dừa Bến Tre lên men</strong>
              <p>Màng sinh học nano siêu thẩm thấu gấp 20 lần</p>
            </div>
          </div>
        </div>

        <div class="quickview-content">
          <div class="quickview-header">
            <span class="quickview-vol">${p.volume} • ${p.origin}</span>
            <h2 class="quickview-title">${p.name}</h2>
            <p class="quickview-subtitle">${p.subtitle}</p>
            
            <div class="quickview-rating-row">
              <div class="stars">${"★".repeat(Math.floor(p.rating))}</div>
              <span class="font-bold">${p.rating} / 5.0</span>
              <span class="text-gray-400">|</span>
              <span>${p.reviewCount} đánh giá kiểm chứng</span>
              <span class="text-gray-400">|</span>
              <span class="text-emerald-700 font-medium">✓ Đã bán ${p.soldCount} miếng</span>
            </div>

            <div class="quickview-price-box">
              <span class="quickview-sale-price">${formatMoney(p.price)}</span>
              <span class="quickview-original-price">${formatMoney(p.originalPrice)}</span>
              <span class="quickview-discount-tag">Tiết kiệm ${discountPercent}%</span>
            </div>
          </div>

          <div class="quickview-desc">
            <p>${p.description}</p>
          </div>

          <!-- Thành phần then chốt -->
          <div class="quickview-section">
            <h4 class="section-micro-title">Thành Phần Vàng Hoạt Tính:</h4>
            <div class="ingredients-list">
              ${p.keyIngredients
        .map(
          (ing) => `
                <div class="ingredient-item">
                  <div class="ing-bullet"></div>
                  <div>
                    <strong class="ing-name">${ing.name}:</strong>
                    <span class="ing-role">${ing.role}</span>
                  </div>
                </div>
              `
        )
        .join("")}
            </div>
          </div>

          <!-- Đặc điểm vượt trội -->
          <div class="quickview-section">
            <h4 class="section-micro-title">Ưu Điểm Vượt Trội Công Nghệ Bio-Cellulose:</h4>
            <ul class="features-list">
              ${p.features.map((f) => `<li><span class="check-icon">✓</span> ${f}</li>`).join("")}
            </ul>
          </div>

          <!-- Hướng dẫn sử dụng -->
          <div class="quickview-section">
            <h4 class="section-micro-title">Hướng Dẫn Liệu Trình 4 Bước:</h4>
            <div class="usage-steps-mini">
              ${p.usage
        .map(
          (step) => `
                <div class="step-card">
                  <p>${step}</p>
                </div>
              `
        )
        .join("")}
            </div>
          </div>

          <!-- Bộ chọn số lượng & Thêm vào giỏ -->
          <div class="quickview-actions">
            <div class="qty-selector">
              <button id="modal-dec-qty" class="qty-btn" aria-label="Giảm">-</button>
              <input type="number" id="modal-qty-input" value="1" min="1" max="99" aria-label="Số lượng" />
              <button id="modal-inc-qty" class="qty-btn" aria-label="Tăng">+</button>
            </div>
            <button id="modal-add-cart-btn" class="btn btn-primary flex-1 py-3" data-id="${p.id}">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Thêm Vào Giỏ Hàng</span>
            </button>
          </div>

          <div class="quickview-guarantee">
            <div class="guar-item"><span>🔒</span> 100% Chính hãng BIOCELLA</div>
            <div class="guar-item"><span>🚚</span> Giao nhanh 24h & Đồng kiểm</div>
            <div class="guar-item"><span>🌿</span> Hoàn tiền 200% nếu kích ứng</div>
          </div>
        </div>
      </div>
    `;

    // Modal Qty Logic
    const qtyInput = document.getElementById("modal-qty-input");
    document.getElementById("modal-dec-qty").addEventListener("click", () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    document.getElementById("modal-inc-qty").addEventListener("click", () => {
      let val = parseInt(qtyInput.value) || 1;
      qtyInput.value = val + 1;
    });

    document.getElementById("modal-add-cart-btn").addEventListener("click", () => {
      const q = parseInt(qtyInput.value) || 1;
      addToCart(p.id, q, true);
      closeAllModals();
    });

    quickViewModal.classList.add("open");
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  // Close All Modals
  function closeAllModals() {
    quickViewModal.classList.remove("open");
    checkoutModal.classList.remove("open");
    quizModal.classList.remove("open");
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Event Listeners for Filters
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      renderProducts();
    });
  });

  if (skinFilterSelect) {
    skinFilterSelect.addEventListener("change", (e) => {
      currentSkinFilter = e.target.value;
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Cart Drawer open/close
  if (cartToggleBtn) cartToggleBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  if (modalOverlay) modalOverlay.addEventListener("click", closeAllModals);

  document.querySelectorAll(".modal-close-btn").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  // Checkout Button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Giỏ hàng trống", "Vui lòng chọn ít nhất 1 sản phẩm", "warning");
        return;
      }
      closeCart();
      openCheckoutModal();
    });
  }

  // Checkout Modal logic
  function openCheckoutModal() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    let discount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.type === "percent") {
        discount = Math.round((subtotal * appliedVoucher.value) / 100);
      } else if (appliedVoucher.type === "fixed") {
        discount = appliedVoucher.value;
      }
    }
    const shipping = subtotal >= 350000 ? 0 : 30000;
    const finalAmount = Math.max(0, subtotal - discount + shipping);

    const orderSummaryContainer = document.getElementById("checkout-order-summary");
    if (orderSummaryContainer) {
      orderSummaryContainer.innerHTML = `
        <div class="checkout-items-preview">
          ${cart
          .map(
            (item) => `
            <div class="flex items-center justify-between py-2 border-b border-gray-100 text-sm">
              <div class="flex items-center space-x-3">
                <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded-lg" />
                <div>
                  <div class="font-medium text-gray-800 line-clamp-1">${item.name}</div>
                  <div class="text-xs text-gray-500">Số lượng: ${item.quantity}</div>
                </div>
              </div>
              <div class="font-semibold text-gray-800">${formatMoney(item.price * item.quantity)}</div>
            </div>
          `
          )
          .join("")}
        </div>
        <div class="pt-3 space-y-1 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Tạm tính:</span>
            <span>${formatMoney(subtotal)}</span>
          </div>
          ${discount > 0
          ? `
            <div class="flex justify-between text-emerald-600 font-medium">
              <span>Ưu đãi (${appliedVoucher ? appliedVoucher.code : ""}):</span>
              <span>-${formatMoney(discount)}</span>
            </div>
          `
          : ""
        }
          <div class="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span>${shipping === 0 ? '<strong class="text-emerald-600">MIỄN PHÍ</strong>' : formatMoney(shipping)}</span>
          </div>
          <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Tổng thanh toán:</span>
            <span class="text-emerald-700 text-lg">${formatMoney(finalAmount)}</span>
          </div>
        </div>
      `;
    }

    // Payment method tabs
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    const vietqrBox = document.getElementById("vietqr-container");

    paymentMethods.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.value === "vietqr" && input.checked) {
          vietqrBox.style.display = "block";
          renderVietQR(finalAmount);
        } else {
          vietqrBox.style.display = "none";
        }
      });
    });

    checkoutModal.classList.add("open");
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function renderVietQR(amount) {
    const qrImg = document.getElementById("vietqr-image");
    const transferContentEl = document.getElementById("transfer-content");
    const orderCode = "BC" + Math.floor(100000 + Math.random() * 900000);

    if (transferContentEl) {
      transferContentEl.textContent = `BIOCELLA ${orderCode}`;
    }

    // Dynamic VietQR Quicklink API with live settings
    const bankId = currentSettings.bankId || "MB";
    const accountNo = currentSettings.bankAccount || "0988776655";
    const template = "compact2";
    const desc = encodeURIComponent(`BIOCELLA ${orderCode}`);
    const accountName = encodeURIComponent(currentSettings.bankOwner || "CONG TY BIOCELLA VIET NAM");
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${desc}&accountName=${accountName}`;

    if (qrImg) {
      qrImg.src = qrUrl;
    }
  }

  // Handle Checkout Form Submission
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("checkout-name").value.trim();
      const phone = document.getElementById("checkout-phone").value.trim();
      const address = document.getElementById("checkout-address").value.trim();
      const city = document.getElementById("checkout-city").value.trim();

      if (!name || !phone || !address || !city) {
        showToast("Thiếu thông tin", "Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ", "warning");
        return;
      }

      // Create Success View
      const orderId = "BC-" + Math.floor(100000 + Math.random() * 900000);
      const checkoutContent = document.getElementById("checkout-content-area");

      checkoutContent.innerHTML = `
        <div class="text-center py-8">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">ĐẶT HÀNG THÀNH CÔNG!</h2>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            Cảm ơn bạn <strong class="text-gray-900">${name}</strong>! BIOCELLA đã tiếp nhận đơn hàng 
            <span class="inline-block bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-1 rounded">#${orderId}</span>.
            Chuyên viên tư vấn sẽ liên hệ xác nhận qua số <strong class="text-gray-900">${phone}</strong> trong vòng 15 phút.
          </p>

          <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-md mx-auto text-left mb-6 text-sm">
            <div class="flex justify-between py-1 border-b border-gray-200">
              <span class="text-gray-500">Mã đơn hàng:</span>
              <span class="font-bold text-gray-800">#${orderId}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-200">
              <span class="text-gray-500">Địa chỉ giao:</span>
              <span class="font-medium text-gray-800 text-right">${address}, ${city}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-200">
              <span class="text-gray-500">Thời gian giao dự kiến:</span>
              <span class="font-medium text-emerald-700">1 - 2 ngày làm việc</span>
            </div>
            <div class="flex justify-between py-1 pt-2">
              <span class="text-gray-700 font-bold">Chính sách:</span>
              <span class="text-gray-600">Đồng kiểm khi nhận, đổi trả 7 ngày</span>
            </div>
          </div>

          <div class="flex justify-center space-x-4">
            <button id="order-complete-close" class="btn btn-primary px-8">Tiếp Tục Mua Sắm</button>
          </div>
        </div>
      `;

      // Save Order into biocella_orders for Admin Dashboard
      const paymentMethodVal = document.querySelector('input[name="payment_method"]:checked')?.value || "cod";
      const subtotalVal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
      let discountVal = 0;
      if (appliedVoucher) {
        if (appliedVoucher.type === "percent") {
          discountVal = Math.round((subtotalVal * appliedVoucher.value) / 100);
        } else if (appliedVoucher.type === "fixed") {
          discountVal = appliedVoucher.value;
        }
      }
      const shippingVal = subtotalVal >= (currentSettings.freeShippingThreshold || 350000) ? 0 : 30000;
      const finalAmountVal = Math.max(0, subtotalVal - discountVal + shippingVal);

      const newOrder = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customerName: name,
        customerPhone: phone,
        customerCity: city,
        customerAddress: address,
        customerNote: document.getElementById("checkout-note")?.value.trim() || "",
        paymentMethod: paymentMethodVal,
        status: "pending",
        items: [...cart],
        subtotal: subtotalVal,
        discount: discountVal,
        shippingFee: shippingVal,
        totalAmount: finalAmountVal
      };

      if (window.biocellaAPI) {
        window.biocellaAPI.createOrder(newOrder).catch((err) => console.error("Could not sync order to BE:", err));
      } else {
        try {
          const storedOrders = JSON.parse(localStorage.getItem("biocella_orders") || "[]");
          storedOrders.unshift(newOrder);
          localStorage.setItem("biocella_orders", JSON.stringify(storedOrders));
        } catch (err) {
          console.error("Could not save order", err);
        }
      }

      // Clear Cart
      cart = [];
      appliedVoucher = null;
      saveCart();

      showToast("Đơn hàng đã ghi nhận!", `Mã đơn hàng #${orderId}`, "success");

      document.getElementById("order-complete-close").addEventListener("click", () => {
        closeAllModals();
        setTimeout(() => location.reload(), 300);
      });
    });
  }

  // Skin Diagnostic Quiz Logic
  const startQuizBtns = document.querySelectorAll(".start-quiz-btn");
  if (startQuizBtns) {
    startQuizBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeQuizStep = 0;
        quizAnswers = {};
        renderQuizStep();
        quizModal.classList.add("open");
        modalOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
  }

  function renderQuizStep() {
    const quizBody = document.getElementById("quiz-step-content");
    if (!quizBody) return;

    if (activeQuizStep < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[activeQuizStep];
      const progressPercent = Math.round(((activeQuizStep + 1) / QUIZ_QUESTIONS.length) * 100);

      quizBody.innerHTML = `
        <div class="quiz-step-box">
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mb-4 mt-2">
            <span>Câu hỏi ${activeQuizStep + 1} / ${QUIZ_QUESTIONS.length}</span>
            <span>${progressPercent}% hoàn thành</span>
          </div>

          <h3 class="quiz-question-title">${q.question}</h3>

          <div class="quiz-options-list">
            ${q.options
          .map(
            (opt, idx) => `
              <button class="quiz-option-btn" data-target="${opt.target || ""}" data-combo="${opt.comboPreference || ""}">
                <span class="option-idx">${String.fromCharCode(65 + idx)}</span>
                <span class="option-text">${opt.text}</span>
              </button>
            `
          )
          .join("")}
          </div>
        </div>
      `;

      quizBody.querySelectorAll(".quiz-option-btn").forEach((optBtn) => {
        optBtn.addEventListener("click", () => {
          const target = optBtn.getAttribute("data-target");
          const combo = optBtn.getAttribute("data-combo");

          if (target) quizAnswers[`step_${activeQuizStep}`] = target;
          if (combo) quizAnswers.combo = combo;

          activeQuizStep++;
          renderQuizStep();
        });
      });
    } else {
      // Calculate Recommendation Result
      renderQuizResult();
    }
  }

  function renderQuizResult() {
    const quizBody = document.getElementById("quiz-step-content");
    const skinIssue = quizAnswers.step_0 || "dry";
    const goal = quizAnswers.step_1 || "recovery";

    // Match best product
    let recProduct = currentProducts[0]; // default B5
    if (skinIssue === "acne" || goal === "acne") {
      recProduct = currentProducts.find((p) => p.id === "bio-cica-acne") || currentProducts[2] || currentProducts[0];
    } else if (skinIssue === "dull" || goal === "brightening") {
      recProduct = currentProducts.find((p) => p.id === "bio-glow-niacinamide") || currentProducts[1] || currentProducts[0];
    } else if (skinIssue === "aging" || goal === "anti-aging") {
      recProduct = currentProducts.find((p) => p.id === "bio-peptide-collagen") || currentProducts[3] || currentProducts[0];
    } else if (quizAnswers.combo === "combo") {
      recProduct = currentProducts.find((p) => p.id === "bio-combo-discovery") || currentProducts[4] || currentProducts[0];
    } else {
      recProduct = currentProducts.find((p) => p.id === "bio-b5-hydra") || currentProducts[0];
    }

    quizBody.innerHTML = `
      <div class="quiz-result-card animate-fade-in text-center py-4">
        <div class="badge-pill inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold mb-3">
          🔬 Kết Quả Phân Tích Làn Da Của Bạn
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Liệu Trình Sinh Học Đề Xuất Riêng Cho Bạn</h3>
        <p class="text-sm text-gray-600 mb-6 max-w-md mx-auto">
          Dựa trên chẩn đoán, da bạn đang cần liệu trình làm dịu màng tế bào nano từ nước dừa lên men và hoạt chất chuyên biệt.
        </p>

        <div class="recommended-product-box">
          <div class="rec-img-col">
            <img src="${recProduct.image}" alt="${recProduct.name}" class="rec-product-img" />
          </div>
          <div class="rec-info-col text-left">
            <span class="badge-rec">Phù Hợp 98% Với Tình Trạng Da</span>
            <h4 class="font-bold text-gray-900 text-lg mb-1">${recProduct.name}</h4>
            <p class="text-xs text-gray-500 mb-3">${recProduct.subtitle}</p>
            
            <div class="text-xs text-gray-700 space-y-1 mb-4 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
              <div>🌿 <strong>Hoạt chất chủ đạo:</strong> ${recProduct.keyIngredients[0].name}</div>
              <div>⚡ <strong>Tác động nhanh:</strong> ${recProduct.keyIngredients[0].role}</div>
            </div>

            <div class="flex items-baseline space-x-3 mb-4">
              <span class="text-xl font-extrabold text-emerald-800">${formatMoney(recProduct.price)}</span>
              <span class="text-sm text-gray-400 line-through">${formatMoney(recProduct.originalPrice)}</span>
            </div>

            <div class="voucher-reward-banner mb-4">
              <div class="text-xs text-amber-800 font-semibold">🎁 Tặng bạn mã độc quyền giảm 15%:</div>
              <div class="flex items-center space-x-2 mt-1">
                <code class="voucher-code-highlight">SKINTEST15</code>
                <button id="copy-quiz-code-btn" class="text-xs underline text-amber-900 font-bold hover:text-black">Sao chép</button>
              </div>
            </div>

            <button id="add-rec-to-cart-btn" class="btn btn-primary w-full py-2.5" data-id="${recProduct.id}">
              Thêm Liệu Trình Vào Giỏ & Nhận Ưu Đãi
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("copy-quiz-code-btn")?.addEventListener("click", () => {
      navigator.clipboard.writeText("SKINTEST15");
      showToast("Đã sao chép mã!", "Mã SKINTEST15 đã lưu vào bộ nhớ tạm", "info");
      if (voucherInput) voucherInput.value = "SKINTEST15";
    });

    document.getElementById("add-rec-to-cart-btn")?.addEventListener("click", () => {
      appliedVoucher = { code: "SKINTEST15", ...VOUCHERS.SKINTEST15 };
      addToCart(recProduct.id, 2, true);
      closeAllModals();
      showToast("Đã thêm liệu trình!", "Mã giảm giá 15% đã tự động kích hoạt trong giỏ");
    });
  }

  // Social Proof Toast Ticker (Customer buying activity)
  const FAKE_ORDERS = [
    { name: "Chị Thảo My", city: "Hà Nội", item: "Combo 10 Miếng BIOCELLA Gift Set", time: "3 phút trước" },
    { name: "Bác sĩ Lan Anh", city: "TP. Hồ Chí Minh", item: "5 Mặt Nạ Sinh Học B5 Cấp Ẩm", time: "8 phút trước" },
    { name: "Bạn Minh Quân", city: "Đà Nẵng", item: "Mặt Nạ Rau Má Tràm Trà Trị Mụn", time: "14 phút trước" },
    { name: "Chị Hương Giang", city: "Hải Phòng", item: "Mặt Nạ Niacinamide Trắng Sáng", time: "22 phút trước" }
  ];

  let orderIndex = 0;
  function triggerSocialProof() {
    const o = FAKE_ORDERS[orderIndex];
    orderIndex = (orderIndex + 1) % FAKE_ORDERS.length;

    const popup = document.getElementById("social-proof-toast");
    if (!popup) return;

    popup.innerHTML = `
      <div class="social-avatar">🛍️</div>
      <div class="social-text">
        <p class="social-name"><strong>${o.name}</strong> (${o.city}) vừa đặt mua:</p>
        <p class="social-item">${o.item}</p>
        <span class="social-time">${o.time} • Đã xác nhận</span>
      </div>
      <button class="social-close" aria-label="Đóng">&times;</button>
    `;

    popup.classList.add("show");
    popup.querySelector(".social-close").addEventListener("click", () => {
      popup.classList.remove("show");
    });

    setTimeout(() => {
      popup.classList.remove("show");
    }, 6000);
  }

  // Start social proof after 5 seconds, repeat every 25 seconds
  setTimeout(triggerSocialProof, 5000);
  setInterval(triggerSocialProof, 25000);

  // Smooth scroll for nav anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("mobile-open"));
    });
  }

  // Initial Render
  renderProducts();
  updateCartUI();
});
