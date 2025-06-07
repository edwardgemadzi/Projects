
const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  requirements: String,
  location: String,
  industry: String,
  skills: [String],
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
