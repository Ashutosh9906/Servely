import express from "express";
import db from "./config/db.js"
import { configDotenv } from "dotenv";
import { sendEmail } from "./utilities/emailUtility.js";
import { otpTemplate } from "./templates/userTemplates.js";
import { errorHandling } from "./middlewares/errorHandler.js";
import { getAllUsersService, getUserByIdService } from "./models/userModel.js";
import { handleResonse } from "./utilities/userUtility.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(errorHandling);

// Example route
app.get("/users", async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    return handleResonse(res, 200, "All users", users);
  } catch (error) {
    next(error);
  }
});

app.get("/user", async (req, res, next) => {
  try {
    const user = await getUserByIdService(1);
    return handleResonse(res, 200, "User with id 1", user);
  } catch (error) {
    next(error);
  }
})

app.get("/otp", (req, res) => {
    let email = "testingofashutosh@gmail.com"
    sendEmail(email, otpTemplate(405896));
})

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});