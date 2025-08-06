const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');

// Import configurations and middleware
const config = require('./config/env');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const { helmetConfig, generalLimiter, authLimiter, uploadLimiter } = require('./middleware/security');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to database
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const uploadRoute = require('./routes/upload');
const applicationRoutes = require('./routes/application');
const adminRoutes = require('./routes/admin');

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(compression());

// Request logging
if (config.NODE_ENV === 'production') {
    app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
    }));
} else {
    app.use(morgan('dev'));
}

// CORS configuration
app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// Apply rate limiting
app.use(generalLimiter);

// Routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadLimiter, uploadRoute);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// For Vercel deployment - export the app instead of listening
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    // Local development server
    const server = app.listen(config.PORT, () => {
        logger.info(`Server running on http://localhost:${config.PORT}`);
        console.log(`Server running on http://localhost:${config.PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        logger.error('Unhandled Promise Rejection:', err);
        server.close(() => {
            process.exit(1);
        });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
        logger.error('Uncaught Exception:', err);
        process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            logger.info('Process terminated');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT received. Shutting down gracefully...');
        server.close(() => {
            logger.info('Process terminated');
            process.exit(0);
        });
    });
}

// Export for Vercel
module.exports = app;