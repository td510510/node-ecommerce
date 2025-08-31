'use strict';
const jwt = require('jsonwebtoken');

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

module.exports = {
  createTokenPair,
};
