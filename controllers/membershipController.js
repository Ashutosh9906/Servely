import Membership from "../models/membershipModel";
import { handleResonse } from "../utilities/userUtility";

export const createMembership = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, duration } = req.body;

    // ❌ Already active
    const existing = await Membership.findOne({
      userId,
      status: "active"
    });

    if (existing) {
      return handleResonse(res, 400, "Membership already active");
    }

    // 🎯 Discount logic
    let discount = 0;

    switch (type) {
      case "silver":
        discount = 10;
        break;
      case "gold":
        discount = 15;
        break;
      case "platinum":
        discount = 20; // 🔥 highest tier
        break;
      default:
        return handleResonse(res, 400, "Invalid membership type");
    }

    // 📅 Dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const membership = await Membership.create({
      userId,
      type,
      duration,
      discount,
      startDate,
      endDate
    });

    return handleResonse(res, 201, "Membership created", membership);

  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};