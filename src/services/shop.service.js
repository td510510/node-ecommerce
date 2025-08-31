'use strict';

const ShopModel = require('../models/shop.model');

const findByEmail = async ({
  email,
  select = {
    password: 2,
    name: 1,
    email: 1,
    roles: 1,
  },
}) => {
  return await ShopModel.findOne({ email }).select(select).lean();
};

module.exports = {
  findByEmail,
};
