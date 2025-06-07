
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createJob, getJobs, searchJobs } = require('../controllers/jobController');

router.post('/', auth, createJob);
router.get('/', getJobs);
router.get('/search', searchJobs);

module.exports = router;
