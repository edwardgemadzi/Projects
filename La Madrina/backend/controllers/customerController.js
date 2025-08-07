const Customer = require('../models/Customer');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tier, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by loyalty tier
    if (tier) {
      query['loyalty.tier'] = tier;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const customers = await Customer.find(query)
      .populate('user', 'name email role')
      .populate('assignedTo', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Customer.countDocuments(query);

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCustomers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers'
    });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private/Admin
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('assignedTo', 'name');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer's order history
    const orders = await Order.find({ customerId: customer.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        customer,
        recentOrders: orders
      }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer'
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private/Admin
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update customer data
    Object.keys(updateData).forEach(key => {
      if (key !== 'user' && key !== '_id') {
        customer[key] = updateData[key];
      }
    });

    await customer.save();

    res.status(200).json({
      success: true,
      data: customer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer'
    });
  }
};

// @desc    Get customer analytics
// @route   GET /api/customers/analytics
// @access  Private/Admin
const getCustomerAnalytics = async (req, res) => {
  try {
    // Customer segments
    const segments = await Customer.aggregate([
      {
        $group: {
          _id: '$loyalty.tier',
          count: { $sum: 1 },
          totalSpent: { $sum: '$loyalty.totalSpent' },
          averageOrderValue: { $avg: '$loyalty.averageOrderValue' }
        }
      }
    ]);

    // Customer status distribution
    const statusDistribution = await Customer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top customers by spending
    const topCustomers = await Customer.find()
      .sort({ 'loyalty.totalSpent': -1 })
      .limit(10)
      .select('name email loyalty status');

    // Customer acquisition trend
    const acquisitionTrend = await Customer.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        segments,
        statusDistribution,
        topCustomers,
        acquisitionTrend
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

// @desc    Add customer note
// @route   POST /api/customers/:id/notes
// @access  Private/Admin
const addCustomerNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    
    customer.notes = customer.notes ? `${customer.notes}\n${newNote}` : newNote;
    await customer.save();

    res.status(200).json({
      success: true,
      data: customer,
      message: 'Note added successfully'
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding note'
    });
  }
};

// @desc    Update customer loyalty
// @route   PUT /api/customers/:id/loyalty
// @access  Private/Admin
const updateCustomerLoyalty = async (req, res) => {
  try {
    const { id } = req.params;
    const { points, tier, totalSpent, totalOrders, averageOrderValue } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update loyalty data
    if (points !== undefined) customer.loyalty.points = points;
    if (tier) customer.loyalty.tier = tier;
    if (totalSpent !== undefined) customer.loyalty.totalSpent = totalSpent;
    if (totalOrders !== undefined) customer.loyalty.totalOrders = totalOrders;
    if (averageOrderValue !== undefined) customer.loyalty.averageOrderValue = averageOrderValue;

    await customer.save();

    res.status(200).json({
      success: true,
      data: customer,
      message: 'Loyalty updated successfully'
    });
  } catch (error) {
    console.error('Update loyalty error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating loyalty'
    });
  }
};

// @desc    Assign customer to staff
// @route   PUT /api/customers/:id/assign
// @access  Private/Admin
const assignCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    customer.assignedTo = assignedTo;
    await customer.save();

    res.status(200).json({
      success: true,
      data: customer,
      message: 'Customer assigned successfully'
    });
  } catch (error) {
    console.error('Assign customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning customer'
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerAnalytics,
  addCustomerNote,
  updateCustomerLoyalty,
  assignCustomer
}; 