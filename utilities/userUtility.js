import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export const handleResonse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getExpiryTime = (minutes = 5) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};

export const createToken = (user) => {
    return jwt.sign(
        {
            userId: user.user_id,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "1.5h" }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};