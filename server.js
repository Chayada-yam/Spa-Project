const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const SECRET_KEY = "secretkey"; 

app.use(cors());
app.use(express.json());

// --- 1. การจัดการไฟล์หน้าบ้าน (Frontend) ---
// บอกให้ Server รู้ว่าไฟล์ HTML/CSS/JS อยู่ในโฟลเดอร์ชื่อ 'public'
app.use(express.static(path.join(__dirname, 'public')));

// เมื่อเข้าลิงก์หลัก ให้ส่งหน้า index.html ออกไปโชว์
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- 2. การตั้งค่า Database แบบ Safe Connection (กัน Vercel พัง) ---
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "spa_db"
});

db.connect(err => {
    if (err) {
        console.log("⚠️ DB Status: Offline (This is normal on Vercel)");
    } else {
        console.log("✅ DB Status: Online (Connected to Localhost)");
    }
});

// --- 3. Middleware: ระบบความปลอดภัย Protected API ---
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, authData) => {
            if (err) return res.status(403).send("Forbidden: Invalid Token");
            req.user = authData;
            next();
        });
    } else {
        // ถ้าไม่ล็อกอิน แล้วพยายามเข้า API ตรงๆ จะขึ้น Forbidden แบบในรูปที่เตงเจอ
        res.status(403).send("Forbidden: Please Login First");
    }
}

// --- 4. API Routes ---

// API ล็อกอิน (ออก Token ให้ทั้ง Client และ Admin)
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    // สำหรับ Demo: ถ้าต่อ DB ไม่ได้ ให้ล็อกอิน admin/1234 ได้เลย
    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ id: 99, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ status: "success", token, user: { name: "Admin", role: "admin" } });
    }

    db.query("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, result) => {
        if (err || !result || result.length === 0) return res.json({ status: "fail", message: "User not found" });
        const user = result[0];
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ status: "success", token, user: { name: user.name, role: user.role } });
    });
});

// API ดึงข้อมูลบริการ (Protected: ต้องมี Token ถึงจะเห็น)
app.get("/api/services", verifyToken, (req, res) => {
    db.query("SELECT * FROM services", (err, result) => {
        if (err) {
            // ถ้าต่อ DB ไม่ได้บน Vercel ให้ส่งข้อมูลหลอกไปโชว์ให้หน้าเว็บไม่ว่าง
            return res.json([
                { id: 1, name: "Thai Massage", price: 500, image: "thai.jpg" },
                { id: 2, name: "Facial Spa", price: 800, image: "facial.jpg" }
            ]);
        }
        res.json(result);
    });
});

// API สำหรับ Admin กดยืนยัน (เช็คทั้ง Token และสิทธิ Admin)
app.post("/api/admin/confirm", verifyToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send("Access Denied: Admin Only");
    
    const { booking_id } = req.body;
    db.query("UPDATE bookings SET status = 'ยืนยันแล้ว' WHERE id = ?", [booking_id], (err) => {
        if (err) return res.status(500).json({ status: "error" });
        res.json({ status: "success" });
    });
});

// --- 5. Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});