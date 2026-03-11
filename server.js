const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET_KEY = "secretkey";

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "spa_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("Database connected");
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, authData) => {
            if (err) return res.sendStatus(403);
            req.user = authData;
            next();
        });
    } else {
        res.sendStatus(403);
    }
}

// --- API ---

app.post("/api/register", (req, res) => {
    const { name, username, password } = req.body;
    db.query("INSERT INTO users(name,username,password) VALUES(?,?,?)", [name, username, password], (err) => {
        if (err) return res.json({ status: "error" });
        res.json({ status: "success" });
    });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, result) => {
        if (result && result.length > 0) {
            const token = jwt.sign({ id: result[0].id }, SECRET_KEY, { expiresIn: "1h" });
            res.json({ status: "success", token, user: result[0] });
        } else {
            res.json({ status: "fail" });
        }
    });
});

app.get("/api/services", verifyToken, (req, res) => {
    db.query("SELECT * FROM services", (err, result) => {
        res.json(result);
    });
});

app.post("/api/book", verifyToken, (req, res) => {
    const { user_id, service_id, date, time } = req.body;
    db.query("SELECT * FROM bookings WHERE booking_date=? AND booking_time=?", [date, time], (err, result) => {
        if (result && result.length > 0) return res.json({ status: "เต็ม" });
        
        db.query("INSERT INTO bookings(user_id,service_id,booking_date,booking_time) VALUES(?,?,?,?)", 
        [user_id, service_id, date, time], (err) => {
            res.json({ status: "success" });
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});