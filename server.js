const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// ===== Database Setup =====
const db = new sqlite3.Database('./spa.db');

db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        service TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
    )
`);
// ===========================

// ใช้โฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// รับข้อมูล JSON
app.use(express.json());

// ===== API POST =====
app.post('/customers', (req, res) => {
    const { name, phone } = req.body;

    db.run(
        `INSERT INTO customers (name, phone) VALUES (?, ?)`,
        [name, phone],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// ===== API GET =====
app.get('/customers', (req, res) => {
    db.all(`SELECT * FROM customers`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
// ===== CREATE BOOKING =====
app.post('/bookings', (req, res) => {
    const { customer_id, service, booking_date } = req.body;

    db.run(
        `INSERT INTO bookings (customer_id, service, booking_date)
         VALUES (?, ?, ?)`,
        [customer_id, service, booking_date],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// ===== GET BOOKINGS =====
app.get('/bookings', (req, res) => {
    db.all(`
        SELECT bookings.id, customers.name, service, booking_date
        FROM bookings
        JOIN customers ON bookings.customer_id = customers.id
    `, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});