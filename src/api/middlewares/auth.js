const authSvc = require('../services/v1/auth');
const { AuthError, statusCodes } = require('../utils/utils');
module.exports =
  (loadprofile = false) =>
  async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new AuthError('Token Not Found', statusCodes.BAD_REQUEST);
      next(error);
      return;
    }

    const split = authHeader.split(' ');

    if (split.length < 2) {
      const error = new AuthError('Token Not Found', statusCodes.BAD_REQUEST);
      next(error);
      return;
    }

    const token = split[1];
    let userData;

    try {
      if (loadprofile) {
        userData = await authSvc.validateSessionToken(token);
      } else {
        userData = await authSvc
          .decodeSessionToken(token)
          .then((decodedToken) =>
            Promise.resolve({
              token,
              id: decodedToken.id,
              role: decodedToken.role,
            }),
          );
      }
    } catch (err) {
      const error = new AuthError('Not authenticated.');
      next(error);
      return;
    }

    if (!userData) {
      const error = new AuthError('Not authenticated.');
      next(error);
      return;
    }

    req.user = userData;
    next();
  };
