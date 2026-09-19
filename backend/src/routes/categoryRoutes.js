const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, adminOnly, createCategory);
router.patch('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
