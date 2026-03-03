const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

// ================= DATABASE =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "spa_db"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected");
});

// ================= MIDDLEWARE =================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
}));

// ================= AUTH MIDDLEWARE =================
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  res.status(403).send("Access denied");
}

// ================= ROUTES =================

// Default route → ถ้ายังไม่ login ให้ไป login
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role === "admin") {
    return res.redirect("/admin");
  }

  res.sendFile(__dirname + "/public/index.html");
});

// Login Page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// Login Process
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {

    if (err) {
      console.error(err);
      return res.send("Database error");
    }

    if (results.length === 0) {
      return res.send("User not found");
    }

    const user = results[0];

    if (password === user.password) {
      req.session.user = {
        id: user.id,
        role: user.role
      };

      if (user.role === "admin") {
        return res.redirect("/admin");
      }

      return res.redirect("/");
    }

    res.send("Wrong password");
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Admin Page
app.get("/admin", isLoggedIn, isAdmin, (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});