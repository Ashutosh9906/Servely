import { Schema, model } from "mongoose";

const parcelSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },

  customerName: String,
  email: String,

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

  totalAmount: Number,

  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "completed"],
    default: "pending"
  },

  parcelNumber: {
    type: Number,
    unique: true
  }

}, { timestamps: true });

const Parcel = model("parcels", parcelSchema);

export default Parcel;