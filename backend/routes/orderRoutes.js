const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyOrders);
router.get('/admin', protect, authorize('admin'), getAllOrders);

router.route('/')
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, getOrderDetails)
  .delete(protect, authorize('admin'), deleteOrder);

router.put('/cancel/:id', protect, cancelOrder);
router.put('/admin/status/:id', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
