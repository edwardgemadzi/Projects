
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['jobseeker', 'employer'], required: true },
  skills: [String],
  profileImage: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
