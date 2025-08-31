'use strict';

const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

// Declare the Schema of the MongoDB model
const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [String],
      enum: ['admin', 'user', 'shop'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Export the model
const ShopModel = model(DOCUMENT_NAME, shopSchema);
module.exports = ShopModel;
