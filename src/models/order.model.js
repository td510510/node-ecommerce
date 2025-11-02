'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
      // street, city, state, country
    },
    order_payment: {
      type: Object,
      default: {},
      // type, status, transactionId
    },
    order_products: {
      type: Array,
      default: [],
      required: true,
    },
    order_trackingNumber: {
      type: String,
      default: '#00010118052025', // tuy nha van chuyen
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },
  },
  {
    collation: COLLECTION_NAME,
    timeseries: { createdAt: 'createOn', updatedAt: 'modifiedOn' },
  }
);

const OrderModel = model(DOCUMENT_NAME, orderSchema);

module.exports = OrderModel;
