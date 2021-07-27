const BaseError = require('./BaseError');
class ValidationError extends BaseError {
  constructor(message, data, statusCode = 422) {
    super(message, statusCode);
    this.data = data;
  }
}

module.exports = ValidationError;
