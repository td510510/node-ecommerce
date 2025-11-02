'use strict';
const { BadRequestError } = require('../core/error.response');

const InventoryModel = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repo');

class InventoryService {
  static async addStockToInventory({ productId, location, stock, shopId }) {
    if (!productId || !stock || !shopId) {
      throw new BadRequestError('Missing required fields to add inventory');
    }
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError('Product not found');
    }
    const query = {
      invent_productId: productId,
      invent_shopId: shopId,
    };
    const update = {
      $inc: { invent_stock: stock },
      $set: {
        invent_location: location || 'unknown',
      },
    };
    const options = { upsert: true, new: true };
    return InventoryModel.findOneAndUpdate(query, update, options);
  }
}

exports = new InventoryService();
