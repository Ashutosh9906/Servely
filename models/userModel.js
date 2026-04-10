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