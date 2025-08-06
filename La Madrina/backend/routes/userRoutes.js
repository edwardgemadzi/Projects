const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  toggleUserLock,
  getUserStats
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/stats')
  .get(getUserStats);

router.route('/')
  .get(getUsers)
  .post([...validationRules.register], createUser);

router.route('/:id')
  .get([...validationRules.mongoId], getUser)
  .put([...validationRules.mongoId, ...validationRules.updateProfile], updateUser)
  .delete([...validationRules.mongoId], deleteUser);

router.put('/:id/reset-password', [
  ...validationRules.mongoId,
  ...validationRules.changePassword
], resetUserPassword);

router.put('/:id/toggle-lock', [
  ...validationRules.mongoId
], toggleUserLock);

module.exports = router;
