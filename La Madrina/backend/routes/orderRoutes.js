const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  getUserOrders,
  getMyOrders,
  getOrderForTracking,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');
const { rateLimiters } = require('../middleware/security');

const router = express.Router();

router.route('/')
  .post([
    rateLimiters.orders,
    optionalAuth,
    ...validationRules.createOrder
  ], createOrder)
  .get([
    protect,
    authorize('admin', 'manager', 'baker')
  ], getOrders);

// Get current user's orders - MUST be before /:id route
router.get('/my-orders', [
  protect
], getMyOrders);

// Public order tracking - limited info, no auth required
router.get('/track/:id', [
  rateLimiters.orders,
  ...validationRules.mongoId
], getOrderForTracking);

router.route('/:id')
  .get([
    protect,
    authorize('admin', 'manager', 'baker'),
    ...validationRules.mongoId
  ], getOrder);

// Update order status
router.put('/:id/status', [
  protect,
  authorize('admin', 'manager', 'baker'),
  ...validationRules.mongoId,
  ...validationRules.updateOrderStatus
], updateOrderStatus);

// Get specific user's orders (admin/user access)
router.route('/user/:userId')
  .get([
    protect,
    ...validationRules.mongoId
  ], getUserOrders);

module.exports = router;
