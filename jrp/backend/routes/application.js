const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { verifyToken } = require('../middleware/authMiddleware');
const parser = require('../middleware/multer');

// POST /api/applications — Apply to a job with resume upload
router.post('/', verifyToken, parser.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required.' });
    }

    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(409).json({ 
        message: 'You have already applied to this job.',
        applicationId: existingApplication._id
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resume: req.file ? req.file.path : null,
      coverLetter
    });
    
    res.status(201).json(application);
  } catch (err) {
    // Handle MongoDB duplicate key error (E11000) as backup
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: 'You have already applied to this job.' 
      });
    }
    console.error('Application submission error:', err);
    res.status(500).json({ message: 'Error submitting application.' });
  }
});

// GET /api/applications/user — Get all applications for the logged-in user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications.' });
  }
});

// GET /api/applications/check/:jobId — Check if user has already applied to a specific job
router.get('/check/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });
    
    res.json({ 
      hasApplied: !!existingApplication,
      applicationId: existingApplication?._id 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error checking application status.' });
  }
});

// GET /api/applications/status/:jobId — Get application details for a specific job
router.get('/status/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const application = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    }).populate('job');
    
    if (!application) {
      return res.status(404).json({ message: 'No application found for this job.' });
    }
    
    res.json({
      _id: application._id,
      status: application.status,
      appliedAt: application.createdAt,
      job: application.job
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching application status.' });
  }
});

// GET /api/applications/job/:jobId — Get all applications for a specific job (for employers)
router.get('/job/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check if the user is an employer and owns this job
    const Job = require('../models/Job');
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    
    // Only allow employers who created the job or admins
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applications for this job.' });
    }
    
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error('Error fetching job applications:', err);
    res.status(500).json({ message: 'Error fetching applications.' });
  }
});

// GET /api/applications/employer — Get all applications for jobs posted by the employer
router.get('/employer', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Employers only.' });
    }
    
    const Job = require('../models/Job');
    const employerJobs = await Job.find({ createdBy: req.user.id }).select('_id');
    const jobIds = employerJobs.map(job => job._id);
    
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error('Error fetching employer applications:', err);
    res.status(500).json({ message: 'Error fetching applications.' });
  }
});

// PUT /api/applications/:id/status — Update application status (for employers)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['applied', 'under_review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    }
    
    const application = await Application.findById(id).populate('job');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    
    // Check if the user is the employer who posted the job or an admin
    if (application.job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application.' });
    }
    
    application.status = status;
    await application.save();
    
    // Populate the response
    await application.populate('applicant', 'name email');
    
    res.json({
      _id: application._id,
      status: application.status,
      applicant: application.applicant,
      job: application.job,
      updatedAt: application.updatedAt
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ message: 'Error updating application status.' });
  }
});

module.exports = router;