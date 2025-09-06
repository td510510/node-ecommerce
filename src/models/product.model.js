'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Clothing', 'Electronic'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define product type = clothes
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
  },
  {
    collection: 'Clothes',
    timestamps: true,
  }
);

// define product type = electronics
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    size: { type: String },
    color: { type: String },
  },
  {
    collection: 'Electronics',
    timestamps: true,
  }
);

module.exports = {
  ProductModel: model(DOCUMENT_NAME, productSchema),
  ClothingModel: model('Clothing', clothingSchema),
  ElectronicModel: model('Electronic', electronicSchema),
};
