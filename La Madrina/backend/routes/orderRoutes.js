const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
  getMyOrders,
  getOrderAnalytics,
  getScheduledOrders
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
], trackOrder);

// Analytics routes (admin only)
router.get('/analytics', [
  protect,
  authorize('admin')
], getOrderAnalytics);

// Scheduled orders
router.get('/scheduled', [
  protect,
  authorize('admin', 'manager', 'baker')
], getScheduledOrders);

router.route('/:id')
  .get([
    protect,
    authorize('admin', 'manager', 'baker'),
    ...validationRules.mongoId
  ], getOrderById);

// Update order status
router.put('/:id/status', [
  protect,
  authorize('admin', 'manager', 'baker'),
  ...validationRules.mongoId,
  ...validationRules.updateOrderStatus
], updateOrderStatus);

module.exports = router;
