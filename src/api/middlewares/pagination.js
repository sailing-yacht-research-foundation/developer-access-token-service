const compose = require('compose-middleware').compose;
const { query, validationResult } = require('express-validator');

const { ValidationError, statusCodes } = require('../utils/utils');

const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(
      'Invalid paging parameters',
      errors.array(),
      statusCodes.BAD_REQUEST,
    );
  } else {
    next();
  }
};

const middlewares = [
  [
    query('size').optional().isNumeric().toInt(),
    query('page').optional().isNumeric().toInt(),
    query('srdir').optional().isNumeric().toInt(),
    query('draw').optional().isNumeric().toInt(),
  ],
  validationError,
  (req, res, next) => {
    req.paging = {
      query: req.query.q || '',
      page: req.query.page || 1,
      size: req.query.size || 10,
      sort: req.query.sort,
      draw: req.query.draw,
      srdir: req.query.srdir, //default ascending
    };

    next();
  },
];

const pagingMiddleware = compose(middlewares);

module.exports = pagingMiddleware;
