const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const signToken = require('../utils/signToken');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    const err = new Error('name, email, and password are all required');
    err.statusCode = 400;
    throw err;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('email already in use');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({ name, email, password, address });
  const token = signToken(user._id);

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error('email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
    token,
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address,
    },
  });
});

module.exports = { register, login, getMe };
