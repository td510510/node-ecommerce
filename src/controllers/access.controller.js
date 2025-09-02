'use strict';
const { Created, SuccessResponse } = require('../core/success.reponse');
const AccessService = require('../services/access.service');

class AccessController {
  async signup(req, res, next) {
    const { name, email, password } = req.body;
    new Created({
      message: 'Create new shop account successfully',
      metadata: await AccessService.signup({ name, email, password }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async login(req, res, next) {
    const { email, password, refreshToken } = req.body;
    new SuccessResponse({
      message: 'Login successfully',
      metadata: await AccessService.login({ email, password, refreshToken }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async logout(req, res, next) {
    new SuccessResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }

  async handlerRefreshToken(req, res, next) {
    const { refreshToken } = req.body;
    new SuccessResponse({
      message: 'Get new access token successfully',
      metadata: await AccessService.handlerRefreshToken({ refreshToken }),
      options: { limit: 10, page: 1 },
    }).send(res);
  }
}

module.exports = new AccessController();
