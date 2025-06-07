
const Application = require('../models/Application');

exports.applyToJob = async (req, res) => {
  try {
    const application = new Application({
      job: req.body.jobId,
      applicant: req.user.id,
      resume: req.body.resume,
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const Job = require('../models/Job');

exports.getApplications = async (req, res) => {
  try {
    // Find jobs posted by the logged-in employer
    const jobs = await Job.find({ employer: req.user.id }).select('_id');
    const jobIds = jobs.map(job => job._id);

    // Find applications related to those jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')
      .populate('applicant', 'name email skills profileImage');

    res.json(applications);
  } catch (err) {
    console.error("Error getting applications:", err);
    res.status(500).send('Server error');
  }
};
