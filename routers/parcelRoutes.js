import express from "express";

import { createParcelOrder } from "../controllers/parcelController.js";
import { getParcelOrders } from "../controllers/parcelController.js";
import { updateParcelStatus } from "../controllers/parcelController.js";
import { getUserParcels } from "../controllers/parcelController.js";

import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();


// 👤 USER: Create parcel order
router.post(
  "/create",
  authenticateUser,
  createParcelOrder
);


// 👤 USER: Get own parcels
router.get(
  "/my-orders",
  authenticateUser,
  getUserParcels
);


// 👨‍🍳 STAFF: View parcel orders
router.get(
  "/staff",
  authenticateUser,
  authorizeRoles("STAFF", "ADMIN"),
  getParcelOrders
);


// 👨‍🍳 STAFF: Update status
router.put(
  "/:id/status",
  authenticateUser,
  authorizeRoles("STAFF", "ADMIN"),
  updateParcelStatus
);


export default router;