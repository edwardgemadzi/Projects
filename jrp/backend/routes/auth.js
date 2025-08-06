const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const config = require('../config/env');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/me', verifyToken, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role
    });
}));

router.post('/login', validateLogin, loginUser);

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: config.COOKIE_SECURE
    });
    logger.info(`User logged out: ${req.user?.email || 'Unknown'}`);
    return res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'jobseeker'
    });

    const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: config.COOKIE_SECURE,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    });

    logger.info(`User registered: ${newUser.email}`);

    res.status(201).json({
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
    });
}));

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
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
}));

module.exports = router;