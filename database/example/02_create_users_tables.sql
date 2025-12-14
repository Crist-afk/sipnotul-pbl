-- ============================================
-- Users Database Tables
-- ============================================

USE dbUsers;

-- Users Table
CREATE TABLE IF NOT EXISTS tbUsers (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    nim VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    programStudi VARCHAR(30) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nim (nim),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Show table structure
DESCRIBE tbUsers;
