-- ====================================================================
-- BIOCELLA STORE - DATABASE SCHEMA (MySQL 8.0 / MariaDB)
-- Hỗ trợ tiếng Việt đầy đủ với UTF8MB4
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `biocella_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `biocella_db`;

-- 1. BẢNG SẢN PHẨM (PRODUCTS)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL,
  `skin_types` JSON DEFAULT NULL,
  `price` INT NOT NULL,
  `original_price` INT DEFAULT NULL,
  `rating` DECIMAL(3,1) DEFAULT 5.0,
  `review_count` INT DEFAULT 0,
  `sold_count` INT DEFAULT 0,
  `badge` VARCHAR(100) DEFAULT NULL,
  `is_bestseller` BOOLEAN DEFAULT FALSE,
  `image` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `key_ingredients` JSON DEFAULT NULL,
  `features` JSON DEFAULT NULL,
  `usage_steps` JSON DEFAULT NULL,
  `volume` VARCHAR(100) DEFAULT '28ml / 1 miếng',
  `origin` VARCHAR(255) DEFAULT 'Công nghệ sinh học Bio-Cellulose chuẩn cGMP',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG ĐƠN HÀNG (ORDERS)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `customer_city` VARCHAR(100) NOT NULL,
  `customer_address` TEXT NOT NULL,
  `customer_note` TEXT DEFAULT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'cod',
  `status` VARCHAR(50) DEFAULT 'pending',
  `subtotal` INT NOT NULL DEFAULT 0,
  `discount` INT NOT NULL DEFAULT 0,
  `shipping_fee` INT NOT NULL DEFAULT 0,
  `total_amount` INT NOT NULL DEFAULT 0,
  `items` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_order_status` (`status`),
  INDEX `idx_order_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG MÃ KHUYẾN MÃI (VOUCHERS)
CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `type` VARCHAR(20) NOT NULL DEFAULT 'percent',
  `value` INT NOT NULL,
  `min_order` INT NOT NULL DEFAULT 0,
  `label` VARCHAR(255) DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_voucher_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG CÀI ĐẶT WEBSITE (SITE_SETTINGS)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT NOT NULL DEFAULT 1,
  `brand_name` VARCHAR(100) DEFAULT 'BIOCELLA',
  `brand_slogan` VARCHAR(255) DEFAULT 'BIO-CELLULOSE LAB',
  `announcement_text` TEXT DEFAULT NULL,
  `shipping_notice` TEXT DEFAULT NULL,
  `free_shipping_threshold` INT DEFAULT 350000,
  `hotline` VARCHAR(50) DEFAULT '1900 6828',
  `hero_title` TEXT DEFAULT NULL,
  `hero_desc` TEXT DEFAULT NULL,
  `bank_id` VARCHAR(50) DEFAULT 'MB',
  `bank_account` VARCHAR(50) DEFAULT '0988776655',
  `bank_owner` VARCHAR(150) DEFAULT 'CONG TY BIOCELLA VIET NAM',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG TÀI KHOẢN QUẢN TRỊ (ADMINS)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `full_name` VARCHAR(150) DEFAULT 'Quản Trị Viên BIOCELLA',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
