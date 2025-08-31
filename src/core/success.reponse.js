'use strict';

const StatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
};

const ReasonStatusCode = {
  [StatusCode.OK]: 'OK',
  [StatusCode.CREATED]: 'Created',
  [StatusCode.ACCEPTED]: 'Accepted',
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode[StatusCode.OK],
    metadata = {},
  }) {
    this.status = statusCode;
    this.message = message ? message : reasonStatusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      statusCode: StatusCode.OK,
      reasonStatusCode: ReasonStatusCode[StatusCode.OK],
      metadata,
    });
  }
}

class Created extends SuccessResponse {
  constructor({ message, metadata, options = {} }) {
    super({
      message,
      statusCode: StatusCode.CREATED,
      reasonStatusCode: ReasonStatusCode[StatusCode.CREATED],
      metadata,
    });
    this.options = options;
  }
}

module.exports = {
  SuccessResponse,
  OK,
  Created,
};
