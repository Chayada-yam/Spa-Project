const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();
const PORT = 3000;

// ===== SESSION =====
app.use(session({
    secret: 'spa_secret',
    resave: false,
    saveUninitialized: true
}));

// ===== DATABASE =====
const db = new sqlite3.Database('./spa.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            service TEXT,
            booking_date TEXT
        )
    `);

    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO users (username,password,role) VALUES ('admin','1234','admin')`);
            db.run(`INSERT INTO users (username,password,role) VALUES ('staff','1234','staff')`);
        }
    });
});

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROUTES =====

// หน้าแรก = login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username=? AND password=?`,
        [username, password],
        (err, user) => {
            if (!user) return res.status(401).json({ message: "Invalid" });

            req.session.user = { id: user.id, role: user.role };
            res.json({ role: user.role });
        }
    );
});

// AUTH CHECK
function requireLogin(req, res, next) {
    if (!req.session.user) return res.status(401).json({ message: "Login required" });
    next();
}

// ===== CUSTOMER API =====
app.post('/customers', requireLogin, (req, res) => {
    const { name, phone } = req.body;

    db.run(
        `INSERT INTO customers (name, phone) VALUES (?, ?)`,
        [name, phone],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

app.get('/customers', requireLogin, (req, res) => {
    db.all(`SELECT * FROM customers`, [], (err, rows) => {
        res.json(rows);
    });
});

// DELETE เฉพาะ admin
app.delete('/customers/:id', requireLogin, (req, res) => {
    if (req.session.user.role !== 'admin')
        return res.status(403).json({ message: "Admin only" });

    db.run(`DELETE FROM customers WHERE id=?`, [req.params.id], () => {
        res.json({ message: "Deleted" });
    });
});

// ===== BOOKING API =====
app.post('/bookings', requireLogin, (req, res) => {
    const { customer_id, service, booking_date } = req.body;

    db.run(
        `INSERT INTO bookings (customer_id,service,booking_date) VALUES (?,?,?)`,
        [customer_id, service, booking_date],
        function () {
            res.json({ id: this.lastID });
        }
    );
});

app.get('/bookings', requireLogin, (req, res) => {
    db.all(`
        SELECT bookings.id, customers.name, service, booking_date
        FROM bookings
        JOIN customers ON bookings.customer_id = customers.id
    `, [], (err, rows) => {
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});