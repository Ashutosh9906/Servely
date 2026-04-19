import { Schema, model } from "mongoose";

const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  category: {
    type: String,
    required: true,
    enum: [
      "starter",
      "main-course",
      "dessert",
      "beverage"
    ]
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String, // Cloudinary URL (later)
  },

  isAvailable: {
    type: Boolean,
    default: true,
  }

}, { timestamps: true });

const Menu = model("menus", menuSchema);

export default Menu;