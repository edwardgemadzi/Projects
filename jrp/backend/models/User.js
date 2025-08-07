const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['jobseeker', 'employer', 'admin'],
    default: 'jobseeker'
  },

  // Password reset fields
  resetPasswordToken: {
    type: String
  },

  resetPasswordExpire: {
    type: Date
  },

  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: {
    type: String
  },

  emailVerificationExpire: {
    type: Date
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;