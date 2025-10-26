'use strict';

const CartService = require('../services/cart.service');
const { SuccessResponse } = require('../core/success.response');

class CartController {
  async addItemToCart(req, res, next) {
    new SuccessResponse({
      message: 'Add item to cart successfully',
      metadata: await CartService.addItemToCart(req.user.userId, {
        productId: req.body.productId,
        quantity: req.body.quantity,
      }),
    }).send(res);
  }

  async update(req, res, next) {
    new SuccessResponse({
      message: 'Update cart successfully',
      metadata: await CartService.addItemToCartV2(req.user.userId, req.body),
    }).send(res);
  }

  async delete(req, res, next) {
    new SuccessResponse({
      message: 'Delete cart successfully',
      metadata: await CartService.deleteUserCart({
        userId: req.user.userId,
        productId: req.params.productId,
      }),
    }).send(res);
  }

  async listToCart(req, res, next) {
    new SuccessResponse({
      message: 'Get cart successfully',
      metadata: await CartService.getListUserCart(req.user.userId),
    }).send(res);
  }
}
module.exports = new CartController();
