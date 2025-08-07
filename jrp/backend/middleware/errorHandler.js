const logger = require('../config/logger');

// Not Found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, _next) => {
    // Log the error
    logger.error(err.message, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, status: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, status: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, status: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, status: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, status: 401 };
    }

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'File size too large. Maximum size is 5MB.';
        error = { message, status: 400 };
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        const message = 'Too many files. Only one file allowed.';
        error = { message, status: 400 };
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const message = 'Unexpected file field.';
        error = { message, status: 400 };
    }

    // Multer custom file filter errors
    if (err.message && err.message.includes('Invalid file type')) {
        error = { message: err.message, status: 400 };
    }

    if (err.message && err.message.includes('File size too large')) {
        error = { message: err.message, status: 400 };
    }

    // Rate limiting errors
    if (err.status === 429) {
        const message = 'Too many requests. Please try again later.';
        error = { message, status: 429 };
    }

    // Network/connection errors
    if (err.code === 'ECONNREFUSED') {
        const message = 'Database connection failed. Please try again later.';
        error = { message, status: 503 };
    }

    const status = error.status || err.statusCode || 500;
    const message = error.message || 'Server Error';

    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    notFound,
    errorHandler,
    asyncHandler
};
