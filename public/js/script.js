function loadPage(page) {
    const content = document.getElementById("content");

    if (page === "home") {
        content.innerHTML = "<h1>Welcome to Spa</h1><p>Relax and refresh</p>";
    }

    if (page === "services") {
        content.innerHTML = "<h1>Our Services</h1><p>Massage, Facial, Aroma Therapy</p>";
    }

    if (page === "booking") {
        content.innerHTML = "<h1>Book Now</h1><p>Booking form coming soon</p>";
    }
}

// โหลดหน้าแรกอัตโนมัติ
loadPage("home");