'use strict';

const ProductService = require('../services/product.service.xxx');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
  async createProduct(req, res, next) {
    new SuccessResponse({
      message: 'Create new product successfully',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async publishedProductByShop(req, res, next) {
    new SuccessResponse({
      message: 'Published product successfully',
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async unpublishedProductByShop(req, res, next) {
    new SuccessResponse({
      message: 'unPublished product successfully',
      metadata: await ProductService.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async getAllDraftsForShop(req, res, next) {
    new SuccessResponse({
      message: 'List of drafts',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async getAllPublishedForShop(req, res, next) {
    new SuccessResponse({
      message: 'List of published',
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async getListSearchProducts(req, res, next) {
    new SuccessResponse({
      message: 'List of search products',
      metadata: await ProductService.searchProducts({
        keySearch: req.params.keySearch,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async findAllProducts(req, res, next) {
    new SuccessResponse({
      message: 'List of products',
      metadata: await ProductService.findAllProducts(req.query),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async findProduct(req, res, next) {
    new SuccessResponse({
      message: 'Get product details successfully',
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async updateProduct(req, res, next) {
    console.log('UpdateProduct ~ req.body:', req.body);
    new SuccessResponse({
      message: 'Update product details successfully',
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
        }
      ),
      options: { limit: 10, page: 1 },
    }).send(res);
  }
}

module.exports = new ProductController();
