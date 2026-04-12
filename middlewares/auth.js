import { verifyToken } from "../utils/jwt.js";

export const authenticateUser = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized - No token"
            });
        }

        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            status: 401,
            message: "Invalid or expired token"
        });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // ✅ Check if user exists (after auth middleware)
            if (!req.user) {
                return handleResonse(res, 401, "Unauthorized");
            }

            const userRole = req.user.role;

            // ❌ No role in token (edge case)
            if (!userRole) {
                return handleResonse(res, 403, "Forbidden - No role assigned");
            }

            // ❌ Role not allowed
            if (!allowedRoles.includes(userRole)) {
                return handleResonse(
                    res,
                    403,
                    `Forbidden - Requires role: ${allowedRoles.join(", ")}`
                );
            }

            // ✅ Access granted
            next();

        } catch (err) {
            return handleResonse(res, 500, "Authorization error");
        }
    };
};