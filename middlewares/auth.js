import { handleResonse, verifyToken } from "../utilities/userUtility.js";
import User from "../models/userModel.js";

export const checkUser = async (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      res.locals.user = user;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

export const authenticateUser = (req, res, next) => {
  try {
    // ✅ Token from cookies (fallback to header optional)
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return handleResonse(res, 401, "Unauthorized - No token");
    }

    // ✅ Verify token using your utility
    const decoded = verifyToken(token);

    // decoded = { userId, role }
    req.user = decoded;

    next();
  } catch (err) {
    return handleResonse(res, 401, "Invalid or expired token");
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // ❌ No user (auth not applied)
      if (!req.user) {
        return handleResonse(res, 401, "Unauthorized");
      }

      const userRole = req.user.role;

      // ❌ Role missing in token
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

      // ✅ Allowed
      next();
    } catch (err) {
      return handleResonse(res, 500, "Authorization error");
    }
  };
};