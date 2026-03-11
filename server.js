const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const db = mysql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"spa_db"
})

db.connect(err=>{
if(err) throw err
console.log("Database connected")
})

/* REGISTER */

app.post("/api/register",(req,res)=>{

const {name,username,password}=req.body

db.query(
"INSERT INTO users(name,username,password) VALUES(?,?,?)",
[name,username,password],
(err,result)=>{

if(err){
return res.json({status:"error"})
}

res.json({status:"success"})

})

})

/* LOGIN */

app.post("/api/login",(req,res)=>{

const {username,password}=req.body

db.query(
"SELECT * FROM users WHERE username=? AND password=?",
[username,password],
(err,result)=>{

if(result.length>0){

if(result.length>0){

const token = jwt.sign(
{ id: result[0].id },
"secretkey",
{ expiresIn: "1h" }
)

res.json({
status:"success",
token: token,
user: result[0]
})

}

}else{

res.json({status:"fail"})

}

})

})

/* SERVICES */

app.get("/api/services",(req,res)=>{

db.query("SELECT * FROM services",(err,result)=>{

res.json(result)

})

})

/* BOOK */

app.post("/api/book",(req,res)=>{

const {user_id,service_id,date,time}=req.body

db.query(
"SELECT * FROM bookings WHERE booking_date=? AND booking_time=?",
[date,time],
(err,result)=>{

if(result.length>0){

return res.json({status:"เต็ม"})

}

db.query(
"INSERT INTO bookings(user_id,service_id,booking_date,booking_time) VALUES(?,?,?,?)",
[user_id,service_id,date,time],
(err,result)=>{

res.json({status:"success"})

})

})

})

app.listen(3000,()=>{
console.log("Server running on port 3000")
})