const express=require("express")
const mysql=require("mysql2")
const bodyParser=require("body-parser")

const app=express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const db=mysql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"spa_db"
})

db.connect(()=>{

console.log("database connected")

})

app.post("/register",(req,res)=>{

const{name,gender,phone,username,password}=req.body

db.query(
"INSERT INTO users(name,gender,phone,username,password,role) VALUES(?,?,?,?,?,'user')",
[name,gender,phone,username,password],
()=>{

res.redirect("/login.html")

})

})

app.post("/login",(req,res)=>{

const{username,password}=req.body

db.query(
"SELECT * FROM users WHERE username=? AND password=?",
[username,password],
(err,result)=>{

if(result.length==0){

return res.send("login fail")

}

if(result[0].role=="admin"){

res.redirect("/admin.html")

}else{

res.redirect("/dashboard.html")

}

})

})

app.post("/booking",(req,res)=>{

const{service,time}=req.body

db.query(
"SELECT * FROM bookings WHERE service_id=? AND booking_time=?",
[service,time],
(err,result)=>{

if(result.length>0){

return res.send("เวลานี้ถูกจองแล้ว")

}

db.query(
"INSERT INTO bookings(user_id,service_id,booking_time,status) VALUES(1,?,?, 'pending')",
[service,time],
()=>{

res.redirect("/history.html")

})

})

})

app.get("/bookings",(req,res)=>{

db.query(
"SELECT * FROM bookings",
(err,result)=>{

res.json(result)

})

})

app.get("/users",(req,res)=>{

db.query(
"SELECT id,name,phone FROM users",
(err,result)=>{

res.json(result)

})

})

app.listen(3000,()=>{

console.log("server started")

})