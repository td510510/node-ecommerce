'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ShopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const RoleShop = {
  SHOP: 'shop',
  WRITER: 'writer',
  EDITOR: 'editor',
  ADMIN: 'admin',
};
const { createTokenPair } = require('../auth/authUtils');

class AccessService {
  static async signup({ name, email, password }) {
    console.log('AccessService:signup', { name, email, password });
    try {
      // validate input
      if (!name || !email || !password) {
        return {
          status: 400,
          message: 'Name, email and password are required',
        };
      }

      // check if user already exists
      const existingUser = await ShopModel.findOne({ email }).lean();
      if (existingUser) {
        return { status: 409, message: 'User already exists' };
      } else {
        // create new user
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await ShopModel.create({
          name,
          email,
          password: passwordHash,
          roles: [RoleShop.SHOP],
        });
        if (newUser) {
          // create privateKey and publicKey
          const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem',
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
            },
          });
          console.log('privateKey', privateKey);
          console.log('publicKey', publicKey);
          const publicKeyString = await KeyTokenService.createKeyToken({
            userId: newUser._id,
            publicKey,
          });
          if (publicKeyString) {
            // crate token pair
            const tokens = await createTokenPair(
              { userId: newUser._id, email: newUser.email },
              publicKey,
              privateKey
            );
            console.log('create token successfully', tokens);
            return {
              status: 201,
              message: 'User created successfully',
              metadata: {
                shop: newUser,
                tokens,
              },
            };
          } else {
            return { status: 500, message: 'Error creating key token' };
          }
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }
}

module.exports = AccessService;
