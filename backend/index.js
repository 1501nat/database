const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Tạo connection MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "quanlycuahang"
});

// Kiểm tra kết nối
db.connect(err => {
    if (err) {
        console.log("Kết nối DB thất bại", err);
    } else {
        console.log("Kết nối DB thành công!");
    }
});

// API đơn giản
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.json({ error: err });
        }
        res.json(results);
    });
});

app.listen(3306, () => {
    console.log("Server chạy tại http://localhost:3306");
});
