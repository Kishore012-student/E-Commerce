const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingAddress,
    paymentMethod,
    couponCode,
  } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product',
    'title price images stock'
  );

  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400));
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (product.stock < item.quantity) {
      return next(
        new ErrorResponse(`Insufficient stock for ${product.title}`, 400)
      );
    }
  }

  let itemsPrice = cart.totalPrice;
  let discount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
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

    if (itemsPrice < coupon.minCartValue) {
      return next(
        new ErrorResponse(
          `Minimum cart value of ${coupon.minCartValue} required`,
          400
        )
      );
    }

    if (coupon.discountType === 'percentage') {
      discount = (itemsPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    coupon.usedCount += 1;
    await coupon.save();
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  const taxPrice = 0;
  const totalPrice = itemsPrice - discount + shippingPrice + taxPrice;

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    price: item.price,
    quantity: item.quantity,
    image: item.product.images[0]?.url || '',
  }));

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    coupon: couponCode ? { code: couponCode, discount } : undefined,
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (order.orderStatus !== 'pending') {
    return next(new ErrorResponse('Order cannot be cancelled at this stage', 400));
  }

  order.orderStatus = 'cancelled';

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt');

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.orderStatus = req.body.status;

  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Order deleted',
  });
});
