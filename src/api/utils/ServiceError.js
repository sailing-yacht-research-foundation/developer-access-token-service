const BaseError = require('./BaseError');
class ServiceError extends BaseError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
  }
}

module.exports = ServiceError;
