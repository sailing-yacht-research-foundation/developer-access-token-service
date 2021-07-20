const BaseError = require('./BaseError');
class AuthError extends BaseError {
  constructor(message, errorStatusCode = 401) {
    super(message, errorStatusCode);
  }
}

module.exports = AuthError;
