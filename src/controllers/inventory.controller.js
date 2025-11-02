const InventoryService = require('../services/inventory.service');
const { SuccessResponse } = require('../core/success.response');
class InventoryController {
  async addStockToInventory(req, res, next) {
    new SuccessResponse({
      message: 'Stock added to inventory successfully',
      metadata: await InventoryService.addStockToInventory({
        productId: req.body.productId,
        location: req.body.location,
        stock: req.body.stock,
        shopId: req.user.userId,
      }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }
}

module.exports = new InventoryController();
