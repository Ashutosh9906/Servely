import express from "express";

import {
  loginUser,
  registerUser,
  sendOtp,
  verifyOtp,
} from "../controllers/userController.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();
router.get("/login", (req, res) => {
  res.render("pages/login");
});
router.get("/register", (req, res) => {
  res.render("pages/register");
});
router.get("/verify-otp", (req, res) => {
  const { email } = req.query;
  res.render("pages/verify-otp", { email });
});

// 🔥 Apply limiter ONLY to OTP route
router.post("/send-otp", otpLimiter, sendOtp);

// Other routes (no limiter)
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    status: 200,
    message: "Logged out",
  });
});
export default router;
