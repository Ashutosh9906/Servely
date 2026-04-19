const MenuItem = require('../models/MenuItem');

exports.home_get = (req, res) => {
  res.render('pages/home');
};

exports.menu_get = async (req, res) => {
  try {
    const items = await MenuItem.find();
    // Group by category if we want, or do it in the view
    const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages'];
    res.render('pages/menu', { items, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.order_post = (req, res) => {
  // Mock order processing
  const { cartItems, total } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  // In a real app we would save to an Order model here
  res.status(200).json({ message: 'Order placed successfully!', total });
};
