import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { errorHandling } from "./middlewares/errorHandler.js";
import { resolve } from "path";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from "./routers/userRoutes.js";
import menuRoutes from "./routers/menuRoutes.js";

//connecting to mongoDB
mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", resolve("./views"));
app.use(express.json());
app.use(errorHandling);

// Example route
app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});