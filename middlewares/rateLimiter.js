// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// 🔥 OTP limiter (strict)
export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // max 3 requests per window
    message: {
        status: 429,
        message: "Too many OTP requests. Please try again after 5 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});