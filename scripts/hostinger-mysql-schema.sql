-- ============================================================================
-- BAJOZ — THE HOUSE OF NATURALS (https://bajoz.pk)
-- Self-Hosted MySQL / MariaDB Schema for Hostinger Unlimited Plan (phpMyAdmin)
-- ============================================================================
-- Note: The BAJOZ application runs out-of-the-box with zero configuration using
-- its built-in atomic JSON database engine (`storage/db/bajoz-database.json`).
-- If you optionally wish to mirror or query records in Hostinger MySQL
-- (phpMyAdmin), import this schema into your Hostinger MySQL database.
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+05:00';

CREATE TABLE IF NOT EXISTS `bajoz_products` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `tagline` TEXT DEFAULT NULL,
  `category` VARCHAR(64) NOT NULL,
  `image_type` VARCHAR(64) DEFAULT 'panjeeri',
  `custom_image_url` VARCHAR(1024) DEFAULT NULL,
  `base_price` INT NOT NULL DEFAULT 0,
  `featured` TINYINT(1) NOT NULL DEFAULT 1,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `packaging_spec` VARCHAR(255) DEFAULT NULL,
  `story` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `ingredients_json` JSON DEFAULT NULL,
  `usage_instructions_json` JSON DEFAULT NULL,
  `variants_json` JSON DEFAULT NULL,
  `pack_sizes_json` JSON DEFAULT NULL,
  `faqs_json` JSON DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bajoz_users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(64) NOT NULL,
  `city` VARCHAR(128) NOT NULL DEFAULT 'Lahore',
  `provider` VARCHAR(32) NOT NULL DEFAULT 'email',
  `password_hash` VARCHAR(512) NOT NULL,
  `saved_addresses_json` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_bajoz_users_email` (`email`),
  INDEX `idx_bajoz_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bajoz_sessions` (
  `token` VARCHAR(512) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  INDEX `idx_bajoz_sessions_user` (`user_id`),
  INDEX `idx_bajoz_sessions_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bajoz_orders` (
  `order_number` VARCHAR(64) NOT NULL PRIMARY KEY,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(64) NOT NULL,
  `customer_email` VARCHAR(255) DEFAULT NULL,
  `customer_city` VARCHAR(128) NOT NULL DEFAULT 'Lahore',
  `customer_address` TEXT NOT NULL,
  `items_json` JSON NOT NULL,
  `subtotal` INT NOT NULL DEFAULT 0,
  `shipping` INT NOT NULL DEFAULT 0,
  `total` INT NOT NULL DEFAULT 0,
  `payment_method` VARCHAR(64) NOT NULL DEFAULT 'cod',
  `payment_status` VARCHAR(64) NOT NULL DEFAULT 'Pending',
  `fulfillment_status` VARCHAR(64) NOT NULL DEFAULT 'Order Placed',
  `courier_name` VARCHAR(128) DEFAULT NULL,
  `tracking_number` VARCHAR(128) DEFAULT NULL,
  `scheduled_date` VARCHAR(64) DEFAULT NULL,
  `scheduled_slot` VARCHAR(128) DEFAULT NULL,
  `order_notes` TEXT DEFAULT NULL,
  `gift_message` TEXT DEFAULT NULL,
  `timeline_json` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_bajoz_orders_phone` (`customer_phone`),
  INDEX `idx_bajoz_orders_email` (`customer_email`),
  INDEX `idx_bajoz_orders_status` (`fulfillment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bajoz_reviews` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `customer_name` VARCHAR(255) NOT NULL,
  `city` VARCHAR(128) NOT NULL DEFAULT 'Lahore',
  `rating` TINYINT NOT NULL DEFAULT 5,
  `product_tag` VARCHAR(128) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `comment` TEXT NOT NULL,
  `verified` TINYINT(1) NOT NULL DEFAULT 1,
  `helpful_count` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(32) NOT NULL DEFAULT 'approved',
  `review_date` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bajoz_media` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(128) NOT NULL,
  `size_bytes` INT NOT NULL DEFAULT 0,
  `category` VARCHAR(64) NOT NULL DEFAULT 'general',
  `url` VARCHAR(1024) NOT NULL,
  `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by` VARCHAR(255) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bajoz_staff` (
  `email` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(128) NOT NULL DEFAULT 'Store Director',
  `password_hash` VARCHAR(512) NOT NULL,
  `added_at` VARCHAR(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bajoz_settings` (
  `setting_key` VARCHAR(64) NOT NULL PRIMARY KEY,
  `setting_value_json` JSON NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
