// import Parcel from "../models/parcelModel.js";
// import Menu from "../models/menuModel.js";

let parcelCounter = 1; // simple counter (later improve)

import Parcel from "../models/parcelModel.js";
import Menu from "../models/menuModel.js";
import Membership from "../models/membershipModel.js";
import User from "../models/userModel.js";
import { handleResonse } from "../utilities/userUtility.js";

export const createParcelOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const user = req.user;

    let total = 0;
    let formattedItems = [];

    for (let item of items) {
      const dish = await Menu.findById(item.dishId);

      if (!dish) continue;

      const itemTotal = dish.price * item.quantity;
      total += itemTotal;

      formattedItems.push({
        dishId: dish._id,
        name: dish.name,
        price: dish.price,
        quantity: item.quantity,
      });
    }

    // ❌ no items
    if (formattedItems.length === 0) {
      return handleResonse(res, 400, "No valid items in order");
    }

    // 💎 MEMBERSHIP
    const membership = await Membership.findOne({
      userId: user.userId,
      status: "active",
    });

    let discount = 0;
    let discountAmount = 0;
    let finalAmount = total;

    if (membership) {
      discount = membership.discount;
      discountAmount = (total * discount) / 100;
      finalAmount = total - discountAmount;
    }

    // 👤 FETCH USER
    const fullUser = await User.findById(user.userId);

    // 🔢 SAFE PARCEL NUMBER
    const count = await Parcel.countDocuments();
    const parcelNumber = count + 1;

    const parcel = await Parcel.create({
      userId: user.userId,
      customerName: fullUser.firstName,
      email: fullUser.email,
      items: formattedItems,
      totalAmount: total,
      finalAmount,
      discount,
      parcelNumber,
      status: "pending",
    });

    return handleResonse(res, 201, "Parcel order created", {
      parcel,
      bill: {
        totalAmount: total,
        discount: discount + "%",
        discountAmount,
        finalAmount,
      },
    });
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const getParcelOrders = async (req, res) => {
  try {
    const orders = await Parcel.find({ status: "pending" });

    return handleResonse(res, 200, "Parcel orders", orders);
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};

export const updateParcelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Parcel.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" },
    );

    return handleResonse(res, 200, "Status updated", updated);
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};

export const getUserParcels = async (req, res) => {
  try {
    const userId = req.user.userId;

    const parcels = await Parcel.find({ userId });

    return handleResonse(res, 200, "Your orders", parcels);
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};
