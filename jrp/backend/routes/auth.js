const express = require('express');
const router = express.Router();
const { 
    loginUser, 
    registerUser, 
    logoutUser, 
    getMe,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Get current user
router.get('/me', verifyToken, getMe);

// Login
router.post('/login', validateLogin, loginUser);

// Logout
router.post('/logout', logoutUser);

// Register
router.post('/register', validateRegistration, registerUser);

// Password reset
router.post('/forgot-password', asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    await forgotPassword(req, res);
}));

router.post('/reset-password', asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
    }
    await resetPassword(req, res);
}));

// Email verification
router.get('/verify-email/:token', asyncHandler(async (req, res) => {
    await verifyEmail(req, res);
}));

router.post('/resend-verification', asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    await resendVerification(req, res);
}));

// Update profile
router.put('/me', verifyToken, validateProfileUpdate, asyncHandler(async (req, res) => {
    const { name, email, password, oldPassword } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (email) updates.email = email;

    // If changing password, verify old password first
    if (password) {
        if (!oldPassword) {
            return res.status(400).json({ message: 'Old password required' });
        }
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password incorrect' });
        }
        updates.password = await bcrypt.hash(password, 12);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { 
        new: true,
        runValidators: true
    }).select('-password');
    
    logger.info(`User profile updated: ${user.email}`);
    res.json({ 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified
    });
}));

module.exports = router;