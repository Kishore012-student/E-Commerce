const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorize('admin'), getAllUsers);
router.get('/admin/:id', protect, authorize('admin'), getUser);

router.put('/admin/role/:id', protect, authorize('admin'), updateUserRole);
router.delete('/admin/:id', protect, authorize('admin'), deleteUser);

router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

module.exports = router;
