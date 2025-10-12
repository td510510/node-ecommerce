'use strict';
const slugify = require('slugify');

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String, lowercase: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Clothing', 'Electronic', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // e.g., 4.6666, 46.666, 47, 4.7
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// create text index for search
productSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: run before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// define product type = clothe
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collection: 'Clothes',
    timestamps: true,
  }
);

// define product type = electronic
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collection: 'Electronics',
    timestamps: true,
  }
);

// define product type = furniture
const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collection: 'Furnitures',
    timestamps: true,
  }
);

module.exports = {
  ProductModel: model(DOCUMENT_NAME, productSchema),
  ClothingModel: model('Clothing', clothingSchema),
  ElectronicModel: model('Electronic', electronicSchema),
  FurnitureModel: model('Furniture', furnitureSchema),
};
