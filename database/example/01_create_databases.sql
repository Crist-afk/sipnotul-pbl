-- ============================================
-- SIPNOTUL Database Creation Script
-- ============================================
-- This script creates the databases for SIPNOTUL application

-- Create Users Database
CREATE DATABASE IF NOT EXISTS dbUsers 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create Notes Database
CREATE DATABASE IF NOT EXISTS dbNotes 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Show created databases
SHOW DATABASES;
