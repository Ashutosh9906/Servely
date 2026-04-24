import { Schema, model } from "mongoose";

const tableSchema = new Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ["available", "occupied"],
    default: "available"
  }

}, { timestamps: true });

const Table = model("tables", tableSchema);

export default Table;