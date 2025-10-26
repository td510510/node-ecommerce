'use strict';

const { BadRequestError } = require('../core/error.response');
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unpublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo');

const { insertInventory } = require('../models/repositories/inventory.repo');

const {
  ProductModel,
  ClothingModel,
  ElectronicModel,
  FurnitureModel,
} = require('../models/product.model');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');

// define Factory pattern class to create product
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, refClass) {
    ProductFactory.productRegistry[type] = refClass;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!type || !productClass)
      throw new Error(`Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!type || !productClass)
      throw new Error(`Invalid product type: ${type}`);

    return new productClass(payload).updateProduct(product_id);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    console.log(
      'publishProductByShop ~ product_shop, product_id:',
      product_shop,
      product_id
    );
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    return await findAllDraftsForShop({
      query: { product_shop, isDraft: true },
      limit,
      skip,
    });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    return await findAllPublishedForShop({
      query: { product_shop, isPublished: true },
      limit,
      skip,
    });
  }

  static async searchProducts({ keySearch }) {
    return await searchProducts({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
    select,
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select,
    });
  }

  static async findProduct({ product_id, unSelect }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }
}

// define base product service class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await ProductModel.create({ ...this, _id: product_id });
    if (!newProduct) throw new BadRequestError('Create new product error');
    await insertInventory({
      productId: newProduct._id,
      stock: this.product_quantity,
      shopId: this.product_shop,
    });
    return newProduct;
  }

  // update product
  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({
      product_id,
      bodyUpdate,
      model: ProductModel,
    });
  }
}

// define subclass for clothing product
class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Create new clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: ClothingModel,
      });
    }

    const updateProduct = await super.updateProduct(product_id, {
      ...updateNestedObjectParser(objectParams),
    });

    return updateProduct;
  }
}

// define subclass for electronic product
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError('Create new clothing error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

// define subclass for furniture product
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('Create new clothing error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
