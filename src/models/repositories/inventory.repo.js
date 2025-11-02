const { convertToObjectIdMongodb } = require('../../utils');
const InventoryModel = require('../inventory.model');

const insertInventory = ({
  productId,
  location = 'unknown',
  stock,
  shopId,
}) => {
  return InventoryModel.create({
    invent_productId: productId,
    invent_location: location,
    invent_stock: stock,
    invent_shopId: shopId,
  });
};

const reserveInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    invent_productId: convertToObjectIdMongodb(productId),
    invent_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: { invent_stock: -quantity },
    $push: { invent_reservations: { cartId, quantity, createOn: new Date() } },
  };
  const options = { new: true, upsert: true };

  return InventoryModel.updateOne(query, updateSet, options);
};

module.exports = { insertInventory, reserveInventory };
