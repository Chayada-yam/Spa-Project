const form = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");
const today = new Date().toISOString().split("T")[0];
document.getElementById("bookingDate").setAttribute("min", today);

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const customer = document.getElementById("customerSelect").value;
    const service = document.getElementById("service").value;
    const date = document.getElementById("bookingDate").value;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${customer}</td>
        <td>${service}</td>
        <td>${date}</td>
    `;

    bookingList.appendChild(row);
    alert("Booking created successfully");

    form.reset();
});


