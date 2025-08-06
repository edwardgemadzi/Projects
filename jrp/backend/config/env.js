const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// For Vercel, some environment variables might be undefined in development
const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET'
];

// Only require Cloudinary vars if not in Vercel build process
if (process.env.VERCEL !== '1' || process.env.NODE_ENV === 'production') {
    requiredEnvVars.push(
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    );
}

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.VERCEL !== '1') {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}

// Validate JWT secret strength in production
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET must be at least 32 characters long in production');
    process.exit(1);
}

const config = {
    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT) || 5001,
    
    // Database
    MONGO_URI: process.env.MONGO_URI,
    
    // JWT
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    
    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    
    // CORS
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    
    // Security
    COOKIE_SECURE: process.env.NODE_ENV === 'production',
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    
    // File upload
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
};

module.exports = config;
