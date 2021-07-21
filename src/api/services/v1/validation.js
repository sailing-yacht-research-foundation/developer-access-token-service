const dataAccess = require('../../dataAccess/v1/validation');
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);
const { ServiceError, statusCodes } = require('../../utils/utils');

exports.validateToken = async (token) => {
  let decoded = null;
  try {
    decoded = await verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ServiceError('Invalid Token', statusCodes.BAD_REQUEST);
  }

  let result = await dataAccess.getTokenById(decoded.id);

  if (!result) throw new ServiceError('Inactive', statusCodes.NOT_FOUND);

  let scopes = [];
  let actions = new Map();

  (result.developerTokenScopes || []).forEach((scope) => {
    scopes.push({
      id: scope.id,
      name: scope.name,
      group: scope.group,
    });

    (scope.actions || []).forEach((action) => {
      actions.set(action.id, action);
    });
  });

  return {
    name: result.name,
    developerId: result.developerId,
    createdAt: result.createdAt,
    scopes: scopes,
    actions: Array.from(actions.values()),
    developer: result.developer,
  };
};
