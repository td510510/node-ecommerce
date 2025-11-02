'use strict';

const redis = require('redis');
const { promisify } = require('util');
const { reserveInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}_${cartId}`;
  const retryTimes = 5;
  const expireTime = 3000; // 3 seconds

  for (let attempt = 0; attempt < retryTimes; attempt++) {
    const lockAcquired = await setNxAsync(key, expireTime);
    if (lockAcquired === 1) {
      const isReservation = await reserveInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50)); // wait before retrying
    }
  }
};

const releaseLock = async (key) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return delAsyncKey(key);
};

module.exports = { acquireLock, releaseLock };
