const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, items, total, specialInstructions } = req.body;

    // Verify products exist and calculate total
    let calculatedTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }
      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock`
        });
      }
      calculatedTotal += product.price * item.quantity;
    }

    const order = await Order.create({
      customerName,
      email,
      phone,
      items,
      total: calculatedTotal,
      specialInstructions,
      customer: req.user?.id || null // Add customer ID if user is authenticated
    });

    // Populate product details for response
    const populatedOrder = await Order.findById(order._id).populate('items.productId');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: populatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin only)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Admin only)
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user's order history
// @route   GET /api/orders/user/:userId
// @access  Private (User's own orders or Admin)
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user is accessing their own orders or if they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const orders = await Order.find({ customer: userId })
      .populate('items.productId')
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get current user's order history
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get order for public tracking (limited info)
// @route   GET /api/orders/track/:id
// @access  Public (rate limited)
const getOrderForTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select(
      'customerName email status createdAt total items specialInstructions'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Return limited order information for public tracking
    const trackingInfo = {
      _id: order._id,
      customerName: order.customerName,
      email: order.email,
      status: order.status,
      createdAt: order.createdAt,
      total: order.total,
      itemCount: order.items?.length || 0,
      hasSpecialInstructions: !!order.specialInstructions
    };

    res.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Manager/Baker)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  getUserOrders,
  getMyOrders,
  getOrderForTracking,
  updateOrderStatus
};
