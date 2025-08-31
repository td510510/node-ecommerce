'use strict';

const apiKeyModel = require('../models/apikey.model');
const crypto = require('crypto');

const findByID = async (key) => {
  const newKey = await apiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions: ['0000'],
  });
  if (!key) return null;
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findByID,
};
