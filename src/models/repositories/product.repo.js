'use strict';

const { ProductModel } = require('../product.model');
const { Type } = require('mongoose');
const { BadRequestError } = require('../../core/error.response');
const { getSelectData, unGetSelectData } = require('../../utils');

const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit = 50, skip = 0 }) => {
  return queryProduct({ query, limit, skip });
};

const searchProducts = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, 'i'); // 'i' for case-insensitive
  const results = await ProductModel.find(
    {
      isPublished: true,
      $text: { $search: regexSearch },
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await ProductModel.findOne({
    _id: product_id,
    product_shop: product_shop,
  });
  if (!foundShop) throw new BadRequestError('Shop not found');
  console.log('foundShop first', foundShop);

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  console.log('foundShop', foundShop);
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await ProductModel.findOne({
    _id: product_id,
    product_shop: Type.ObjectId(product_shop),
  });
  if (!foundShop) throw new BadRequestError('Shop not found');

  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.update(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await ProductModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await ProductModel.findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
};

const queryProduct = async ({ query, limit, skip }) => {
  console.log('queryProduct ~ query:', query);
  return await ProductModel.find({ ...query })
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unpublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
};
