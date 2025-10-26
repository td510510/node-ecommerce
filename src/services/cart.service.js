'use strict';

const CartModel = require('../models/cart.model');
const { getProductById } = require('../models/repositories/product.repo');
const { NotFoundError } = require('../core/error.response');

/*
  key features for cart service
  1 - Add product to cart [User]
  2 - Reduce product quantity in cart [User]
  3 - Increase product quantity in cart [User]
  4 - Get cart details [User]
  5 - Remove product from cart [User]
  6 - Clear cart [User]
*/

class CartService {
  static async createUserCart(userId, product = {}) {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
      $addToSet: { cart_products: product },
    };
    const options = { upsert: true, new: true };
    return await CartModel.findOneAndUpdate(
      query,
      updateOrInsert,
      options
    ).lean();
  }

  static async updateUserCartQuantity(userId, product = {}) {
    const query = {
      cart_userId: userId,
      'cart_products.productId': product.productId,
      cart_state: 'active',
    };
    const updateSet = {
      $inc: { 'cart_products.$.quantity': product.quantity },
    };
    const options = { upsert: true, new: true };
    return await CartModel.findOneAndUpdate(query, updateSet, options).lean();
  }

  static async addItemToCart(userId, product = {}) {
    const userCart = await CartModel.findOne({ cart_userId: userId }).lean();
    if (!userCart) {
      // Create a new cart for the user
      return CartService.createUserCart(userId, product);
    }

    // if has cart but product not in cart, add product to cart
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // if has cart and product in cart, update quantity
    return CartService.updateUserCartQuantity(userId, product);
  }

  static async addItemToCartV2(userId, product = {}) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0] || {};

    const foundProduct = getProductById({ product_id: productId });
    if (!foundProduct) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError(`Product with ID ${productId} not found in shop`);
    }

    if (quantity < 1) {
      throw new NotFoundError(`Quantity must be at least 1`);
    }

    return CartService.updateUserCartQuantity(userId, product);
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' };

    const updateSet = {
      $pull: { cart_products: { productId } },
    };

    const deleteCart = await CartModel.updateOne(query, updateSet).lean();
    return deleteCart;
  }

  static async getListUserCart(userId) {
    const userCart = await CartModel.findOne({
      cart_userId: userId,
      cart_state: 'active',
    }).lean();
    return userCart;
  }
}

module.exports = CartService;
