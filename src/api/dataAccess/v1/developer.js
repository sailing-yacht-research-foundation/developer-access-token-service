const uuid = require('uuid');
const { Op } = require('../../models');
const db = require('../../models');
const { includeMeta } = require('../../utils/utils');

const include = [...includeMeta];

exports.upsert = async (id, data = {}) => {
  if (!id) id = uuid.v4();

  const [result] = await db.Developer.upsert({
    ...data,
    id,
  });

  return result?.toJSON();
};

exports.getAll = async (paging = {}) => {
  const result = await db.Developer.findAllWithPaging(
    {
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${paging.query}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${paging.query}%`,
            },
          },
        ],
      },
    },
    paging,
  );

  return result;
};

exports.getById = async (id) => {
  const result = await db.Developer.findByPk(id, {
    include,
  });

  return result?.toJSON();
};

exports.delete = async (id) => {
  const data = await db.Developer.findByPk(id, {
    include,
  });

  if (data) {
    await db.Developer.destroy({
      where: {
        id: id,
      },
    });
  }

  return data?.toJSON();
};
