'use strict';

const { findByID } = require('../services/apiKey.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
  try {
    console.log('Check apiKey req header:', req.headers);
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) return res.status(401).json({ message: 'Unauthorized' });

    // check object key
    const objKey = await findByID(key);
    if (!objKey) return res.status(401).json({ message: 'Unauthorized' });
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    console.log('Check permission req:', req?.objKey);
    if (!req.objKey?.permissions?.includes(permission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    console.log('Permission granted');

    const isValidPermission = req.objKey?.permissions?.includes(permission);
    if (!isValidPermission) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { apiKey, permission, asyncHandler };
