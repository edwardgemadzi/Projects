const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30', startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      dateFilter = { createdAt: { $gte: daysAgo } };
    }

    // Total revenue and orders
    const revenueStats = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$total' },
          totalProfit: { $sum: '$totalProfit' },
          averageProfitMargin: { $avg: '$profitMargin' }
        }
      }
    ]);

    // Daily sales trend
    const dailySales = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          profit: { $sum: '$totalProfit' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalProfit: { $sum: { $multiply: ['$items.profit', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Category performance
    const categoryPerformance = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalSold: { $sum: '$items.quantity' },
          totalProfit: { $sum: { $multiply: ['$items.profit', '$items.quantity'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Customer analytics
    const customerStats = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customerName' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: revenueStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          totalProfit: 0,
          averageProfitMargin: 0
        },
        dailySales,
        topProducts,
        categoryPerformance,
        customerStats,
        orderStatusDistribution,
        period: {
          start: startDate || new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000),
          end: endDate || new Date()
        }
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics'
    });
  }
};

// @desc    Get inventory analytics
// @route   GET /api/analytics/inventory
// @access  Private/Admin
const getInventoryAnalytics = async (req, res) => {
  try {
    // Low stock items
    const lowStockItems = await Product.find({
      stock: { $lte: '$lowStockThreshold' },
      inStock: true
    }).select('name stock lowStockThreshold category');

    // Out of stock items
    const outOfStockItems = await Product.find({
      $or: [{ stock: 0 }, { inStock: false }]
    }).select('name stock category');

    // Inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalCost: { $sum: { $multiply: ['$cost', '$stock'] } }
        }
      }
    ]);

    // Category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    // Profit margin analysis
    const profitAnalysis = await Product.aggregate([
      {
        $group: {
          _id: null,
          averageProfitMargin: { $avg: '$profitMargin' },
          totalProfit: { $sum: { $multiply: ['$profit', '$stock'] } },
          highMarginItems: {
            $sum: { $cond: [{ $gte: ['$profitMargin', 50] }, 1, 0] }
          },
          lowMarginItems: {
            $sum: { $cond: [{ $lt: ['$profitMargin', 30] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        lowStockItems,
        outOfStockItems,
        inventoryValue: inventoryValue[0] || {
          totalItems: 0,
          totalStock: 0,
          totalValue: 0,
          totalCost: 0
        },
        categoryDistribution,
        profitAnalysis: profitAnalysis[0] || {
          averageProfitMargin: 0,
          totalProfit: 0,
          highMarginItems: 0,
          lowMarginItems: 0
        }
      }
    });
  } catch (error) {
    console.error('Inventory analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory analytics'
    });
  }
};

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private/Admin
const getCustomerAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Customer acquisition
    const customerAcquisition = await User.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Customer segments
    const customerSegments = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customerName' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          averageOrderValue: { $avg: '$averageOrderValue' },
          totalRevenue: { $sum: '$totalSpent' },
          segments: {
            $push: {
              customerId: '$_id',
              customerName: '$customerName',
              totalOrders: '$totalOrders',
              totalSpent: '$totalSpent',
              averageOrderValue: '$averageOrderValue',
              segment: {
                $cond: {
                  if: { $gte: ['$totalSpent', 100] },
                  then: 'VIP',
                  else: {
                    $cond: {
                      if: { $gte: ['$totalSpent', 50] },
                      then: 'Regular',
                      else: 'New'
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    // Customer retention
    const customerRetention = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customerName' },
          orderDates: { $push: '$createdAt' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $match: { totalOrders: { $gt: 1 } }
      },
      {
        $group: {
          _id: null,
          returningCustomers: { $sum: 1 },
          averageOrdersPerCustomer: { $avg: '$totalOrders' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        customerAcquisition,
        customerSegments: customerSegments[0] || {
          totalCustomers: 0,
          averageOrderValue: 0,
          totalRevenue: 0,
          segments: []
        },
        customerRetention: customerRetention[0] || {
          returningCustomers: 0,
          averageOrdersPerCustomer: 0
        }
      }
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer analytics'
    });
  }
};

// @desc    Export analytics data
// @route   GET /api/analytics/export
// @access  Private/Admin
const exportAnalyticsData = async (req, res) => {
  try {
    const { type, period = '30', format = 'json' } = req.query;
    
    let data = {};
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    switch (type) {
      case 'sales':
        data = await Order.aggregate([
          { $match: { createdAt: { $gte: daysAgo } } },
          {
            $project: {
              orderId: '$_id',
              customerName: 1,
              email: 1,
              total: 1,
              status: 1,
              createdAt: 1,
              items: 1
            }
          }
        ]);
        break;
      
      case 'inventory':
        data = await Product.find().select('name price cost stock category');
        break;
      
      case 'customers':
        data = await User.find({ createdAt: { $gte: daysAgo } })
          .select('name email role createdAt');
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_${new Date().toISOString().split('T')[0]}.csv`);
      return res.send(csvData);
    }

    res.status(200).json({
      success: true,
      data,
      exportInfo: {
        type,
        period,
        format,
        recordCount: data.length,
        exportedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data'
    });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

module.exports = {
  getSalesAnalytics,
  getInventoryAnalytics,
  getCustomerAnalytics,
  exportAnalyticsData
}; 