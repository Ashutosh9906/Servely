const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

router.get('/register', authController.register_get);
router.post('/register', authController.register_post);

router.get('/verify-otp', authController.verify_otp_get);
router.post('/verify-otp', authController.verify_otp_post);

router.get('/logout', authController.logout_get);

module.exports = router;
