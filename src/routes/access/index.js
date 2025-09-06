'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

// signup
router.post('/shop/signup', asyncHandler(accessController.signup));
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authenticationV2);

// logout
router.post('/shop/logout', asyncHandler(accessController.logout));

// handler refresh token
router.get(
  '/shop/handler-refresh-token',
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
