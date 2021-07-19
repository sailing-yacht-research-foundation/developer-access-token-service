const dataAccess = require('../../dataAccess/v1/scope');
const {
  setUpdateMeta,
  setCreateMeta,
  ServiceError,
  statusCodes,
  createMeta,
} = require('../../utils/utils');

exports.upsert = async (id, { name, description, group } = {}, user) => {
  const isNew = !id;

  let res = isNew ? null : await dataAccess.getById(id);

  if (id && !res) throw new ServiceError('Not Found', statusCodes.NOT_FOUND);

  if (isNew) {
    res = {};
    res = setCreateMeta(res, user);
  }

  res.name = name;
  res.description = description;
  res.group = group;

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

exports.updateActions = async ({ id, actionIds = [] }, user) => {
  let scope = await dataAccess.getByIdWithoutDetail(id);

  if (!scope) throw new ServiceError('Not Found', statusCodes.NOT_FOUND);

  const meta = createMeta(user);

  const result = await dataAccess.updateActions(
    id,
    actionIds.filter((t) => !!t),
    meta,
  );

  return result;
};

exports.getActions = async (id) => {
  const result = await dataAccess.getActions(id);

  return result;
};

exports.getUnassignedActions = async (id, paging) => {
  const result = await dataAccess.getUnassignedActions(id, paging);

  return result;
};
