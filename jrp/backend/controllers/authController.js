const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const config = require('../config/env');
const logger = require('../config/logger');
const { asyncHandler } = require('../middleware/errorHandler');

// Helper function to generate tokens
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role }, 
        config.JWT_SECRET, 
        { expiresIn: config.JWT_EXPIRE }
    );
};

// Helper function to set cookie
const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: config.COOKIE_SECURE,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'jobseeker',
        emailVerificationToken,
        emailVerificationExpire
    });

    // Generate JWT token
    const token = generateToken(user);
    setAuthCookie(res, token);

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified
    });
});

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

    const token = generateToken(user);
    setAuthCookie(res, token);

    logger.info(`User logged in: ${user.email}`);

    res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified
    });
});

exports.logoutUser = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    logger.info(`User logged out: ${req.user?.email || 'unknown'}`);
    res.json({ message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified
    });
});

// Password reset request
exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // In production, send email here
    // For now, we'll return the token (remove this in production)
    logger.info(`Password reset requested for: ${email}`);

    res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.',
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
});

// Reset password with token
exports.resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);

    res.json({ message: 'Password reset successful' });
});

// Verify email
exports.verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    logger.info(`Email verified for: ${user.email}`);

    res.json({ message: 'Email verified successfully' });
});

// Resend email verification
exports.resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
        return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpire = emailVerificationExpire;
    await user.save();

    // In production, send email here
    logger.info(`Email verification resent for: ${email}`);

    res.json({ 
        message: 'Verification email sent',
        verificationToken: process.env.NODE_ENV === 'development' ? emailVerificationToken : undefined
    });
});