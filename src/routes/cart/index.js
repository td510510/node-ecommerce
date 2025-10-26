'use strict';

const express = require('express');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.post('', asyncHandler(cartController.addItemToCart));
router.post('/update', asyncHandler(cartController.update));
router.delete('/:productId', asyncHandler(cartController.delete));
router.get('', asyncHandler(cartController.listToCart));

module.exports = router;
