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

module.exports = { insertInventory };
