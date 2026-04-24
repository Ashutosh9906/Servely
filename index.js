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
import { checkUser } from "./middlewares/auth.js";

// DB CONNECTION
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.set("view engine", "ejs");
app.set("views", resolve("./views"));

app.use(express.json());
app.use(cookieParser());
// Static files are now inlined in templates as requested.
// app.use(express.static("public"));

app.use(checkUser);


// VIEW ROUTES
app.get("/", (req, res) => {
  res.render("pages/home");
});
app.get("/menu", (req, res) => {
  res.render("pages/menu");
});
app.get("/book-table", (req, res) => {
  res.render("pages/book-table");
});

// API ROUTES
app.use("/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/dine-in", dineInRoutes);
app.use("/api/parcel", parcelRoutes);

// ERROR HANDLER (LAST)
app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
