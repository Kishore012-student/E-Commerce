const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

router.post(
  '/image',
  protect,
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      url,
      public_id: req.file.filename,
    });
  })
);

router.post(
  '/images',
  protect,
  upload.array('images', 10),
  asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload files', 400));
    }
    const files = req.files.map((file) => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      public_id: file.filename,
    }));
    res.status(200).json({
      success: true,
      files,
    });
  })
);

module.exports = router;
