const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// ===== Database Setup =====
const db = new sqlite3.Database('./spa.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});
// ===========================

// กำหนดให้ใช้โฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));
// ===== API SECTION =====
app.use(express.json());

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
// ========================
// เปิด server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});