const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ owner: userId });
  if (!cart) {
    cart = await Cart.create({ owner: userId, items: [] });
  }
  return cart;
}

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate('items.product');
  res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((i) => i.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate('items.product');
  res.status(201).json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);

  if (!item) {
    const err = new Error('Item not in cart');
    err.statusCode = 404;
    throw err;
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
