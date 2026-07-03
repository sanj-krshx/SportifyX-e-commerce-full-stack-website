CREATE DATABASE IF NOT EXISTS sports_ecommerce;
USE sports_ecommerce;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

INSERT INTO admins (username, password)
VALUES ('admin', 'admin123')
ON DUPLICATE KEY UPDATE username = username;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mobile VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS football_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cricket_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS basketball_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tennis_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS volleyball_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

INSERT INTO football_products (id, name, price, image, stock)
VALUES (1, 'Premium Match Football', 999, 'football.webp', 18)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO cricket_products (id, name, price, image, stock)
VALUES (1, 'Cricket Bat Pro', 2499, 'cricket-bat.webp', 11)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO basketball_products (id, name, price, image, stock)
VALUES (1, 'Basketball Elite', 1499, 'basketball.webp', 14)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO tennis_products (id, name, price, image, stock)
VALUES (1, 'Performance Tennis Kit', 1299, 'Tennis.webp', 9)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO volleyball_products (id, name, price, image, stock)
VALUES (1, 'Tournament Volleyball', 1199, 'vollyball.webp', 12)
ON DUPLICATE KEY UPDATE name = VALUES(name);
