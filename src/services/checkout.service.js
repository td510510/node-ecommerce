'use strict';

const { BadRequestError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.model');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError('Cart not found');
    }

    const checkout_order = {
      total_price: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shop_order_ids_new = [];

    for (let index = 0; index < shop_order_ids.length; index++) {
      const {
        shopId,
        shop_discounts = [],
        item_products,
      } = shop_order_ids[index];
      // check products available
      const checkProductServer = await this.checkProductByServer({
        item_products,
      });
      if (!checkProductServer) {
        throw new BadRequestError('Some products are not available');
      }

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.product_price * product.quantity;
      }, 0);

      checkout_order.total_price += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice, // to update later
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        const { totalPrice, discountAmount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          shopId,
          userId,
          products: checkProductServer,
        });
        checkout_order.totalDiscount += discountAmount;

        if (discountAmount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discountAmount;
        }
      }
    }

    checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
    shop_order_ids_new.push(itemCheckout);

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
