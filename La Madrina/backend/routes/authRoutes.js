const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');
const { loginSlowDown, loginRateLimit, rateLimiters } = require('../middleware/security');

const router = express.Router();

// Public routes
router.post('/register', [
  rateLimiters.auth,
  ...validationRules.register
], register);

router.post('/login', [
  rateLimiters.auth,
  loginRateLimit,
  loginSlowDown,
  ...validationRules.login
], login);

router.post('/logout', logout);

router.post('/forgotpassword', [
  rateLimiters.passwordReset,
  ...validationRules.forgotPassword
], forgotPassword);

router.put('/resetpassword/:resettoken', [
  rateLimiters.auth,
  ...validationRules.resetPassword
], resetPassword);

router.get('/verify/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);

router.put('/updatedetails', [
  protect,
  ...validationRules.updateProfile
], updateDetails);

router.put('/updatepassword', [
  protect,
  ...validationRules.changePassword
], updatePassword);

module.exports = router;
