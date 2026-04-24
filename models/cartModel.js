import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },

  tableId: {
    type: Schema.Types.ObjectId,
    ref: "tables",
    required: true
  },

  items: [
    {
      dishId: {
        type: Schema.Types.ObjectId,
        ref: "menus"
      },
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  }

}, { timestamps: true });

const Cart = model("carts", cartSchema);

export default Cart;