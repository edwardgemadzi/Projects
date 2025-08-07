const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get inventory overview
// @route   GET /api/inventory/overview
// @access  Private/Admin
const getInventoryOverview = async (req, res) => {
  try {
    // Low stock items
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      inStock: true
    }).select('name stock lowStockThreshold category supplier');

    // Out of stock items
    const outOfStockItems = await Product.find({
      $or: [{ stock: 0 }, { inStock: false }]
    }).select('name stock category supplier');

    // Inventory value
    const inventoryStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalCost: { $sum: { $multiply: ['$cost', '$stock'] } },
          averageProfitMargin: { $avg: '$profitMargin' }
        }
      }
    ]);

    // Category distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ['$stock', '$lowStockThreshold'] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        lowStockItems,
        outOfStockItems,
        inventoryStats: inventoryStats[0] || {
          totalItems: 0,
          totalStock: 0,
          totalValue: 0,
          totalCost: 0,
          averageProfitMargin: 0
        },
        categoryStats
      }
    });
  } catch (error) {
    console.error('Inventory overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory overview'
    });
  }
};

// @desc    Update stock levels
// @route   PUT /api/inventory/stock/:id
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, lowStockThreshold, notes } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update stock and related fields
    product.stock = stock;
    if (lowStockThreshold !== undefined) {
      product.lowStockThreshold = lowStockThreshold;
    }
    product.inStock = stock > 0;

    // Add stock update to notes if provided
    if (notes) {
      product.notes = product.notes ? `${product.notes}\n${new Date().toISOString()}: ${notes}` : notes;
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
      message: 'Stock updated successfully'
    });
  } catch (error) {
    console.error('Stock update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stock'
    });
  }
};

// @desc    Bulk stock update
// @route   PUT /api/inventory/bulk-update
// @access  Private/Admin
const bulkStockUpdate = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const { productId, stock, lowStockThreshold, notes } = update;
        
        const product = await Product.findById(productId);
        if (!product) {
          errors.push({ productId, error: 'Product not found' });
          continue;
        }

        product.stock = stock;
        if (lowStockThreshold !== undefined) {
          product.lowStockThreshold = lowStockThreshold;
        }
        product.inStock = stock > 0;

        if (notes) {
          product.notes = product.notes ? `${product.notes}\n${new Date().toISOString()}: ${notes}` : notes;
        }

        await product.save();
        results.push({ productId, name: product.name, stock: product.stock });
      } catch (error) {
        errors.push({ productId: update.productId, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        updated: results,
        errors
      },
      message: `Updated ${results.length} products, ${errors.length} errors`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing bulk update'
    });
  }
};

// @desc    Get stock alerts
// @route   GET /api/inventory/alerts
// @access  Private/Admin
const getStockAlerts = async (req, res) => {
  try {
    const { type = 'all' } = req.query;

    let query = {};
    
    switch (type) {
      case 'low':
        query = {
          $expr: { $lte: ['$stock', '$lowStockThreshold'] },
          inStock: true
        };
        break;
      case 'out':
        query = {
          $or: [{ stock: 0 }, { inStock: false }]
        };
        break;
      case 'all':
      default:
        query = {
          $or: [
            { $expr: { $lte: ['$stock', '$lowStockThreshold'] } },
            { stock: 0 },
            { inStock: false }
          ]
        };
    }

    const alerts = await Product.find(query)
      .select('name stock lowStockThreshold category supplier image')
      .sort({ stock: 1 });

    res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error('Stock alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock alerts'
    });
  }
};

// @desc    Get supplier information
// @route   GET /api/inventory/suppliers
// @access  Private/Admin
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Product.aggregate([
      {
        $match: {
          'supplier.name': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$supplier.name',
          supplier: { $first: '$supplier' },
          products: { $push: '$$ROOT' },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      },
      {
        $sort: { totalProducts: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error('Suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suppliers'
    });
  }
};

// @desc    Update supplier information
// @route   PUT /api/inventory/supplier/:id
// @access  Private/Admin
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.supplier = supplier;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
      message: 'Supplier information updated'
    });
  } catch (error) {
    console.error('Supplier update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating supplier information'
    });
  }
};

// @desc    Get inventory movement
// @route   GET /api/inventory/movement
// @access  Private/Admin
const getInventoryMovement = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get products sold in the period
    const soldProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo }, status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } }
    ]);

    // Get current stock levels
    const currentStock = await Product.find()
      .select('name stock category price')
      .sort({ stock: 1 });

    res.status(200).json({
      success: true,
      data: {
        soldProducts,
        currentStock,
        period: {
          start: daysAgo,
          end: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Inventory movement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory movement'
    });
  }
};

module.exports = {
  getInventoryOverview,
  updateStock,
  bulkStockUpdate,
  getStockAlerts,
  getSuppliers,
  updateSupplier,
  getInventoryMovement
}; 