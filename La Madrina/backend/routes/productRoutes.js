const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');

const router = express.Router();

router.route('/')
  .get(optionalAuth, getProducts)
  .post([
    protect,
    authorize('admin', 'manager', 'baker'),
    ...validationRules.createProduct
  ], createProduct);

router.route('/:id')
  .get([...validationRules.mongoId], getProduct)
  .put([
    protect,
    authorize('admin', 'manager', 'baker'),
    ...validationRules.mongoId,
    ...validationRules.createProduct
  ], updateProduct)
  .delete([
    protect,
    authorize('admin', 'manager'),
    ...validationRules.mongoId
  ], deleteProduct);

module.exports = router;
