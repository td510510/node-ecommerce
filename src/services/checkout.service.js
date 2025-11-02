'use strict';

const { BadRequestError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.model');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');
const OrderModel = require('../models/order.model');

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

  static async orderByUser({
    shop_order_ids_new,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids: shop_order_ids_new,
      });

    // check lai lan nua xem vuot ton kho khong
    const products = shop_order_ids_new.flatMap((shop) => shop.item_products);
    const acquireProducts = [];
    for (let index = 0; index < products.length; index++) {
      const { productId, quantity } = products[index];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProducts.push(keyLock ? true : false);
      if (!keyLock) {
        throw new BadRequestError(
          `Product ${productId} is out of stock or cannot be reserved`
        );
      }
      await releaseLock(keyLock);
    }

    // check neu co mot san pham het hang trong kho
    if (acquireProducts.includes(false)) {
      throw new BadRequestError('Some products are out of stock');
    }

    const newOrder = OrderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // truong hop thanh cong thi xoa san pham trong gio hang
    if (newOrder) {
      // await CartModel.deleteOne({ cart_userId: userId, _id: cartId });
    }

    return newOrder;
  }

  // query orders by user
  static async getOrdersByUser() {}

  // query order detail by user
  static async getOneOrdersByUser() {}

  // cancel orders by user
  static async cancelOrdersByUser() {}

  // update order status by admin
  static async updateOrderStatusByAdmin() {}
}

module.exports = CheckoutService;
