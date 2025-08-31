'use strict';

const KeyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey }) {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await KeyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? publicKeyString : null;
    } catch (error) {
      throw new Error('Error creating key token: ' + error.message);
    }
  }
}

module.exports = KeyTokenService;
