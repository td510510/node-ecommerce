'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey);
router.use(permission('0000'));

router.use('/', require('./access'));

module.exports = router;
