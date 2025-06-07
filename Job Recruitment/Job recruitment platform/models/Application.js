
const mongoose = require('mongoose');
const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resume: String,
  status: { type: String, enum: ['applied', 'reviewed', 'rejected'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
