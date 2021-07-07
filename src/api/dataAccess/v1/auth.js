const db = require('../../models');

exports.upsert = async (userProfile = {}) => {
  const [result] = await db.DevTokenAdmin.upsert({
    ...userProfile,
  });

  return result.toJSON();
};

exports.getById = async (id) => {
  return (await db.DevTokenAdmin.findByPk(id))?.toJSON();
};

exports.getByEmail = async (email) => {
  return (
    await db.DevTokenAdmin.findOne({
      where: {
        email,
      },
    })
  )?.toJSON();
};

exports.delete = async (id) => {
  const data = await db.DevTokenAdmin.findByPk(id);

  if (data) {
    await db.DevTokenAdmin.destroy({
      where: {
        id: id,
      },
    });
  }

  return data?.toJSON();
};

exports.clear = async () => {
  await db.DevTokenAdmin.destroy({
    truncate: true,
    cascade: true,
    force: true,
  });
};
