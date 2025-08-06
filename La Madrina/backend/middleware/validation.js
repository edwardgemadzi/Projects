const { body, param, query, validationResult } = require('express-validator');
const xss = require('xss');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  next();
};

// Validation rules
const validationRules = {
  // User registration validation
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email')
      .isLength({ max: 100 })
      .withMessage('Email cannot exceed 100 characters'),
    
    body('password')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    
    body('phone')
      .optional()
      .matches(/^\+?[\d\s\-\(\)]+$/)
      .withMessage('Please provide a valid phone number'),
    
    handleValidationErrors
  ],

  // User login validation
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    
    handleValidationErrors
  ],

  // Password change validation
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .isLength({ min: 8, max: 128 })
      .withMessage('New password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    
    handleValidationErrors
  ],

  // Forgot password validation
  forgotPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    handleValidationErrors
  ],

  // Reset password validation
  resetPassword: [
    body('password')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    
    param('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    
    handleValidationErrors
  ],

  // Profile update validation
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('phone')
      .optional()
      .matches(/^\+?[\d\s\-\(\)]+$/)
      .withMessage('Please provide a valid phone number'),
    
    body('address.street')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Street address cannot exceed 100 characters'),
    
    body('address.city')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('City cannot exceed 50 characters'),
    
    body('address.state')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('State cannot exceed 50 characters'),
    
    body('address.zipCode')
      .optional()
      .matches(/^\d{5}(-\d{4})?$/)
      .withMessage('Please provide a valid ZIP code'),
    
    handleValidationErrors
  ],

  // Product validation
  createProduct: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Product name must be between 1 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    
    body('category')
      .isIn(['bread', 'cakes', 'pastries', 'cookies', 'specialty'])
      .withMessage('Category must be one of: bread, cakes, pastries, cookies, specialty'),
    
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL'),
    
    handleValidationErrors
  ],

  // Contact form validation
  contact: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('message')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Message must be between 10 and 1000 characters'),
    
    handleValidationErrors
  ],

  // Order validation
  createOrder: [
    body('customerName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Customer name must be between 2 and 50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    
    body('items.*.productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('items.*.quantity')
      .isInt({ min: 1, max: 100 })
      .withMessage('Quantity must be between 1 and 100'),
    
    handleValidationErrors
  ],

  updateOrderStatus: [
    body('status')
      .isIn(['Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed', 'Cancelled'])
      .withMessage('Invalid order status'),
    
    handleValidationErrors
  ],

  // MongoDB ObjectId validation
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format'),
    
    handleValidationErrors
  ]
};

module.exports = {
  validationRules,
  sanitizeInput,
  handleValidationErrors
};
