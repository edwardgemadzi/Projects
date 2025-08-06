const express = require('express');
const {
  createContact,
  getContacts
} = require('../controllers/contactController');

const { protect, authorize } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');
const { rateLimiters } = require('../middleware/security');

const router = express.Router();

router.route('/')
  .post([
    rateLimiters.contact,
    ...validationRules.contact
  ], createContact)
  .get([
    protect,
    authorize('admin', 'manager')
  ], getContacts);

module.exports = router;
