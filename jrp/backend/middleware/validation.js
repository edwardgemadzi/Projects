const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be between 6 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('role')
        .optional()
        .isIn(['jobseeker', 'employer'])
        .withMessage('Role must be either jobseeker or employer'),
    
    handleValidationErrors
];

// User login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Job creation validation
const validateJob = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Job title must be between 3 and 100 characters'),
    
    body('company')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters'),
    
    body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
    
    body('industry')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Industry must be between 2 and 50 characters'),
    
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    
    body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
    
    handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .optional()
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be between 6 and 128 characters'),
    
    body('oldPassword')
        .if(body('password').exists())
        .notEmpty()
        .withMessage('Old password is required when changing password'),
    
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateJob,
    validateProfileUpdate,
    handleValidationErrors
};
