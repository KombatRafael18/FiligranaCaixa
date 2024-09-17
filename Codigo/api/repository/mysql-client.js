const mysql = require("mysql2/promise.js");

const pool = mysql.createPool(
  process.env.MYSQL_CONNECTION_URI || {
    host: "localhost",
    user: "root", // Use your MySQL username
    password: "root", // Use your MySQL password
    database: "client_db",
  }
);

module.exports = {
  pool,
};
