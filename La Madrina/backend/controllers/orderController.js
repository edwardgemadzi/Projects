const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      items,
      total,
      specialInstructions,
      pickupTime,
      deliveryAddress,
      customerId,
      source = 'Website'
    } = req.body;

    // Validate items and calculate costs
    const validatedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Calculate item cost and profit
      const itemCost = product.cost * item.quantity;
      const itemProfit = (product.price - product.cost) * item.quantity;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        cost: product.cost,
        profit: product.price - product.cost
      });

      calculatedTotal += product.price * item.quantity;

      // Update product stock
      product.stock -= item.quantity;
      product.inStock = product.stock > 0;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      customerName,
      email,
      phone,
      items: validatedItems,
      total: calculatedTotal,
      specialInstructions,
      pickupTime: pickupTime ? new Date(pickupTime) : null,
      deliveryAddress,
      customerId,
      source,
      status: 'Pending'
    });

    // Update customer loyalty if customer is logged in
    if (customerId) {
      const user = await User.findById(customerId);
      if (user) {
        // Update customer profile with order data
        // This would typically update a Customer model
        console.log(`Order created for customer: ${user.name}`);
      }
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      customerName,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Filter by customer name
    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('assignedTo', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('assignedTo', 'name')
      .populate('items.productId', 'name price cost');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status and related fields
    order.status = status;
    if (notes) {
      order.notes = order.notes ? `${order.notes}\n${new Date().toISOString()}: ${notes}` : notes;
    }
    if (assignedTo) {
      order.assignedTo = assignedTo;
    }

    // Add status update timestamp
    order.updatedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// @desc    Get order tracking (public)
// @route   GET /api/orders/track/:id
// @access  Public
const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid order ID'
      });
    }

    const order = await Order.findById(id)
      .select('customerName status total createdAt pickupTime items');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking order'
    });
  }
};

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .sort({ createdAt: -1 })
      .select('customerName status total createdAt pickupTime items');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// @desc    Get order analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getOrderAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Order status distribution
    const statusDistribution = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    // Daily order trend
    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Average order value by status
    const avgOrderValue = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: '$status',
          averageValue: { $avg: '$total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // Top customers by order count
    const topCustomers = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customerName' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusDistribution,
        dailyOrders,
        avgOrderValue,
        topCustomers,
        period: {
          start: daysAgo,
          end: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order analytics'
    });
  }
};

// @desc    Get scheduled orders
// @route   GET /api/orders/scheduled
// @access  Private/Admin
const getScheduledOrders = async (req, res) => {
  try {
    const { date } = req.query;
    let dateFilter = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      dateFilter = {
        pickupTime: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      };
    } else {
      // Get today's scheduled orders
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      
      dateFilter = {
        pickupTime: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      };
    }

    const scheduledOrders = await Order.find({
      ...dateFilter,
      status: { $in: ['Pending', 'Confirmed', 'In Progress'] }
    })
      .populate('customerId', 'name email phone')
      .populate('assignedTo', 'name')
      .sort({ pickupTime: 1 });

    res.status(200).json({
      success: true,
      data: scheduledOrders
    });
  } catch (error) {
    console.error('Scheduled orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scheduled orders'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
  getMyOrders,
  getOrderAnalytics,
  getScheduledOrders
};
