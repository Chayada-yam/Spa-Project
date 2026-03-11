function login(){

const username=document.getElementById("username").value
const password=document.getElementById("password").value

const storedUser=JSON.parse(localStorage.getItem("user"))

if(!storedUser){

alert("ยังไม่มีผู้ใช้ กรุณาสมัครก่อน")
return

}

if(username===storedUser.username && password===storedUser.password){

alert("เข้าสู่ระบบสำเร็จ")

localStorage.setItem("role","user")

window.location="services.html"

}else{

alert("เข้าสู่ระบบไม่สำเร็จ")

}

}

function goAdmin(){

let username=document.getElementById("username").value
let password=document.getElementById("password").value

if(username==="admin" && password==="1234"){

localStorage.setItem("role","admin")

alert("เข้าสู่ระบบแอดมินสำเร็จ")

window.location="admin.html"

}else{

alert("แอดมินไม่ถูกต้อง")

}

}