document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const customerList = document.getElementById('customerList');

    // โหลดข้อมูลลูกค้าทั้งหมด
    function loadCustomers() {
        fetch('/customers')
            .then(res => res.json())
            .then(data => {
                customerList.innerHTML = '';

                data.forEach(customer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${customer.name}</td>
                        <td>${customer.phone}</td>
                        <td>
                            <button onclick="deleteCustomer(${customer.id})">
                                Delete
                            </button>
                        </td>
                    `;
                    customerList.appendChild(row);
                });
            });
    }

    // บันทึกข้อมูลใหม่
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        fetch('/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone })
        })
        .then(res => res.json())
        .then(() => {
            form.reset();
            loadCustomers();
        });
    });

    loadCustomers();
});

// ฟังก์ชันลบลูกค้า
function deleteCustomer(id) {
    fetch(`/customers/${id}`, {
        method: 'DELETE'
    })
    .then(() => location.reload());
}