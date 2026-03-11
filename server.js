const express = require("express")
const mysql = require("mysql2")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const db = mysql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"spa_db"
})

db.connect(err=>{
if(err) throw err
console.log("database connected")
})

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"public/index.html"))
})

app.post("/api/register",(req,res)=>{

const {name,phone,username,password}=req.body

db.query(
"INSERT INTO users(name,phone,username,password) VALUES(?,?,?,?)",
[name,phone,username,password],
()=>{
res.redirect("/login.html")
})

})

app.post("/api/login",(req,res)=>{

const {username,password}=req.body

db.query(
"SELECT * FROM users WHERE username=? AND password=?",
[username,password],
(err,result)=>{

if(result.length==0){
return res.send("Login fail")
}

const user=result[0]

if(user.role=="admin"){
res.redirect("/admin.html")
}else{
res.redirect("/dashboard.html")
}

})

})

app.post("/api/book",(req,res)=>{

const {service,time}=req.body

db.query(
"SELECT * FROM bookings WHERE service=? AND time=?",
[service,time],
(err,result)=>{

if(result.length>0){
return res.send("เวลานี้ถูกจองแล้ว")
}

db.query(
"INSERT INTO bookings(service,time,user_id) VALUES(?,?,1)",
[service,time],
()=>{
res.redirect("/history.html")
})

})

})
app.get("/api/history",(req,res)=>{

db.query(
"SELECT * FROM bookings",
(err,result)=>{
res.json(result)
})

})

app.get("/api/users",(req,res)=>{
db.query(
"SELECT id,name,phone FROM users",
(err,result)=>{
res.json(result)
})
})

app.post("/api/confirm",(req,res)=>{

const {id}=req.body

db.query(
"UPDATE bookings SET status='confirmed' WHERE id=?",
[id],
()=>{
res.redirect("/admin.html")
})

})

app.listen(3000,()=>{
console.log("server running http://localhost:3000")
})