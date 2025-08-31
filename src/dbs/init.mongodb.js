'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect.js');
const {
  db: { host, port, name },
} = require('../configs/config.mongodb.js');

const connectString = `${process.env.MONGODB_URI}/${name}`;

class DataBase {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { colors: true });
    }

    mongoose
      .connect(connectString)
      .then(async (_) =>
        console.log('MongoDB connected', 'is running on', await countConnect())
      )
      .catch((err) => console.error('MongoDB connection error:', err));
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DataBase();
    }

    return this.instance;
  }
}

const instanceMongoDB = DataBase.getInstance();
module.exports = instanceMongoDB;
