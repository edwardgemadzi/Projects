const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerAnalytics,
  addCustomerNote,
  updateCustomerLoyalty,
  assignCustomer
} = require('../controllers/customerController');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Customer routes
router.get('/', getCustomers);
router.get('/analytics', getCustomerAnalytics);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
router.post('/:id/notes', addCustomerNote);
router.put('/:id/loyalty', updateCustomerLoyalty);
router.put('/:id/assign', assignCustomer);

module.exports = router; 