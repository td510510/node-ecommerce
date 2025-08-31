'use strict';
const AccessService = require('../services/access.service');

class AccessController {
  async signup(req, res, next) {
    console.log('AccessController:signup', req.body);
    const { name, email, password } = req.body;
    try {
      return res
        .status(201)
        .json(await AccessService.signup({ name, email, password }));
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new AccessController();
