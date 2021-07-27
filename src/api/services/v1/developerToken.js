const dataAccess = require('../../dataAccess/v1/developerToken');
const jwt = require('jsonwebtoken');
const {
  setUpdateMeta,
  setCreateMeta,
  ServiceError,
  statusCodes,
} = require('../../utils/utils');

exports.create = async (
  { name, description, developerId, scopeIds = [] } = {},
  user,
) => {
  let res = {};
  res = setCreateMeta(res, user);

  res.name = name;
  res.description = description;
  res.developerId = developerId;
  res.scopeIds = scopeIds;

  res = setUpdateMeta(res, user);

  const result = await dataAccess.create(res);

  const token = await jwt.sign(
    { id: result.id, issuedAt: Date.now() },
    process.env.JWT_SECRET,
  );

  return { ...result, token };
};

exports.getAll = async (paging) => {
  return await dataAccess.getAll(paging);
};

exports.getAllByDeveloper = async (devId, paging) => {
  return await dataAccess.getAllByDeveloper(devId, paging);
};

exports.getById = async (id) => {
  let result = await dataAccess.getById(id);

  if (!result) throw new ServiceError('Not Found', statusCodes.NOT_FOUND);

  return result;
};

exports.delete = async (id) => {
  let result = await dataAccess.delete(id);

  if (!result) throw new ServiceError('Not Found', statusCodes.NOT_FOUND);

  return result;
};

exports.getScopes = async (id) => {
  let [tokenobj, result] = await Promise.all([
    dataAccess.getById(id),
    dataAccess.getScopes(id),
  ]);

  if (!tokenobj) throw new ServiceError('Not Found', statusCodes.NOT_FOUND);

  return result;
};
