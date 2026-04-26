import express from "express";

import {
  createMembership,
  getMyMembership,
  checkMembershipStatus,
  cancelMembership,
  upgradeMembership
} from "../controllers/membershipController.js";

import { authenticateUser } from "../middlewares/auth.js";
const router = express.Router();


router.post("/purchase", authenticateUser, createMembership);

router.get("/me", authenticateUser, getMyMembership);

router.get("/status", authenticateUser, checkMembershipStatus);

router.delete("/cancel", authenticateUser, cancelMembership);

// 🔥 upgrade
router.put("/upgrade", authenticateUser, upgradeMembership);


export default router;