'use strict';

const KeyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      // const publicKeyString = publicKey.toString();
      // const tokens = await KeyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });
      // return tokens ? publicKeyString : null;
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };
      const tokens = await KeyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw new Error('Error creating key token: ' + error.message);
    }
  }

  static async findByUserId(userId) {
    return await KeyTokenModel.findOne({ user: userId }).lean();
  }

  static async removeKeyById(id) {
    return await KeyTokenModel.deleteOne({ _id: id });
  }

  static async findByRefreshTokenUsed(refreshToken) {
    return await KeyTokenModel.findOne({ refreshTokensUsed: refreshToken });
  }

  static async findByRefreshToken(refreshToken) {
    return await KeyTokenModel.findOne({ refreshToken });
  }

  static async deleteKeyById(userId) {
    return await KeyTokenModel.deleteMany({ user: userId });
  }
}

module.exports = KeyTokenService;
