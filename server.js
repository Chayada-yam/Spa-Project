const express = require("express")
const mysql = require("mysql2")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")

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
console.log("MySQL connected")
})

app.post("/api/register",async(req,res)=>{

const {name,gender,phone,address,username,password}=req.body

const hash=await bcrypt.hash(password,10)

db.query(
"INSERT INTO users (name,gender,phone,address,username,password,role) VALUES (?,?,?,?,?,?,'user')",
[name,gender,phone,address,username,hash],
(err)=>{
if(err) return res.send(err)

res.redirect("/login.html")
})

})

app.post("/api/login",(req,res)=>{

const {username,password}=req.body

db.query(
"SELECT * FROM users WHERE username=?",
[username],
async(err,result)=>{

if(result.length==0){
return res.send("User not found")
}

const user=result[0]

const match=await bcrypt.compare(password,user.password)

if(!match){
return res.send("Wrong password")
}

if(user.role=="admin"){
res.redirect("/admin.html")
}else{
res.redirect("/dashboard.html")
}

})

})

app.post("/api/book",(req,res)=>{

const {service,date}=req.body
const user_id=1

db.query(
"INSERT INTO bookings (user_id,service,booking_date) VALUES (?,?,?)",
[user_id,service,date],
(err)=>{

if(err) return res.send(err)

res.redirect("/history.html")

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
"SELECT id,name,phone,username FROM users",
(err,result)=>{

res.json(result)

})

})

app.listen(3000,()=>{
console.log("Server running http://localhost:3000")
})