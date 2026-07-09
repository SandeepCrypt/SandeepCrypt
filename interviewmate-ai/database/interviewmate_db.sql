-- Complete database setup script
-- Run: mysql -u root -p < interviewmate_db.sql

CREATE DATABASE IF NOT EXISTS interviewmate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE interviewmate_db;

-- Run schema
SOURCE schema.sql;

-- Run seed data
SOURCE seed_data.sql;

-- Create application user (optional)
CREATE USER IF NOT EXISTS 'interviewmate'@'localhost' IDENTIFIED BY 'SecurePass123!';
GRANT ALL PRIVILEGES ON interviewmate_db.* TO 'interviewmate'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Database setup complete!' AS status;