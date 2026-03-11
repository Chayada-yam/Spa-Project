const API="http://localhost:3000"

/* โหลดบริการ */

function loadServices(){

fetch(API+"/api/services")

.then(res=>res.json())

.then(data=>{

let html=""

data.forEach(s=>{

html+=`
<div>
${s.name} - ${s.price} บาท
<button onclick="deleteService(${s.id})">ลบ</button>
</div>
`

})

document.getElementById("serviceList").innerHTML=html

})

}

/* เพิ่มบริการ */

function addService(){

const name=document.getElementById("serviceName").value
const price=document.getElementById("price").value

fetch(API+"/api/services",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name,price})

})

.then(res=>res.json())

.then(()=>{

loadServices()

})

}

/* ลบบริการ */

function deleteService(id){

fetch(API+"/api/services/"+id,{
method:"DELETE"
})

.then(()=>{

loadServices()

})

}

/* logout */

function logout(){

localStorage.removeItem("user")

window.location.href="login.html"

}

loadServices()