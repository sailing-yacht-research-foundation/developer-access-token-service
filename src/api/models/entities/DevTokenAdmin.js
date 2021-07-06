const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class DevTokenAdmin extends ModelBase {
  static associateBase() {}
}

module.exports = (sequelize) => {
  DevTokenAdmin.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      modelName: 'DevTokenAdmin',
      sequelize,
    },
  );
  return DevTokenAdmin;
};
