import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password', // ต้องตรงกับใน docker-compose.yml
  database: 'spa_db'
});