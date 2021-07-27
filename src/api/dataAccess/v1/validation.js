const uuid = require('uuid');
const { Op } = require('../../models');
const db = require('../../models');
const { includeMeta } = require('../../utils/utils');

exports.getTokenById = async (id) => {
  const result = await db.DeveloperToken.findByPk(id, {
    attributes: ['name', 'createdAt', 'developerId'],
    include: [
      {
        model: db.Scope,
        as: 'developerTokenScopes',
        attributes: ['id', 'name', 'group'],
        through: {
          attributes: [],
        },
        include: [
          {
            model: db.Action,
            as: 'actions',
            through: {
              attributes: [],
            },
            attributes: ['id', 'name', 'service'],
          },
        ],
      },
      {
        as: 'developer',
        model: db.Developer,
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  return result?.toJSON();
};
