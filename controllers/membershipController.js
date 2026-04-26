import Membership from "../models/membershipModel.js";
import { handleResonse } from "../utilities/userUtility.js";

// 🎯 Centralized discount logic (BEST PRACTICE)
const getDiscount = (type) => {
  switch (type) {
    case "silver":
      return 5;
    case "gold":
      return 15;
    case "platinum":
      return 25;
    default:
      return null;
  }
};

// 💳 CREATE MEMBERSHIP
export const createMembership = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, duration } = req.body;

    const existing = await Membership.findOne({
      userId,
      status: "active",
    });

    if (existing) {
      return handleResonse(res, 400, "Membership already active");
    }

    const discount = getDiscount(type);

    if (discount === null) {
      return handleResonse(res, 400, "Invalid membership type");
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const membership = await Membership.create({
      userId,
      type,
      duration,
      discount,
      startDate,
      endDate,
      status: "active",
    });

    return handleResonse(res, 201, "Membership created", membership);
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

// 📖 GET MY MEMBERSHIP
export const getMyMembership = async (req, res) => {
  try {
    const userId = req.user.userId;

    const membership = await Membership.findOne({
      userId,
      status: "active",
    });

    if (!membership) {
      return handleResonse(res, 404, "No active membership");
    }

    return handleResonse(res, 200, "Membership fetched", membership);
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};

// 🔄 CHECK STATUS
export const checkMembershipStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    const membership = await Membership.findOne({ userId });

    if (!membership) {
      return handleResonse(res, 404, "No membership found");
    }

    const now = new Date();

    if (membership.endDate < now && membership.status === "active") {
      membership.status = "expired";
      await membership.save();
    }

    return handleResonse(res, 200, "Membership status", membership);
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};

// ❌ CANCEL MEMBERSHIP
export const cancelMembership = async (req, res) => {
  try {
    const userId = req.user.userId;

    const membership = await Membership.findOne({
      userId,
      status: "active",
    });

    if (!membership) {
      return handleResonse(res, 404, "No active membership");
    }

    membership.status = "expired";
    await membership.save();

    return handleResonse(res, 200, "Membership cancelled");
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};

// 🔥 UPGRADE MEMBERSHIP
export const upgradeMembership = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newType } = req.body;

    const membership = await Membership.findOne({
      userId,
      status: "active",
    });

    if (!membership) {
      return handleResonse(res, 404, "No active membership");
    }

    const discount = getDiscount(newType);

    if (discount === null) {
      return handleResonse(res, 400, "Invalid membership type");
    }

    membership.type = newType;
    membership.discount = discount;

    await membership.save();

    return handleResonse(res, 200, "Membership upgraded", membership);
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};
