'use strict';

const mongoose = require('mongoose');

const connectString =
  `${process.env.MONGODB_URI}/${process.env.MONGODB_DB}` ||
  'mongodb://localhost:27017/yourdbname';

mongoose
  .connect(connectString)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', connectString);
  });

module.exports = mongoose;
