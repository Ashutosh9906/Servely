const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const MenuItem = require('./models/MenuItem'); // Added model for seeding

// Load env vars
dotenv.config();

const app = express();

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('MongoDB Connected successfully.');
  
  // Seed Database if empty
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    console.log('Database empty, seeding menu items...');
    await MenuItem.insertMany([
      // Starters
      { name: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, basil, garlic and olive oil drizzle.', price: 12.99, category: 'Starters', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=500&q=80' },
      { name: 'Caesar Salad', description: 'Crisp romaine lettuce with parmesan, croutons and house-made dressing.', price: 14.50, category: 'Starters', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=500&q=80' },
      { name: 'Garlic Shrimp', description: 'Succulent shrimp sautéed in garlic butter with fresh herbs.', price: 18.99, category: 'Starters', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=500&q=80' },
      // Main Course
      { name: 'Grilled Salmon', description: 'Atlantic salmon fillet with lemon herb butter sauce and seasonal veggies.', price: 28.50, category: 'Main Course', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80' },
      { name: 'Wagyu Ribeye Steak', description: 'Premium 12oz ribeye cooked to perfection with truffle mashed potatoes.', price: 45.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80' },
      { name: 'Margherita Pizza', description: 'Classic Neapolitan-style pizza with San Marzano tomatoes and fresh mozzarella.', price: 19.99, category: 'Main Course', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80' },
      // Desserts
      { name: 'Tiramisu', description: 'Classic Italian layered dessert with espresso-soaked ladyfingers and mascarpone.', price: 12.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80' },
      { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten center, served with vanilla ice cream.', price: 14.50, category: 'Desserts', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80' },
      { name: 'Crème Brûlée', description: 'Silky vanilla custard topped with a crackling caramelized sugar crust.', price: 11.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=500&q=80' },
      // Beverages
      { name: 'Fresh Mango Smoothie', description: 'Blended ripe mango with yogurt and a hint of honey.', price: 7.99, category: 'Beverages', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80' },
      { name: 'Iced Matcha Latte', description: 'Premium ceremonial-grade Japanese matcha with oat milk over ice.', price: 6.99, category: 'Beverages', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=500&q=80' },
      { name: 'Classic Mojito', description: 'Refreshing cocktail with fresh mint, lime, rum and sparkling soda.', price: 10.99, category: 'Beverages', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=500&q=80' }
    ]);
    console.log('Seeding complete.');
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files & View Engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

// Use Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
