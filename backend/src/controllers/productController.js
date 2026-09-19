const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/products — public. Supports ?category=<id> and ?search=<text>
const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }
  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
  res.json(products);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, unit, stock, category, image } = req.body;
  const product = await Product.create({
    name,
    description,
    price,
    unit,
    stock,
    category,
    image,
    createdBy: req.user._id,
  });
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ deleted: req.params.id });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
