const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// GET /api/admin/users — List all users
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get all jobs (for admin)
router.get('/jobs', verifyToken, requireAdmin, async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(jobs);
  } catch {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Delete a user
router.delete('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Update a user
router.put('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updates = { name, email, role };
    
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete a job
router.delete('/jobs/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// Update a job
router.put('/jobs/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(job);
  } catch {
    res.status(500).json({ message: 'Error updating job' });
  }
});

// Migration endpoint to add status to existing applications
router.post('/migrate-applications', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await Application.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'applied' } }
    );
    res.json({ 
      message: 'Migration completed', 
      modifiedCount: result.modifiedCount 
    });
  } catch {
    res.status(500).json({ message: 'Error during migration' });
  }
});

module.exports = router;