'use strict';

const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the MongoDB model
const inventorySchema = new Schema(
  {
    invent_productId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    invent_location: { type: String, default: 'unknown' },
    invent_stock: { type: Number, required: true },
    invent_shopId: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    invent_reservations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Export the model
const InventoryModel = model(DOCUMENT_NAME, inventorySchema);
module.exports = InventoryModel;
