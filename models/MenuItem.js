const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Starters', 'Main Course', 'Desserts', 'Beverages'], 
    required: true 
  },
  image: { type: String, required: true } // URL or path to image
});

module.exports = mongoose.model('MenuItem', menuSchema);
