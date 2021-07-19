const compose = require('compose-middleware').compose;
const { validationResult } = require('express-validator');

const { ValidationError, statusCodes } = require('../utils/utils');

const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(
      'Invalid requests',
      errors.array(),
      statusCodes.BAD_REQUEST,
    );
  } else {
    next();
  }
};

const validate = (validations = []) => {
  return compose([validations, validationError]);
};

module.exports = validate;
