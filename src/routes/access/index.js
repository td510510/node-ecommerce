'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// signup
router.post('/shop/signup', asyncHandler(accessController.signup));
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authentication);

// logout
router.post('/shop/logout', asyncHandler(accessController.logout));

// handler refresh token
router.post(
  '/shop/handler-refresh-token',
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
