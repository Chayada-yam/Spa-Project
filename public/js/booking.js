function book(){

const service=document.getElementById("service").value
const datetime=document.getElementById("datetime").value

if(datetime===""){
alert("กรุณาเลือกวันเวลา")
return
}

let bookings=JSON.parse(localStorage.getItem("bookings")) || []

const booking={
service:service,
datetime:datetime,
status:"รอการยืนยัน"
}

bookings.push(booking)

localStorage.setItem("bookings",JSON.stringify(bookings))

alert("จองสำเร็จ รอแอดมินยืนยัน")

window.location="history.html"

}