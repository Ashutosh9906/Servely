import { createId } from "@paralleldrive/cuid2";
import { checkVerifiedEmail, createUser, getUserByEmail, getVerification, markUsed, markVerified, upsertEmailVerification } from "../models/userModel.js";
import { comparePassword, createToken, generateOTP, getExpiryTime, handleResonse, hashPassword } from "../utilities/userUtility.js";
import { otpTemplate } from "../templates/userTemplates.js";
import { sendEmail } from "../utilities/emailUtility.js";

export const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        // ✅ Validation
        if (!email) {
            return handleResonse(res, 400, "Email is required");
        }

        // ✅ Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return handleResonse(res, 400, "User already exists, please login");
        }

        const otp = generateOTP();
        const expiry = getExpiryTime();

        await upsertEmailVerification(createId(), email, otp, expiry);

        await sendEmail(email, otpTemplate(otp));

        handleResonse(res, 200, "OTP sent successfully");

    } catch (err) {
        next(err);
    }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // ✅ Validation
        if (!email || !otp) {
            return handleResonse(res, 400, "Email and OTP are required");
        }

        const record = await getVerification(email, otp);

        // ❌ Invalid OTP
        if (!record) {
            return handleResonse(res, 400, "Invalid or expired OTP");
        }

        // ❌ Already used
        if (record.is_used) {
            return handleResonse(res, 400, "OTP already used");
        }

        // ❌ Already verified
        if (record.is_verified) {
            return handleResonse(res, 400, "Email already verified");
        }

        // ❌ Expired (extra safety)
        if (new Date(record.expiry_time) < new Date()) {
            return handleResonse(res, 400, "OTP expired");
        }

        await markVerified(email);

        handleResonse(res, 200, "Email verified successfully");

    } catch (err) {
        next(err);
    }
};

export const completeProfile = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // ✅ Validation
        if (!name || !email || !password) {
            return handleResonse(res, 400, "All required fields must be provided");
        }

        // ✅ Already exists check
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return handleResonse(res, 400, "User already exists, please login");
        }

        // ✅ Check verification
        const verified = await checkVerifiedEmail(email);

        if (!verified) {
            return handleResonse(res, 403, "Email not verified or OTP expired");
        }

        if (verified.is_used) {
            return handleResonse(res, 400, "Verification already used");
        }

        // ✅ Hash password
        const hashedPassword = await hashPassword(password);

        // ✅ Create user
        const userId = createId();

        await createUser(userId, name, email, hashedPassword, phone);

        // ✅ Mark OTP used
        await markUsed(email);

        // ✅ Create JWT
        const token = createToken({
            user_id: userId,
            role: "customer"
        });

        // ✅ Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // 🔒 set true in production
            sameSite: "lax",
            maxAge: 1.5 * 60 * 60 * 1000 // 1.5 hours
        });

        handleResonse(res, 201, "Account created & logged in successfully", {
            user_id: userId,
            email,
            role: "customer"
        });

    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handleResonse(res, 400, "Email and password are required");
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return handleResonse(res, 401, "Invalid credentials");
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return handleResonse(res, 401, "Invalid credentials");
        }

        // ✅ FIXED: pass full object
        const token = createToken({
            user_id: user.user_id,
            role: user.role
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // 🔒 true in production
            sameSite: "lax",
            maxAge: 1.5 * 60 * 60 * 1000
        });

        handleResonse(res, 200, "Login successful", {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        next(err);
    }
};