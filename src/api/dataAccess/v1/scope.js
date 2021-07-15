const uuid = require('uuid');
const db = require('../../models');
const { includeMeta } = require('../../utils/utils');

const include = [...includeMeta];

exports.upsert = async (id, data = {}) => {
  if (!id) id = uuid.v4();

  const [result] = await db.Scope.upsert({
    ...data,
    id,
  });

  return result?.toJSON();
};

exports.getAll = async (paging = {}) => {
  const result = await db.Scope.findAllWithPaging(
    {
      where: {
        name: {
          [db.Op.iLike]: `%${paging.query}%`,
        },
      },
    },
    paging,
  );

  return result;
};

exports.getById = async (id) => {
  const result = await db.Scope.findByPk(id, {
    include,
  });

  return result?.toJSON();
};

exports.delete = async (id) => {
  const data = await db.Scope.findByPk(id, {
    include,
  });

  if (data) {
    await db.Scope.destroy({
      where: {
        id: id,
      },
    });
  }

  return data?.toJSON();
};
