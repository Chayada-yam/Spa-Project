function register(){

const name=document.getElementById("name").value
const username=document.getElementById("username").value
const password=document.getElementById("password").value
const confirm=document.getElementById("confirm").value

const error=document.getElementById("error")

/* เช็คกรอกข้อมูล */

if(!name || !username || !password || !confirm){

error.innerText="กรุณากรอกข้อมูลให้ครบ"
error.style.color="red"
return

}

/* เช็ครหัสผ่าน 8 ตัว */

if(password.length!==8){

error.innerText="รหัสผ่านต้องมี 8 ตัว"
error.style.color="red"
return

}

/* ต้องมีตัวใหญ่ */

if(!/[A-Z]/.test(password)){

error.innerText="รหัสต้องมีตัวพิมพ์ใหญ่ 1 ตัว"
error.style.color="red"
return

}

/* ต้องมีตัวเลข */

if(!/[0-9]/.test(password)){

error.innerText="รหัสต้องมีตัวเลข"
error.style.color="red"
return

}

/* เช็คยืนยันรหัส */

if(password!==confirm){

error.innerText="รหัสผ่านไม่ตรงกัน"
error.style.color="red"
return

}

/* ส่งข้อมูล */

fetch("/api/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name,username,password})

})
.then(res=>res.json())
.then(data=>{

if(data.status==="success"){

alert("สมัครสมาชิกสำเร็จ")

window.location="login.html"

}else{

error.innerText="สมัครสมาชิกไม่สำเร็จ"

}

})

}