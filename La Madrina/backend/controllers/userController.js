const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }
    
    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination info
    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      isEmailVerified: true // Admin created users are auto-verified
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'role', 'phone', 'isActive', 'isEmailVerified', 'address', 'preferences'];
    const updateData = {};

    // Only include allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Prevent admin from changing their own role to non-admin
    if (req.params.id === req.user.id.toString() && updateData.role && updateData.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own admin role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
};

// @desc    Lock/unlock user account
// @route   PUT /api/admin/users/:id/toggle-lock
// @access  Private/Admin
const toggleUserLock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from locking themselves
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot lock your own account'
      });
    }

    if (user.isLocked) {
      // Unlock account
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    } else {
      // Lock account for 24 hours
      user.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Account ${user.isLocked ? 'locked' : 'unlocked'} successfully`,
      data: {
        isLocked: user.isLocked,
        lockUntil: user.lockUntil
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error toggling account lock'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private/Admin
const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          verifiedUsers: {
            $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] }
          },
          lockedUsers: {
            $sum: { $cond: [{ $gt: ['$lockUntil', new Date()] }, 1, 0] }
          }
        }
      }
    ]);

    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const registrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          lockedUsers: 0
        },
        roleDistribution: roleStats,
        registrationTrend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  toggleUserLock,
  getUserStats
};
