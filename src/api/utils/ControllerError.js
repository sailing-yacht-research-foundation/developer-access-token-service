const BaseError = require('./BaseError');
class ControllerError extends BaseError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
  }
}

module.exports = ControllerError;
