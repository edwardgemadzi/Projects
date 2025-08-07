const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all users (admin only)
router.get('/users', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
}));

// Get all jobs with creator details (admin only)
router.get('/jobs', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
}));

// Get all applications with details (admin only)
router.get('/applications', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('job', 'title company')
            .populate('applicant', 'name email')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
}));

// Get system statistics (admin only)
router.get('/statistics', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const [totalUsers, totalJobs, totalApplications] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Application.countDocuments()
        ]);

        const userStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        const applicationStats = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentJobs = await Job.find()
            .populate('createdBy', 'name')
            .select('title company location createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalUsers,
            totalJobs,
            totalApplications,
            userStats,
            applicationStats,
            recentUsers,
            recentJobs
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
}));

// Get user growth data (admin only)
router.get('/user-growth', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const { days = 30 } = req.query;
        
        const growth = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(growth);
    } catch (error) {
        console.error('Error fetching user growth:', error);
        res.status(500).json({ message: 'Error fetching user growth' });
    }
}));

// Get job growth data (admin only)
router.get('/job-growth', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const { days = 30 } = req.query;
        
        const growth = await Job.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(growth);
    } catch (error) {
        console.error('Error fetching job growth:', error);
        res.status(500).json({ message: 'Error fetching job growth' });
    }
}));

// Get top employers (admin only)
router.get('/top-employers', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const topEmployers = await Job.aggregate([
            {
                $group: {
                    _id: '$createdBy',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'employer'
                }
            },
            {
                $unwind: '$employer'
            },
            {
                $project: {
                    name: '$employer.name',
                    email: '$employer.email',
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json(topEmployers);
    } catch (error) {
        console.error('Error fetching top employers:', error);
        res.status(500).json({ message: 'Error fetching top employers' });
    }
}));

// Get popular industries (admin only)
router.get('/popular-industries', verifyToken, adminMiddleware, asyncHandler(async (req, res) => {
    try {
        const popularIndustries = await Job.aggregate([
            {
                $group: {
                    _id: '$industry',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json(popularIndustries);
    } catch (error) {
        console.error('Error fetching popular industries:', error);
        res.status(500).json({ message: 'Error fetching popular industries' });
    }
}));

module.exports = router;