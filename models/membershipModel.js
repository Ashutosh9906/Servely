import { Schema, model } from "mongoose";

const membershipSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  type: {
    type: String,
    enum: ["silver", "gold", "platinum"],
    required: true
  },

  duration: {
    type: Number, // months (3, 6, 12)
    required: true
  },

  discount: {
    type: Number // percentage
  },

  startDate: {
    type: Date,
    default: Date.now
  },

  endDate: {
    type: Date
  },

  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active"
  }

}, { timestamps: true });

const Membership = model("memberships", membershipSchema);

export default Membership;