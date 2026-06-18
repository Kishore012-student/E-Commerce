const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
    'products',
    'title price images ratings stock'
  );

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      wishlist: { products: [] },
    });
  }

  res.status(200).json({
    success: true,
    wishlist,
  });
});

exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: [productId],
    });
  } else {
    if (wishlist.products.includes(productId)) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }

  await wishlist.populate('products', 'title price images ratings stock');

  res.status(200).json({
    success: true,
    wishlist,
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== req.params.id
  );

  await wishlist.save();

  await wishlist.populate('products', 'title price images ratings stock');

  res.status(200).json({
    success: true,
    wishlist,
  });
});
