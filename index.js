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

import authRoutes from "./routers/userRoutes.js";

app.use(express.json());
app.use(errorHandling);

// Example route
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});