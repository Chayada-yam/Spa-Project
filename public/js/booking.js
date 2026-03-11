const user = JSON.parse(localStorage.getItem("user"))
const service_id = localStorage.getItem("service")

/* เช็คว่าล็อกอินหรือยัง */

if(!user){

alert("กรุณาเข้าสู่ระบบก่อนจองบริการ")

window.location="login.html"

}

/* ฟังก์ชันจอง */

function book(){

const date=document.getElementById("date").value
const time=document.getElementById("time").value

if(!date || !time){

alert("กรุณาเลือกวันที่และเวลา")

return

}

fetch("/api/book",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:user.id,
service_id:service_id,
date:date,
time:time

})

})

.then(res=>res.json())

.then(data=>{

if(data.status==="success"){

alert("จองสำเร็จ")

}else{

alert("เวลานี้มีคนจองแล้ว")

}

})

}