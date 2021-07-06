const BaseError = require('./BaseError');
class DataAccessError extends BaseError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
  }
}

module.exports = DataAccessError;
