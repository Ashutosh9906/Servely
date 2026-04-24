import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";


import { comparePassword, createToken, generateOTP, getExpiryTime, handleResonse, hashPassword } from "../utilities/userUtility.js";
import { sendEmail } from "../utilities/emailUtility.js";
import { otpTemplate } from "../templates/userTemplates.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // ❌ user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleResonse(res, 400, "User already exists");
    }

    const otp = generateOTP();
    const expiresAt = getExpiryTime(5);

    await Otp.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        isVerified: false,
        expiresAt
      },
      { upsert: true, returnDocument: "after" }
    );

    await sendEmail(email, otpTemplate(otp));

    return handleResonse(res, 200, "OTP sent");
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email });

    // ❌ no OTP found
    if (!record) {
      return handleResonse(res, 400, "OTP not found");
    }

    // ❌ expired
    if (record.expiresAt < new Date()) {
      return handleResonse(res, 400, "OTP expired");
    }

    // ❌ wrong OTP
    if (record.otp !== otp) {
      return handleResonse(res, 400, "Invalid OTP");
    }

    // ✅ verified
    record.isVerified = true;
    await record.save();

    return handleResonse(res, 200, "OTP verified");
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, address, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleResonse(res, 400, "User already exists");
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || !otpRecord.isVerified) {
      return handleResonse(res, 400, "OTP not verified");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      address,
      email,
      password: hashedPassword
    });

    await Otp.deleteOne({ email });

    // ✅ IMPORTANT: match your utility
    const token = createToken({
      user_id: user._id,
      role: user.role
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 120 * 60 * 1000
    });
    res.locals.token = req.cookies.token

    const userData = user.toObject();
    delete userData.password;

    return handleResonse(res, 201, "User created", {
      token,
      user: userData
    });

  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return handleResonse(res, 400, "Invalid credentials");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return handleResonse(res, 400, "Invalid credentials");
    }

    // ✅ IMPORTANT: match your utility
    const token = createToken({
      user_id: user._id,
      role: user.role
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000
    });
    res.locals.token = req.cookies.token

    const userData = user.toObject();
    delete userData.password;

    return handleResonse(res, 200, "Login success", {
      token,
      user: userData
    });

  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const purchaseMembership = async (req, res) => {
  try {
    const { tier } = req.body;
    const user_id = req.user.userId; 

    console.log("Purchasing membership for user:", user_id, "tier:", tier);

    const user = await User.findById(user_id);
    if (!user) {
      return handleResonse(res, 404, "User not found");
    }

    if (!["Silver", "Gold", "Platinum"].includes(tier)) {
      return handleResonse(res, 400, "Invalid membership tier");
    }

    user.membership = tier;
    await user.save();

    return handleResonse(res, 200, "Membership purchased successfully", {
      membership: user.membership
    });

  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};