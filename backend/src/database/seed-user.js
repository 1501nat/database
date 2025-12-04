/**
 * Script tạo user mẫu với password đã hash
 * Chạy: node backend/src/database/seed-user.js
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retail_management'
  });

  try {
    // Thông tin user mẫu
    const email = 'admin@example.com';
    const password = '123456'; // Password gốc
    const role = 'admin';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kiểm tra user đã tồn tại chưa
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('User đã tồn tại, đang cập nhật password...');
      await connection.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );
      console.log('Đã cập nhật password!');
    } else {
      // Tạo user mới
      const [result] = await connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );

      const userId = result.insertId;

      // Gán role
      await connection.query(
        'INSERT INTO user_roles (user_id, role) VALUES (?, ?)',
        [userId, role]
      );

      console.log('Đã tạo user thành công!');
    }

    console.log('----------------------------');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    console.log('----------------------------');

  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await connection.end();
  }
}

seedUser();
