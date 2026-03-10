require("dotenv").config()

const express = require("express")
const mysql = require("mysql2")
const session = require("express-session")
const bcrypt = require("bcrypt")

const app = express()

/* ================= MIDDLEWARE ================= */

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

/* ================= DATABASE ================= */

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})

db.connect(err => {
  if (err) {
    console.log("DB ERROR", err)
  } else {
    console.log("MySQL Connected")
  }
})

/* ================= AUTH ================= */

function auth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized")
  }
  next()
}

function adminOnly(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Forbidden")
  }
  next()
}

/* ================= REGISTER ================= */

app.post("/api/register", async (req, res) => {

  const { username, password, role } = req.body

  const hash = await bcrypt.hash(password, 10)

  db.query(
    "INSERT INTO users (username,password,role) VALUES (?,?,?)",
    [username, hash, role],
    err => {

      if (err) {
        console.log(err)
        return res.send("Register error")
      }

      res.redirect("/login.html")
    }
  )
})

/* ================= LOGIN ================= */

app.post("/api/login", (req, res) => {

  const { username, password } = req.body

  db.query(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err, results) => {

      if (err) return res.send(err)

      if (results.length === 0)
        return res.send("User not found")

      const user = results[0]

      const match = await bcrypt.compare(password, user.password)

      if (!match)
        return res.send("Wrong password")

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      }

      if (user.role === "admin") {
        res.redirect("/admin.html")
      } else {
        res.redirect("/dashboard.html")
      }

    }
  )
})

/* ================= LOGOUT ================= */

app.get("/logout", (req, res) => {

  req.session.destroy(() => {
    res.redirect("/login.html")
  })

})

/* ================= BOOK SPA ================= */

app.post("/api/bookings", auth, (req, res) => {

  const { service, booking_date } = req.body

  const user_id = req.session.user.id

  db.query(
    "INSERT INTO bookings (user_id,service,booking_date) VALUES (?,?,?)",
    [user_id, service, booking_date],
    err => {

      if (err) return res.send(err)

      res.send("Booking success")
    }
  )

})

/* ================= USER BOOKINGS ================= */

app.get("/api/bookings", auth, (req, res) => {

  const user_id = req.session.user.id

  db.query(
    "SELECT * FROM bookings WHERE user_id=?",
    [user_id],
    (err, results) => {

      if (err) return res.send(err)

      res.json(results)

    }
  )

})

/* ================= ADMIN BOOKINGS ================= */

app.get("/api/admin/bookings", auth, adminOnly, (req, res) => {

  db.query(
    "SELECT * FROM bookings",
    (err, results) => {

      if (err) return res.send(err)

      res.json(results)

    }
  )

})

/* ================= SERVER ================= */

app.listen(3000, () => {
  console.log("Server running on port 3000")
})