const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class DeveloperToken extends ModelBase {
  static associate(models) {
    this.belongsToMany(models.Scope, {
      through: 'DeveloperTokenScope',
      as: 'tokenScopes',
      constraints: false,
    });

    this.belongsTo(models.Developer, {
      as: 'developer',
      foreignKey: 'developerId',
      constraints: false,
    });
  }
}

module.exports = (sequelize) => {
  DeveloperToken.init(
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
      modelName: 'DeveloperToken',
      sequelize,
    },
  );
  return DeveloperToken;
};
