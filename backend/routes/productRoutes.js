const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getRelatedProducts,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/related/:id', getRelatedProducts);
router.get('/admin', protect, authorize('admin'), getAdminProducts);
router.get('/reviews', getProductReviews);

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.put('/review/add', protect, createProductReview);
router.delete('/review/delete', protect, authorize('admin'), deleteReview);

module.exports = router;
