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

// เปิด server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});