'use strict';

const DiscountModel = require('../models/discount.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { convertToObjectIdMongodb } = require('../utils');
const { findAllProducts } = require('../models/repositories/product.repo');
const {
  findAllDiscountCodesUnselected,
  checkDiscountExists,
} = require('../models/repositories/discount.repo');

/*
  Service: discount.service.js
  1 - Generator Discount Code [Shop | Admin]
  2 - Get discount amount [User]
  3 - Get all discounts codes [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Shop | Admin]
  6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_values,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;

    if (
      new Date() >= new Date(start_date) &&
      new Date() <= new Date(end_date)
    ) {
      throw new BadRequestError('Discount code has expired');
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Invalid discount start date and end date');
    }

    // create index for discount code
    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    }).lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError(
        `Discount code ${code} already exists in this shop`
      );
    }

    const newDiscount = await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
      discount_users_used: users_used,
      discount_max_values: max_values,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code ${codeId} not found`);
    }
    const { discount_users_used } = foundDiscount;

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new NotFoundError(`Discount expired`);
    }
    if (!discount_max_uses || discount_max_uses <= 0) {
      throw new NotFoundError(`Discount code ${codeId} has been used up`);
    }
    if (
      new Date() < new Date(foundDiscount.discount_start_date) ||
      new Date() > new Date(foundDiscount.discount_end_date)
    ) {
      throw new NotFoundError(
        `Discount code ${codeId} is not valid at this time`
      );
    }
    let totalOrderValue = 0;
    if (discount_min_order_value && discount_min_order_value > 0) {
      for (const p of products) {
        totalOrderValue += p.product_price * (p.quantity || 1);
      }
      if (totalOrderValue < discount_min_order_value) {
        throw new BadRequestError(
          `Order value must be at least ${discount_min_order_value} to use this discount code`
        );
      }
    }
    if (discount_max_uses_per_user && discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (u) => u.userId === userId
      );
      if (
        userUsedDiscount &&
        userUsedDiscount.uses_count >= discount_max_uses_per_user
      ) {
        throw new BadRequestError(
          `You have used this discount code ${userUsedDiscount.uses_count} times, which has reached the maximum allowed uses of ${discount_max_uses_per_user}`
        );
      }
    }
    const discountAmount =
      discount_type === 'fixed_amount'
        ? foundDiscount.discount_value
        : (totalOrderValue * foundDiscount.discount_value) / 100;
    return {
      totalOrderValue,
      discountAmount,
      totalPrice: totalOrderValue - discountAmount,
    };
  }

  static async getAllDiscountCodesWithProduct({ shopId, code, limit, page }) {
    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    }).lean();

    console.log('foundDiscount', foundDiscount);

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError(`Discount code ${code} not found`);
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products;
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          // isPublish: true,
        },
        limit: +limit,
        page: +page,
        select: ['product_name', 'product_price', 'product_thumb'],
      });
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          product_shop: convertToObjectIdMongodb(shopId),
          // isPublish: true,
        },
        limit: +limit,
        page: +page,
        select: ['product_name', 'product_price', 'product_thumb'],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({
    shopId,
    limit,
    page,
    sort = 'ctime',
  }) {
    const discounts = await findAllDiscountCodesUnselected({
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      sort,
      selected: ['discount_code', 'discount_name'],
      model: DiscountModel,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code ${codeId} not found`);
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new NotFoundError(`Discount expired`);
    }
    if (!discount_max_uses || discount_max_uses <= 0) {
      throw new NotFoundError(`Discount code ${codeId} has been used up`);
    }

    if (
      new Date() < new Date(foundDiscount.discount_start_date) ||
      new Date() > new Date(foundDiscount.discount_end_date)
    ) {
      throw new NotFoundError(
        `Discount code ${codeId} is not valid at this time`
      );
    }

    let totalOrderValue = 0;
    if (discount_min_order_value && discount_min_order_value > 0) {
      for (const p of products) {
        totalOrderValue += p.product_price * (p.quantity || 1);
      }
      if (totalOrderValue < discount_min_order_value) {
        throw new BadRequestError(
          `Order value must be at least ${discount_min_order_value} to use this discount code`
        );
      }
    }

    if (discount_max_uses_per_user && discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (u) => u.userId === userId
      );
    }

    const discountAmount =
      discount_type === 'fixed_amount'
        ? foundDiscount.discount_value
        : (totalOrderValue * foundDiscount.discount_value) / 100;

    return {
      totalOrderValue,
      discountAmount,
      totalPrice: totalOrderValue - discountAmount,
    };
  }

  static async deleteDiscountCode() {
    const deleteDiscountCode = await DiscountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    }).lean();

    return deleteDiscountCode;
  }

  static async cancelDiscountCode() {
    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError(`Discount code ${codeId} not found`);
    }

    const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_uses_count: -1,
        discount_max_uses: 1,
      },
    }).lean();

    return result;
  }
}

module.exports = DiscountService;
