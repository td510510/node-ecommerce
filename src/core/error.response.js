'use strict';

const StatusCode = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  INTERNAL_SERVER: 500,
};

const ReasonStatusCode = {
  [StatusCode.FORBIDDEN]: 'Forbidden',
  [StatusCode.UNAUTHORIZED]: 'Unauthorized',
  [StatusCode.NOT_FOUND]: 'Not Found',
  [StatusCode.CONFLICT]: 'Conflict',
  [StatusCode.BAD_REQUEST]: 'Bad Request',
  [StatusCode.INTERNAL_SERVER]: 'Internal Server Error',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.CONFLICT],
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.BAD_REQUEST],
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.NOT_FOUND],
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class AuthenticationError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.UNAUTHORIZED],
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFound extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.NOT_FOUND],
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.FORBIDDEN],
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ErrorResponse,
  ConflictError,
  BadRequestError,
  NotFoundError,
  AuthenticationError,
  NotFound,
  ForbiddenError,
};
