const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Not authorized, no token provided');
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    const err = new Error('Not authorized, token invalid or expired');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    const err = new Error('Not authorized, user no longer exists');
    err.statusCode = 401;
    throw err;
  }

  req.user = user;
  next();
});

module.exports = protect;
