const uuid = require('uuid');
const { Op } = require('../../models');
const db = require('../../models');
const { includeMeta, distinctArray } = require('../../utils/utils');

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

exports.getByIdWithoutDetail = async (id) => {
  const result = await db.Scope.findByPk(id);

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

exports.updateActions = async (scopeId, actionIds = [], meta) => {
  await Promise.all([
    db.ScopeAction.destroy({
      where: {
        scopeId,
      },
    }),
    db.Scope.update(
      {
        updateAt: meta.updatedAt,
        updatedById: meta.updatedById,
      },
      {
        where: {
          id: scopeId,
        },
      },
    ),
  ]);

  return await db.ScopeAction.bulkCreate(
    distinctArray(actionIds).map((actionId) => ({
      ...meta,
      scopeId,
      actionId,
    })),
  );
};

exports.getActions = async (id, paging) => {
  const data = await db.Action.findAllWithPaging(
    {
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${paging.query}`,
            },
          },
          {
            service: {
              [Op.iLike]: `%${paging.query}`,
            },
          },
        ],
      },
      include: [
        {
          model: db.ScopeAction,
          as: 'scopeActions',
          attributes: [],
          where: {
            scopeId: id,
          },
        },
      ],
    },
    paging,
  );

  return data;
};

exports.getUnassignedActions = async (id, paging) => {
  const data = await db.Action.findAllWithPaging(
    {
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${paging.query}%`,
            },
          },
          {
            service: {
              [Op.iLike]: `%${paging.query}%`,
            },
          },
        ],
        '$scopeActions.id$': {
          [Op.is]: null,
        },
      },
      subQuery: false,
      include: [
        {
          model: db.ScopeAction,
          as: 'scopeActions',
          required: false,
          attributes: [],
          where: {
            scopeId: id,
            // id: {
            //   [Op.is]: null,
            // },
          },
        },
      ],
    },
    paging,
  );

  return data;
};
