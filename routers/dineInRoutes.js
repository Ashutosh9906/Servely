import express from "express";
import { getAllTables, selectTable } from "../controllers/dineInController.js"; 
import { addItemToCart } from "../controllers/dineInController.js";
import { getOrdersForStaff } from "../controllers/dineInController.js";
import { markOrderServed } from "../controllers/dineInController.js";
import { cancelOrder } from "../controllers/dineInController.js";
import { checkout } from "../controllers/dineInController.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/", 
  getAllTables
);

// 🪑 USER: Select Table (start session)
router.post(
  "/table/select",
  authenticateUser,
  selectTable
);


// 🛒 USER: Add item to cart
router.post(
  "/cart/add",
  authenticateUser,
  addItemToCart
);


// 👨‍🍳 STAFF: View all pending orders
router.get(
  "/staff/orders",
  authenticateUser,
  authorizeRoles("STAFF", "ADMIN"),
  getOrdersForStaff
);


// ✅ STAFF: Mark order as served
router.put(
  "/staff/orders/:orderId/served",
  authenticateUser,
  authorizeRoles("STAFF", "ADMIN"),
  markOrderServed
);


// 💸 USER: Checkout (final bill)
router.post(
  "/checkout",
  authenticateUser,
  checkout
);


// ❌ USER: Cancel order (within time limit)
router.delete(
  "/order/:orderId/cancel",
  authenticateUser,
  cancelOrder
);

export default router;