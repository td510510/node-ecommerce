'use strict';

const { convertToObjectIdMongodb } = require('../../utils');
const CartModel = require('../models/repositories/cart.model');

const findCartById = async (cartId) => {
  const cart = await CartModel.findOne({
    _id: convertToObjectIdMongodb(cartId),
    cart_state: 'active',
  });
  return cart;
};

module.exports = {
  findCartById,
};
