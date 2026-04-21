import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { errorHandling } from "./middlewares/errorHandler.js";
import { resolve } from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from "./routers/userRoutes.js";
import menuRoutes from "./routers/menuRoutes.js";
import parcelRoutes from "./routers/parcelRoutes.js";
import dineInRoutes from "./routers/dineInRoutes.js";

//connecting to mongoDB
mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", resolve("./views"));
app.use(express.json());
app.use(errorHandling);
app.use(cookieParser());

// Example route
app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/dine-in", dineInRoutes);
app.use("/parcel", parcelRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});