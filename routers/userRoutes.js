// routes/authRoutes.js
import express from "express";
import { completeProfile, loginUser, sendOtp, verifyOtp } from "../controllers/userController.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", completeProfile);
router.post("/login", loginUser);

export default router;