const { BaseError, statusCodes } = require('../utils/utils');

module.exports = (error, req, res, next) => {
  if (!(error instanceof BaseError)) {
    console.error(error);
    if (process.env.NODE_ENV === 'production') {
      res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
      return;
    }
  }
  res
    .status(error.statusCode || 500)
    .json({ message: error.message, data: error.data });
};
