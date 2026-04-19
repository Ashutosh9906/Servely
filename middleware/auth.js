const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if JWT exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        let user = await User.findById(decodedToken.id);
        req.user = user;
        // make user accessible in views
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// Middleware to expose user to all routes nicely, even if not logged in
exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        req.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        req.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    req.user = null;
    next();
  }
};
