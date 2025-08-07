const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getInventoryOverview,
  updateStock,
  bulkStockUpdate,
  getStockAlerts,
  getSuppliers,
  updateSupplier,
  getInventoryMovement
} = require('../controllers/inventoryController');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Inventory routes
router.get('/overview', getInventoryOverview);
router.put('/stock/:id', updateStock);
router.put('/bulk-update', bulkStockUpdate);
router.get('/alerts', getStockAlerts);
router.get('/suppliers', getSuppliers);
router.put('/supplier/:id', updateSupplier);
router.get('/movement', getInventoryMovement);

module.exports = router; 