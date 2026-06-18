const Coupon = require('../models/couponModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.createCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    coupon,
  });
});

exports.getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find().sort('-createdAt');

  res.status(200).json({
    success: true,
    coupons,
  });
});

exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

exports.updateCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    coupon,
  });
});

exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Coupon deleted',
  });
});

exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, cartTotal } = req.body;

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: Date.now() },
    validUntil: { $gte: Date.now() },
  });

  if (!coupon) {
    return next(new ErrorResponse('Invalid or expired coupon', 400));
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return next(new ErrorResponse('Coupon usage limit reached', 400));
  }

  if (cartTotal < coupon.minCartValue) {
    return next(
      new ErrorResponse(
        `Minimum cart value of ₹${coupon.minCartValue} required`,
        400
      )
    );
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.status(200).json({
    success: true,
    coupon,
    discount,
  });
});
