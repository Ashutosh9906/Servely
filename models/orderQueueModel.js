import { Schema, model } from "mongoose";

const orderQueueSchema = new Schema({
  tableNumber: Number,

  items: [
    {
      name: String,
      quantity: Number
    }
  ],

  status: {
    type: String,
    enum: ["pending", "served", "cancelled"],
    default: "pending"
  }

}, { timestamps: true });

const OrderQueue = model("orderQueues", orderQueueSchema);

export default OrderQueue;