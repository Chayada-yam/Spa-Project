document.getElementById("bookingForm")
.addEventListener("submit", async e => {

e.preventDefault()

const form = new FormData(e.target)

const data = {
service: form.get("service"),
booking_date: form.get("booking_date")
}

const res = await fetch("/api/bookings",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

})

alert(await res.text())

})