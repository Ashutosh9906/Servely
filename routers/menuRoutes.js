import express from "express";
import {
  getAllItems,
  getFilteredMenu,
  getItemById,
  softDeleteItem,
  updateItem,
} from "../controllers/menuController.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// 📖 Public
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.get("/filter", getFilteredMenu);

// 🔒 Protected
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "STAFF"),
  updateItem,
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "STAFF"),
  softDeleteItem,
);

export default router;
