'use strict';

const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the MongoDB model
const keyTokenSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Export the model
const KeyTokenModel = model(DOCUMENT_NAME, keyTokenSchema);
module.exports = KeyTokenModel;
