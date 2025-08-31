'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router();

// signup
router.post('/shop/signup', asyncHandler(accessController.signup));
router.post('/shop/login', asyncHandler(accessController.login));

module.exports = router;
