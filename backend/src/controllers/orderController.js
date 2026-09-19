const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress } = req.body;
  if (!deliveryAddress) {
    const err = new Error('deliveryAddress is required');
    err.statusCode = 400;
    throw err;
  }

  const cart = await Cart.findOne({ owner: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      const err = new Error(`Not enough stock for "${item.product.name}"`);
      err.statusCode = 400;
      throw err;
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    unit: item.product.unit,
    quantity: item.quantity,
  }));

  const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    owner: req.user._id,
    items: orderItems,
    totalAmount,
    deliveryAddress,
  });

  await Promise.all(
    cart.items.map((item) =>
      Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
    )
  );

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  const isOwner = order.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    const err = new Error('Not authorized to view this order');
    err.statusCode = 403;
    throw err;
  }
  res.json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, owner: req.user._id });
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  if (order.status !== 'pending') {
    const err = new Error(`Cannot cancel an order that is already "${order.status}"`);
    err.statusCode = 400;
    throw err;
  }
  order.status = 'cancelled';
  await order.save();
  res.json(order);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
