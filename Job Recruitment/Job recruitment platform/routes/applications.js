
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { applyToJob, getApplications } = require('../controllers/applicationController');

router.post('/', auth, applyToJob);
router.get('/', auth, getApplications);

module.exports = router;
