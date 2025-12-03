const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "quanlycuahang"
});             

db.connect(err => {
    if (err) console.log("Lỗi kết nối cơ sở dữ liệu:", err);
    else console.log("Kết nối cơ sở dữ liệu thành công!");
});
module.exports = db;