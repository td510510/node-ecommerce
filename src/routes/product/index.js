'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProducts)
);
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));

// authentication
router.use(authenticationV2);

// create product
router.post('', asyncHandler(productController.createProduct));
router.post(
  '/publish/:id',
  asyncHandler(productController.publishedProductByShop)
);
router.post(
  '/unpublish/:id',
  asyncHandler(productController.unpublishedProductByShop)
);

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get(
  '/published/all',
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
