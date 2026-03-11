CREATE DATABASE IF NOT EXISTS spa_db;
USE spa_db;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
username VARCHAR(50),
password VARCHAR(100),
role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE services (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
price INT,
image VARCHAR(255)
);

CREATE TABLE bookings (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
service_id INT,
booking_date DATE,
booking_time VARCHAR(10),
status VARCHAR(20) DEFAULT 'confirmed',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services(name,price,image) VALUES
('นวดแผนไทย',300,'img/thai-massage.jpg'),
('นวดเท้า',250,'img/foot-massage.jpg'),
('Hot Stone',500,'img/hot-stone.jpg');