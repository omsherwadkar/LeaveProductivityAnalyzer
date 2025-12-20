const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Class11th99%",
  database: "attendance_db"
});

db.connect((err) => {
  if (err) {
    console.error(" MySQL connection failed:", err.message);
    return;
  }
  console.log(" MySQL connected successfully");
});

module.exports = db;
