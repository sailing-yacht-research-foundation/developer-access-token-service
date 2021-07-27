const uuid = require('uuid');
const { Op } = require('../../models');
const db = require('../../models');
const { includeMeta } = require('../../utils/utils');

const include = [
  {
    as: 'developer',
    model: db.Developer,
  },
  ...includeMeta,
];

exports.create = async (data = {}) => {
  const id = uuid.v4();
  const [[result], bulk] = await Promise.all([
    db.DeveloperToken.upsert({
      ...data,
      scopeIds: null,
      id: id,
    }),
    db.DeveloperTokenScope.bulkCreate(
      data.scopeIds.map((t) => ({
        developerTokenId: id,
        scopeId: t,
      })),
      {
        returning: false,
      },
    ),
  ]);

  return { ...result?.toJSON(), scopeIds: data.scopeIds };
};

exports.getAll = async (paging = {}) => {
  const result = await db.DeveloperToken.findAllWithPaging(
    {
      where: {
        [Op.or]: [
          {
            name: {
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
  const result = await db.DeveloperToken.findByPk(id, {
    include,
  });

  return result?.toJSON();
};

exports.delete = async (id) => {
  const data = await db.DeveloperToken.findByPk(id, {
    include,
  });

  if (data) {
    await Promise.all([
      db.DeveloperToken.destroy({
        where: {
          id: id,
        },
      }),
      db.DeveloperTokenScope.destroy({
        where: {
          developerTokenId: id,
        },
      }),
    ]);
  }

  return data?.toJSON();
};

exports.getAllByDeveloper = async (devId, paging = {}) => {
  const result = await db.DeveloperToken.findAllWithPaging(
    {
      where: {
        developerId: devId,
        [Op.or]: [
          {
            name: {
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

exports.getScopes = async (id) => {
  const result = await db.Scope.findAll({
    include: [
      {
        model: db.DeveloperTokenScope,
        as: 'developerTokens',
        attributes: [],
        where: {
          developerTokenId: id,
        },
      },
    ],
  });

  return result;
};
