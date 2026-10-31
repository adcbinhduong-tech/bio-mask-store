# BIOCELLA - Cửa Hàng & Hệ Thống Quản Trị Mặt Nạ Sinh Học Men Dừa (Fullstack Node.js + MySQL)

Hệ thống website thương mại điện tử cao cấp và CMS quản trị chuyên sâu dành cho dòng sản phẩm **Mặt nạ sinh học Bio-Cellulose lên men 100% từ nước dừa tươi Bến Tre**.

Dự án đã được tái cấu trúc hoàn chỉnh theo mô hình phân tách **Frontend (FE)** và **Backend (BE)**, sử dụng cơ sở dữ liệu quan hệ **MySQL** chuẩn y khoa.

---

## 📂 1. Cấu Trúc Thư Mục Dự Án (Restructured Architecture)

```text
bio-mask-store/
│
├── backend/                       # 🟢 BACKEND (RESTful API - Node.js + Express + MySQL)
│   ├── config/
│   │   └── db.js                  # Cấu hình Connection Pool MySQL & kiểm tra kết nối
│   ├── controllers/
│   │   ├── authController.js      # Xác thực tài khoản Admin & cấp Token
│   │   ├── orderController.js     # Xử lý đơn đặt hàng & thống kê KPI doanh số
│   │   ├── productController.js   # CRUD danh mục mặt nạ, phân loại da, tìm kiếm
│   │   ├── settingController.js   # Cài đặt thương hiệu, thông báo & tài khoản VietQR
│   │   └── voucherController.js   # Quản lý mã ưu đãi & tính toán chiết khấu
│   ├── database/
│   │   ├── init-db.js             # Script tự động tạo Database & nạp dữ liệu mẫu
│   │   ├── schema.sql             # Cấu trúc bảng MySQL (UTF8MB4 chuẩn tiếng Việt)
│   │   └── seed.sql               # Dữ liệu mẫu (6 mặt nạ dừa, đơn hàng, voucher, admin)
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── orderRoutes.js         # /api/orders
│   │   ├── productRoutes.js       # /api/products
│   │   ├── settingRoutes.js       # /api/settings
│   │   └── voucherRoutes.js       # /api/vouchers
│   ├── .env                       # File cấu hình môi trường (Port, DB credentials)
│   ├── .env.example               # File cấu hình mẫu
│   ├── package.json               # Dependencies (express, mysql2, cors, dotenv)
│   └── server.js                  # Điểm khởi chạy Backend Express Server (Port 5000)
│
├── frontend/                      # 🔵 FRONTEND (Storefront & Admin CMS)
│   ├── css/
│   │   ├── admin.css              # Giao diện Dashboard SaaS cho trang quản trị
│   │   └── styles.css             # Design System Spa Y Khoa: Emerald, Sage, Gold
│   ├── js/
│   │   ├── admin.js               # Logic điều khiển Dashboard Quản trị viên
│   │   ├── api.js                 # API Client kết nối Backend MySQL + Hybrid Fallback
│   │   ├── app.js                 # Giỏ hàng, bộ lọc da, trắc nghiệm Quiz, đặt hàng VietQR
│   │   └── products.js            # Danh mục dữ liệu gốc dự phòng (Fallback)
│   ├── images/                    # Thư mục hình ảnh tài nguyên
│   ├── admin.html                 # Trang Quản trị CMS (KPI, CRUD sản phẩm, đơn hàng)
│   └── index.html                 # Cửa hàng bán lẻ trực tuyến (Storefront)
│
└── README.md                      # Hướng dẫn cài đặt và vận hành hệ thống
```

---

## 🗄️ 2. Thiết Kế Cơ Sở Dữ Liệu MySQL (`biocella_db`)

Cơ sở dữ liệu được thiết lập với mã hóa `utf8mb4` và collation `utf8mb4_unicode_ci` để hiển thị tiếng Việt hoàn hảo:

| Tên Bảng | Mục Đích | Các Cột Chính |
| :--- | :--- | :--- |
| **`products`** | Danh mục mặt nạ sinh học | `id` (PK), `name`, `subtitle`, `category`, `skin_types` (JSON), `price`, `original_price`, `badge`, `image`, `key_ingredients` (JSON), `features`, `usage_steps`, `volume`, `origin` |
| **`orders`** | Đơn đặt hàng từ khách | `id` (PK), `customer_name`, `customer_phone`, `customer_city`, `customer_address`, `payment_method`, `status` (pending/shipping/completed/cancelled), `subtotal`, `discount`, `shipping_fee`, `total_amount`, `items` (JSON) |
| **`vouchers`** | Mã giảm giá ưu đãi | `id` (PK), `code`, `type` (percent/fixed), `value`, `min_order`, `label`, `is_active` |
| **`site_settings`** | Cấu hình nội dung & VietQR | `id` (PK), `brand_name`, `announcement_text`, `shipping_notice`, `free_shipping_threshold`, `hotline`, `hero_title`, `bank_id`, `bank_account`, `bank_owner` |
| **`admins`** | Tài khoản quản trị viên | `id` (PK), `username`, `password`, `email`, `full_name` |

---

## 🚀 3. Hướng Dẫn Cài Đặt & Chạy Hệ Thống

### Bước 1: Khởi động MySQL Server
1. Mở phần mềm quản lý MySQL (ví dụ: **XAMPP** hoặc **Laragon**).
2. Nhấn nút **Start** tại mục **MySQL** (cổng mặc định `3306`).

### Bước 2: Khởi tạo Cơ Sở Dữ Liệu (1 Bước Tự Động)
Mở Terminal / PowerShell tại thư mục `backend`:
```powershell
cd c:\Users\pc\.gemini\antigravity-ide\scratch\bio-mask-store\backend

# Cài đặt các thư viện cần thiết
npm install

# Tự động tạo database 'biocella_db', các bảng và nạp dữ liệu mẫu
npm run init-db
```
*(Hoặc bạn có thể mở **phpMyAdmin** tại `http://localhost/phpmyadmin` và Import trực tiếp 2 file: `backend/database/schema.sql` rồi đến `backend/database/seed.sql`)*.

### Bước 3: Khởi động Backend API Server
Trong thư mục `backend`:
```powershell
npm start
```
* Server sẽ lắng nghe tại: `http://localhost:5000`
* Kiểm tra trạng thái kết nối MySQL: `http://localhost:5000/api/health`

### Bước 4: Mở Giao Diện Frontend
Bạn có thể mở trực tiếp bằng trình duyệt Chrome/Edge hoặc qua Live Server:
* **Trang bán hàng (Storefront):** [frontend/index.html](file:///c:/Users/pc/.gemini/antigravity-ide/scratch/bio-mask-store/frontend/index.html)
* **Trang quản trị (Admin CMS):** [frontend/admin.html](file:///c:/Users/pc/.gemini/antigravity-ide/scratch/bio-mask-store/frontend/admin.html)

---

## 🔑 4. Thông Tin Đăng Nhập Quản Trị (Admin Credentials)

| Mục | Giá trị |
| :--- | :--- |
| **Tên đăng nhập** | `admin` *(hoặc `admin@biocella.vn`)* |
| **Mật khẩu** | `admin123` |
| **Tự động điền** | Bấm nút **"Tự động điền"** ngay tại màn hình đăng nhập |

---

## 🌐 5. Danh Sách RESTful API (Port 5000)

| Phương thức | Đường dẫn API | Chức năng |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra tình trạng server và trạng thái kết nối MySQL |
| `GET` | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ lọc `?category=...&skinType=...&search=...`) |
| `GET` | `/api/products/:id` | Xem chi tiết một sản phẩm theo ID |
| `POST` | `/api/products` | Thêm mới sản phẩm mặt nạ sinh học |
| `PUT` | `/api/products/:id` | Cập nhật thông tin / giá / thành phần sản phẩm |
| `DELETE` | `/api/products/:id` | Xóa sản phẩm khỏi hệ thống |
| `GET` | `/api/orders` | Danh sách đơn hàng (hỗ trợ lọc `?status=...&search=...`) |
| `GET` | `/api/orders/stats` | Thống kê KPI: Doanh thu thực tế, số lượng đơn, đơn chờ |
| `POST` | `/api/orders` | Khách hàng đặt đơn mới |
| `PUT` | `/api/orders/:id/status` | Chuyển trạng thái đơn (`pending`, `shipping`, `completed`, `cancelled`) |
| `GET` | `/api/vouchers` | Lấy danh sách mã giảm giá đang hoạt động |
| `POST` | `/api/vouchers/validate` | Kiểm tra tính hợp lệ & tính tiền chiết khấu của voucher |
| `POST` | `/api/vouchers` | Thêm mới mã giảm giá từ trang Admin |
| `DELETE` | `/api/vouchers/:code` | Xóa mã giảm giá |
| `GET` | `/api/settings` | Lấy cấu hình website (tiêu đề, banner, tài khoản VietQR) |
| `PUT` | `/api/settings` | Cập nhật cấu hình website |
| `POST` | `/api/settings/reset` | Khôi phục cấu hình mặc định ban đầu |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản quản trị viên |

---

## 💡 6. Cơ Chế Hybrid Thông Minh (Online / Offline Fallback)

Module `frontend/js/api.js` được thiết kế theo cơ chế **Hybrid Resilient**:
* **Khi Backend đang chạy (MySQL Online):** Tất cả các thao tác (tạo đơn, sửa giá, thêm voucher, đổi trạng thái) được đọc và ghi trực tiếp vào MySQL.
* **Khi chưa bật Backend (Offline):** Hệ thống tự động chuyển sang lưu tạm trên `LocalStorage` kèm huy hiệu thông báo góc phải màn hình, đảm bảo giao diện không bao giờ bị trắng trang hay gián đoạn trải nghiệm người dùng.

---
© 2026 BIOCELLA LAB VIETNAM. Bản quyền thuộc về Công ty TNHH Dược Mỹ Phẩm BIOCELLA.
