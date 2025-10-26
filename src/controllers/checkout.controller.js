'use strict';

const { SuccessResponse } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  async checkoutReview(req, res, next) {
    new SuccessResponse({
      message: 'Checkout review retrieved successfully',
      metadata: await CheckoutService.checkoutReview({
        cartId: req.body.cartId,
        userId: req.user.userId,
        shop_order_ids: req.body.shop_order_ids,
      }),
    }).send(res);
  }
}

module.exports = new CheckoutController();
