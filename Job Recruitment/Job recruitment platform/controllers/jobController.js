
const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, employer: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name email');
    res.json(jobs);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.searchJobs = async (req, res) => {
  const { title, location, industry, skills } = req.query;
  const query = {
    ...(title && { title: { $regex: title, $options: 'i' } }),
    ...(location && { location: { $regex: location, $options: 'i' } }),
    ...(industry && { industry: { $regex: industry, $options: 'i' } }),
    ...(skills && { skills: { $in: skills.split(',') } }),
  };
  try {
    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
