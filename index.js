import express from "express";
import db from "./config/db.js"
import { configDotenv } from "dotenv";
configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

// Example route
app.get("/users", (req, res) => {
  db.query("SELECT * FROM Users", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});