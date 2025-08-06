const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// General rate limiting
const generalLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later.'
);

// Strict rate limiting for auth endpoints
const authLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    50, // limit each IP to 50 requests per windowMs (increased for development)
    'Too many authentication attempts, please try again later.'
);

// File upload rate limiting
const uploadLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    10, // limit each IP to 10 uploads per windowMs
    'Too many file uploads, please try again later.'
);

// Helmet configuration for security headers
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
});

module.exports = {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    helmetConfig
};
