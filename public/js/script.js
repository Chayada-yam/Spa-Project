function login(){

const username=document.getElementById("username").value
const password=document.getElementById("password").value

fetch("/api/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({username,password})

})
.then(res=>res.json())
.then(data=>{

if(data.status==="success"){

localStorage.setItem("user",JSON.stringify(data.user))

if(data.user.role==="admin"){
window.location="admin.html"
}else{
window.location="services.html"
}

}else{

alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")

}

})

}
function goAdmin(){

window.location="login.html?admin=true"

}