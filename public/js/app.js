const form = document.getElementById(”bookingForm“);
const bookingList = document.getElementById(”bookingList“);

form.addEventListener(”submit“, function(e) {
    e.preventDefault();

    const customer = document.getElementById(”customersSelect“).value;
    const service = document.getElementById(”service“).value;
    const date = document.getElementById(”bookingDate“).value;

    const row = document.createElement(”tr“);

    row.innerHTML = `
        <td>${customer}</td>
        <td>${service}</td>
        <td>${date}</td>
    `;

    bookingList.appendChild(row);

    form.reset();
});


