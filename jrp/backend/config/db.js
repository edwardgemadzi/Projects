const mongoose = require('mongoose');
const config = require('./env');
const logger = require('./logger');
const createDatabaseIndexes = require('./indexes');

// Cache the database connection for serverless functions
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // If already connected, return the cached connection
    if (cached.conn) {
        return cached.conn;
    }

    // If no promise exists, create one
    if (!cached.promise) {
        const opts = {
            // Connection options optimized for serverless
            maxPoolSize: process.env.VERCEL ? 5 : 10, // Smaller pool for serverless
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            // Optimize for serverless cold starts
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(config.MONGO_URI, opts).then((mongoose) => {
            logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);

            // Create database indexes after connection (only once)
            if (!process.env.VERCEL || process.env.NODE_ENV !== 'production') {
                createDatabaseIndexes().catch(err => {
                    logger.error('Failed to create indexes:', err);
                });
            }

            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

// Connection event listeners (only set up once)
if (!cached.conn) {
    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown (not needed for Vercel serverless)
    if (!process.env.VERCEL) {
        process.on('SIGINT', async () => {
            if (mongoose.connection.readyState === 1) {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed through app termination');
            }
            process.exit(0);
        });
    }
}

module.exports = connectDB;