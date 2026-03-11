const API="http://localhost:3000"

/* โหลดรายการจอง */

function loadBookings(){

const bookings=JSON.parse(localStorage.getItem("bookings")) || []

const list=document.getElementById("adminList")

list.innerHTML=""

bookings.forEach((b,index)=>{

const li=document.createElement("li")

li.innerHTML=`
${b.service} - ${b.datetime}
<button onclick="confirmBooking(${index})">ยืนยัน</button>
<button onclick="cancelBooking(${index})">ยกเลิก</button>
`

list.appendChild(li)

})

}

/* ยืนยันการจอง */

function confirmBooking(i){

alert("ยืนยันการจองแล้ว")

}

/* ยกเลิกการจอง */

function cancelBooking(i){

let bookings=JSON.parse(localStorage.getItem("bookings")) || []

bookings.splice(i,1)

localStorage.setItem("bookings",JSON.stringify(bookings))

loadBookings()

}

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

localStorage.removeItem("role")

window.location.href="login.html"

}

loadBookings()
loadServices()