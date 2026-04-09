import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection(
  process.env.MYSQL_URL
);

connection.connect((err) => {
  if (err) {
    console.error("DB Connection Failed:", err);
  } else {
    console.log("Connected to Railway MySQL 🚀");
  }
});

export default connection;