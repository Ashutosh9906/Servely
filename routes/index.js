const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const { requireAuth, checkUser } = require('../middleware/auth');

// Apply checkUser to all incoming routes
router.use(checkUser);

router.get('/', appController.home_get);
router.get('/menu', appController.menu_get);

// We can mock an order placement route
router.post('/order', requireAuth, appController.order_post);

module.exports = router;
