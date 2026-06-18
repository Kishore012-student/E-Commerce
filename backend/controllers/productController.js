const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getProducts = asyncHandler(async (req, res, next) => {
  const resultsPerPage = 12;
  const totalProducts = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find().populate('category'), req.query)
    .search()
    .filter()
    .sort()
    .paginate(resultsPerPage);

  const products = await apiFeatures.query;
  const filteredCount = products.length;

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    resultsPerPage,
    products,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' },
    });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted',
  });
});

exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true })
    .populate('category')
    .limit(8);

  res.status(200).json({
    success: true,
    products,
  });
});

exports.getTrendingProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isTrending: true })
    .populate('category')
    .limit(8);

  res.status(200).json({
    success: true,
    products,
  });
});

exports.getNewArrivals = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isNewArrival: true })
    .populate('category')
    .sort('-createdAt')
    .limit(8);

  res.status(200).json({
    success: true,
    products,
  });
});

exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const products = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .populate('category')
    .limit(5);

  res.status(200).json({
    success: true,
    products,
  });
});

exports.createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const isReviewed = product.reviews?.find(
    (r) => r.user?.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.rating = rating;
        r.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(200).json({
    success: true,
    message: 'Review added',
  });
});

exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name avatar' },
  });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;
  const ratings = numOfReviews > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / numOfReviews
    : 0;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted',
  });
});

exports.getAdminProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find().populate('category').sort('-createdAt');

  res.status(200).json({
    success: true,
    products,
  });
});
