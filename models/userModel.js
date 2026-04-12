import pool from "../config/db.js";

export const getAllUsersService = async () => {
    const [rows] = await pool.query("SELECT * FROM Users");
    return rows;
};

export const getUserByIdService = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM Users WHERE id = ?",
        [id]
    );
    return rows[0];
};

export const upsertEmailVerification = async (verification_id, email, otp, expiry) => {
    await pool.query(
        `INSERT INTO email_verification 
        (verification_id, email, otp_code, expiry_time)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            otp_code = VALUES(otp_code),
            expiry_time = VALUES(expiry_time),
            is_verified = FALSE,
            is_used = FALSE`,
        [verification_id, email, otp, expiry]
    );
};

export const getVerification = async (email, otp) => {
    const [rows] = await pool.query(
        `SELECT * FROM email_verification
         WHERE email = ? AND otp_code = ? 
         AND expiry_time > NOW() AND is_used = FALSE`,
        [email, otp]
    );
    return rows[0];
};

export const markVerified = async (email) => {
    await pool.query(
        `UPDATE email_verification 
         SET is_verified = TRUE 
         WHERE email = ?`,
        [email]
    );
};

export const checkVerifiedEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT * FROM email_verification
         WHERE email = ? AND is_verified = TRUE AND is_used = FALSE`,
        [email]
    );
    return rows[0];
};

export const createUser = async (user_id, name, email, password, phone) => {
    await pool.query(
        `INSERT INTO users (user_id, name, email, password, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, name, email, password, phone]
    );
};

export const markUsed = async (email) => {
    await pool.query(
        `UPDATE email_verification SET is_used = TRUE WHERE email = ?`,
        [email]
    );
};

export const getUserByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
    return rows[0];
};