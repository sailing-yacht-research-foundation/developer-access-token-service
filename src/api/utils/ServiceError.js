const BaseError = require('./BaseError');
class ServiceError extends BaseError {
  constructor(message, statusCode = 500, data = null) {
    super(message, statusCode);
    this.data = data;
  }
}

module.exports = ServiceError;
