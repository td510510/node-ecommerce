'use strict';

const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

// Define the schema for the ApiKey model
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      default: ['0000', '1111', '2222'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d', // Automatically delete documents after 30 days
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// export the ApiKey model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
