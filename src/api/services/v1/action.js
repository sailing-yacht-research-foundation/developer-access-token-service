const dataAccess = require('../../dataAccess/v1/action');
const {
  setUpdateMeta,
  setCreateMeta,
  ServiceError,
  statusCodes,
} = require('../../utils/utils');

exports.upsert = async (id, { name, service } = {}, user) => {
  const isNew = !id;

  let res = isNew ? null : await dataAccess.getById(id);

  if (id && !res) throw new ServiceError('Not Found', statusCodes.NOT_FOUND);

  if (isNew) {
    res = {};
    res = setCreateMeta(res, user);
  }

  res.name = name;
  res.service = service;

  res = setUpdateMeta(res, user);

  return await dataAccess.upsert(id, res);
};

exports.getAll = async (paging) => {
  return await dataAccess.getAll(paging);
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
