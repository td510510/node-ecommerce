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
const {
  BadRequestError,
  AuthenticationError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const { get } = require('http');
class AccessService {
  static async signup({ name, email, password }) {
    console.log('AccessService:signup', { name, email, password });
    try {
      // validate input
      if (!name || !email || !password) {
        throw new BadRequestError('Name, email and password are required');
      }

      // check if user already exists
      const existingUser = await ShopModel.findOne({ email }).lean();
      if (existingUser) {
        throw new BadRequestError('User already exists');
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
            throw new BadRequestError('Error creating key token');
          }
        }
      }
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static login = async ({ email, password, refreshToken = null }) => {
    // 1. check if shop exists
    if (!email) {
      throw new BadRequestError('Invalid email');
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError('Shop not registered');
    }

    // 2. check if password matches
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthenticationError('Authentication failed');
    }

    // 3. create privateKey and publicKey by rsa256
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

    // 4. create token pair
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: foundShop,
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    console.log('AccessService:logout', keyStore);
    const removeKey = await KeyTokenService.removeKeyById(keyStore._id);
    return removeKey;
  };
}

module.exports = AccessService;
