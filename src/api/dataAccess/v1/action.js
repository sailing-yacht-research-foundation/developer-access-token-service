const uuid = require('uuid');
const db = require('../../models');
const { includeMeta } = require('../../utils/utils');

const include = [...includeMeta];

exports.upsert = async (id, data = {}) => {
  if (!id) id = uuid.v4();

  const [result] = await db.Action.upsert({
    ...data,
    id,
  });

  return result?.toJSON();
};

exports.getAll = async (paging = {}) => {
  const result = await db.Action.findAllWithPaging(
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
  const result = await db.Action.findByPk(id, {
    include,
  });

  return result?.toJSON();
};

exports.delete = async (id) => {
  const data = await db.Action.findByPk(id, {
    include,
  });

  if (data) {
    await db.Action.destroy({
      where: {
        id: id,
      },
    });
  }

  return data?.toJSON();
};
