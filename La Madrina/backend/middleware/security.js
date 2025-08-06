const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Secure rate limiter for login attempts (replaces vulnerable express-brute)
const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Allow 2 requests per windowMs without delay
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
  validate: { delayMs: false } // Disable deprecation warning
});

// Enhanced login rate limiter
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5 to 20 for development
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Rate limiters for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different operations
const rateLimiters = {
  // General API rate limit
  general: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5000, // Very high limit for development
    'Too many requests from this IP, please try again later'
  ),

  // Stricter limit for authentication routes
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    200, // Higher limit for development
    'Too many authentication attempts, please try again later'
  ),

  // Contact form submissions
  contact: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    5, // limit each IP to 5 contact submissions per hour
    'Too many contact form submissions, please try again later'
  ),

  // Password reset requests
  passwordReset: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // limit each IP to 3 password reset requests per hour
    'Too many password reset requests, please try again later'
  ),

  // Order creation
  orders: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    1000, // Very high limit for development/testing
    'Too many order attempts, please try again later'
  )
};

// IP whitelist for admin operations (optional)
const ipWhitelist = (req, res, next) => {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS ? 
    process.env.ADMIN_ALLOWED_IPS.split(',') : [];
  
  if (allowedIPs.length === 0) {
    return next(); // No IP restrictions if not configured
  }

  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied from this IP address'
    });
  }
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  
  next();
};

// Request logging for security monitoring
const securityLogger = (req, res, next) => {
  const securityEvents = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password'
  ];

  if (securityEvents.some(event => req.path.includes(event))) {
    console.log(`[SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
  }

  next();
};

module.exports = {
  loginSlowDown,
  loginRateLimit,
  rateLimiters,
  ipWhitelist,
  securityHeaders,
  securityLogger
};
