'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active',
    },
    cart_products: {
      type: Array,
      default: [],
      required: true,
    },
    cart_count_products: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    collation: COLLECTION_NAME,
    timeseries: { createdAt: 'createOn', updatedAt: 'modifiedOn' },
  }
);

const CartModel = model(DOCUMENT_NAME, cartSchema);

module.exports = CartModel;
