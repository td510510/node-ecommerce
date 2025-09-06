'use strict';
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthenticationError, NotFound } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });

    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error('Error verifying access token:', err);
      } else {
        console.log('Access token verified:', decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error('Error creating token pair: ' + error.message);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId missing
    2 - get accessToken from header
    3 - verify token
    4 - check user in db
    5 - check keyStore with userId
    6 - ok all -> return next()
  */

  // - check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthenticationError('Invalid request');

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFound('Not found keyStore');

  // get accessToken from header
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthenticationError('Invalid request');

  // verify token
  try {
    const decoded = await jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId) throw AuthenticationError('Invalid userId');
    req.keyStore = keyStore;
    req.user = decoded;
    return next();
  } catch (error) {
    throw new AuthenticationError('Invalid access token');
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId missing
    2 - get accessToken from header
    3 - verify token
    4 - check user in db
    5 - check keyStore with userId
    6 - ok all -> return next()
  */

  // - check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthenticationError('Invalid request');

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFound('Not found keyStore');

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decoded = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decoded.userId)
        throw AuthenticationError('Invalid userId');
      req.keyStore = keyStore;
      req.user = decoded;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw new AuthenticationError('Invalid Refresh token');
    }
  }

  // get accessToken from header
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthenticationError('Invalid request');

  // verify token
  try {
    const decoded = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId) throw AuthenticationError('Invalid userId');
    req.keyStore = keyStore;
    req.user = decoded;
    return next();
  } catch (error) {
    throw new AuthenticationError('Invalid access token');
  }
});

const verifyJWT = (token, keySecret) => {
  return jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
