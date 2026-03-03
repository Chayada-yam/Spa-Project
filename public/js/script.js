document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const customerSelect = document.getElementById('customerSelect');
    const bookingList = document.getElementById('bookingList');

    // โหลดลูกค้าใส่ dropdown
    function loadCustomers() {
        fetch('/customers')
            .then(res => res.json())
            .then(data => {
                customerSelect.innerHTML = '<option value="">Select Customer</option>';
                data.forEach(customer => {
                    const option = document.createElement('option');
                    option.value = customer.id;
                    option.textContent = customer.name;
                    customerSelect.appendChild(option);
                });
            });
    }

    // โหลดรายการจอง
    function loadBookings() {
        fetch('/bookings')
            .then(res => res.json())
            .then(data => {
                bookingList.innerHTML = '';
                data.forEach(booking => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${booking.name}</td>
                        <td>${booking.service}</td>
                        <td>${booking.booking_date}</td>
                    `;
                    bookingList.appendChild(row);
                });
            });
    }

    // บันทึกการจอง
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const customer_id = customerSelect.value;
        const service = document.getElementById('service').value;
        const booking_date = document.getElementById('bookingDate').value;

        fetch('/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id, service, booking_date })
        })
        .then(res => res.json())
        .then(() => {
            form.reset();
            loadBookings();
        });
    });

    loadCustomers();
    loadBookings();
});