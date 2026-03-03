const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// กำหนดให้ใช้โฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// เปิด server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});