const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();
router.use(protect);

// '/all' must come before '/:id' or Express treats "all" as an id.
router.get('/all', adminOnly, getAllOrders);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.delete('/:id', cancelOrder);

module.exports = router;
