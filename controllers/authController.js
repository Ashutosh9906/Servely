const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

exports.register_get = (req, res) => {
  res.render('pages/register', { error: null });
};

exports.register_post = async (req, res) => {
  const { fullName, email, age, phoneNumber, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('pages/register', { error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const user = await User.create({
      fullName,
      email,
      age,
      phoneNumber,
      password: hashedPassword,
      otp,
      isVerified: false
    });

    // MOCK EMAIL SENDING
    console.log(`\n\n=== OTP EMAIL ===\nTo: ${email}\nYour Restaurant Verification Code is: ${otp}\n=================\n\n`);

    res.redirect(`/auth/verify-otp?email=${email}`);
  } catch (err) {
    console.error(err);
    res.render('pages/register', { error: 'Error creating account. Check inputs.' });
  }
};

exports.verify_otp_get = (req, res) => {
  const email = req.query.email;
  if (!email) return res.redirect('/auth/register');
  res.render('pages/verify-otp', { email, error: null });
};

exports.verify_otp_post = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.render('pages/verify-otp', { email, error: 'User not found' });
    
    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.redirect('/');
    } else {
      res.render('pages/verify-otp', { email, error: 'Invalid OTP' });
    }
  } catch (err) {
    console.error(err);
    res.render('pages/verify-otp', { email, error: 'Server error' });
  }
};

exports.login_get = (req, res) => {
  res.render('pages/login', { error: null });
};

exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        if (!user.isVerified) {
          return res.render('pages/login', { error: 'Please verify your email first via OTP' });
        }
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.redirect('/');
      }
    }
    res.render('pages/login', { error: 'Invalid email or password' });
  } catch (err) {
    res.render('pages/login', { error: 'Login error' });
  }
};

exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
