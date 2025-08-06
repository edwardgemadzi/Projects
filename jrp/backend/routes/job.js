const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateJob } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// GET all jobs with pagination and search
router.get('/', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const searchQuery = {};
    if (req.query.search) {
        searchQuery.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { company: { $regex: req.query.search, $options: 'i' } },
            { location: { $regex: req.query.search, $options: 'i' } }
        ];
    }
    
    if (req.query.location) {
        searchQuery.location = { $regex: req.query.location, $options: 'i' };
    }
    
    if (req.query.industry) {
        searchQuery.industry = { $regex: req.query.industry, $options: 'i' };
    }

    const jobs = await Job.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name');
        
    const total = await Job.countDocuments(searchQuery);
    
    res.json({
        jobs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
}));

// GET single job by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name');
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
}));

// POST a new job (protected)
router.post('/create', verifyToken, validateJob, asyncHandler(async (req, res) => {
    const { title, company, location, industry, skills, description, logo } = req.body;

    // Check if user is employer
    if (req.user.role !== 'employer' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only employers can post jobs' });
    }

    const job = new Job({
        title,
        company,
        location,
        industry,
        skills: Array.isArray(skills) ? skills : [],
        description,
        logo: logo || '',
        createdBy: req.user.id
    });

    await job.save();
    
    logger.info(`Job created: ${title} by user ${req.user.email}`);
    res.status(201).json(job);
}));

// Update a job (for employer)
router.put('/:id', verifyToken, validateJob, asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the user is the creator of the job or an admin
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this job' });
    }
    
    const updates = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
        req.params.id, 
        updates, 
        { new: true, runValidators: true }
    );
    
    logger.info(`Job updated: ${updatedJob.title} by user ${req.user.email}`);
    res.json(updatedJob);
}));

// Delete a job (for employer/admin)
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the user is the creator of the job or an admin
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    
    logger.info(`Job deleted: ${job.title} by user ${req.user.email}`);
    res.json({ message: 'Job deleted successfully' });
}));

module.exports = router;