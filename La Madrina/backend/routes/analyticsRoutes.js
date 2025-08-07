const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getSalesAnalytics,
  getInventoryAnalytics,
  getCustomerAnalytics,
  exportAnalyticsData
} = require('../controllers/analyticsController');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Analytics routes
router.get('/sales', getSalesAnalytics);
router.get('/inventory', getInventoryAnalytics);
router.get('/customers', getCustomerAnalytics);
router.get('/export', exportAnalyticsData);

module.exports = router; 