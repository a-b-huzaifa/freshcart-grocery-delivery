const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(category);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const category = await Category.create({ name, image });
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ deleted: req.params.id });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
