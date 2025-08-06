const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/env');
const logger = require('../config/logger');
const { asyncHandler } = require('../middleware/errorHandler');

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        logger.warn(`Failed login attempt for email: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logger.warn(`Failed login attempt for email: ${email} - incorrect password`);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role }, 
        config.JWT_SECRET, 
        { expiresIn: config.JWT_EXPIRE }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: config.COOKIE_SECURE,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    logger.info(`User logged in: ${user.email}`);

    res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    });
});