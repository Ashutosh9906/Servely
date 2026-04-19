import express from "express";


import { loginUser, registerUser, sendOtp, verifyOtp } from "../controllers/userController.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// 🔥 Apply limiter ONLY to OTP route
router.post("/send-otp", otpLimiter, sendOtp);

// Other routes (no limiter)
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;