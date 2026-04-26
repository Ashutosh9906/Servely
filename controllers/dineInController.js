import Cart from "../models/cartModel.js";
import Table from "../models/tableModel.js";
import Menu from "../models/menuModel.js";
import OrderQueue from "../models/orderQueueModel.js";
import { handleResonse } from "../utilities/userUtility.js";

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });

    res.status(200).json({
      message: "All tables fetched successfully",
      count: tables.length,
      tables,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tables",
      error: error.message,
    });
  }
};

export const selectTable = async (req, res) => {
  try {
    const { tableId } = req.body;
    const userId = req.user.userId;

    const table = await Table.findById(tableId);

    if (!table || table.status === "occupied") {
      return handleResonse(res, 400, "Table not available");
    }

    table.status = "occupied";
    await table.save();

    const cart = await Cart.create({
      userId,
      tableId,
      items: [],
    });

    return handleResonse(res, 200, "Table selected", cart);
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { cartId, dishId, quantity } = req.body;

    const cart = await Cart.findById(cartId);
    const dish = await Menu.findById(dishId);

    if (!cart || !dish) {
      return handleResonse(res, 404, "Cart or dish not found");
    }

    // ✅ ALWAYS PUSH NEW ITEM (no checking)
    cart.items.push({
      dishId,
      name: dish.name,
      price: dish.price,
      quantity,
    });

    await cart.save();

    const table = await Table.findById(cart.tableId);

    // ✅ ALWAYS CREATE NEW ENTRY IN QUEUE
    await OrderQueue.create({
      tableNumber: table.tableNumber,
      items: [
        {
          name: dish.name,
          quantity,
        },
      ],
    });

    return handleResonse(res, 200, "Item added", cart);
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const getOrdersForStaff = async (req, res) => {
  try {
    const orders = await OrderQueue.find({ status: "pending" });

    return handleResonse(res, 200, "Orders fetched", orders);
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};

export const markOrderServed = async (req, res) => {
  try {
    const { orderId } = req.params;

    await OrderQueue.findByIdAndUpdate(orderId, {
      status: "served",
    });

    return handleResonse(res, 200, "Order served");
  } catch (err) {
    return handleResonse(res, 500, "Server error");
  }
};

import Membership from "../models/membershipModel.js";

export const checkout = async (req, res) => {
  try {
    const { cartId } = req.body;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return handleResonse(res, 404, "Cart not found");
    }

    // 🧮 Calculate total
    let total = 0;

    cart.items.forEach((item) => {
      total += item.price * item.quantity;
    });

    // 💎 Check membership
    const membership = await Membership.findOne({
      userId: cart.userId,
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

    // ✅ Mark cart completed
    cart.status = "completed";
    await cart.save();

    // 🪑 Free table
    await Table.findByIdAndUpdate(cart.tableId, {
      status: "available",
    });

    return handleResonse(res, 200, "Checkout successful", {
      totalAmount: total,
      discount: discount + "%",
      discountAmount,
      finalAmount,
    });
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderQueue.findById(orderId);

    if (!order) {
      return handleResonse(res, 404, "Order not found");
    }

    // ⏳ Time check (2 minutes)
    const now = new Date();
    const createdAt = new Date(order.createdAt);

    const diffInSeconds = (now - createdAt) / 1000;

    if (diffInSeconds > 120) {
      return handleResonse(res, 400, "Cannot cancel order after 2 minutes");
    }

    // ❌ Only pending orders can be cancelled
    if (order.status !== "pending") {
      return handleResonse(res, 400, "Order already processed");
    }

    // 🗑️ Delete order from queue
    order.status = "cancelled";
    await order.save();

    return handleResonse(res, 200, "Order cancelled successfully");
  } catch (err) {
    console.log(err);
    return handleResonse(res, 500, "Server error");
  }
};
