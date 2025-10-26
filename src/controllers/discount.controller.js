'use strict';

const DiscountService = require('../services/discount.service');
const { SuccessResponse } = require('../core/success.response');

class DiscountController {
  async createDiscountCode(req, res, next) {
    new SuccessResponse({
      message: 'Create new discount code successfully',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async getAllDiscountCodesByShop(req, res, next) {
    new SuccessResponse({
      message: 'Get all discount codes successfully',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async getDiscountAmount(req, res, next) {
    new SuccessResponse({
      message: 'Get discount amount successfully',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async getAllDiscountCodesWithProduct(req, res, next) {
    new SuccessResponse({
      message: 'Get all discount codes with products successfully',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }
}

module.exports = new DiscountController();
