import express from "express";
import db from "./config/db.js"
import { configDotenv } from "dotenv";
import { sendEmail } from "./utilities/emailUtility.js";
import { otpTemplate } from "./templates/userTemplates.js";
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

app.get("/otp", (req, res) => {
    let email = "testingofashutosh@gmail.com"
    sendEmail(email, otpTemplate(405896));
})

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});