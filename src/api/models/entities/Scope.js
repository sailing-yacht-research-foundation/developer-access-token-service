const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class Scope extends ModelBase {
  static associate(models) {
    this.belongsToMany(models.Action, {
      through: models.ScopeAction,
      as: 'actions',
      constraints: false,
      foreignKey: 'scopeId',
    });

    this.belongsToMany(models.DeveloperToken, {
      through: models.DeveloperTokenScope,
      as: 'tokenScopes',
      constraints: false,
      foreignKey: 'scopeId',
    });

    this.hasMany(models.DeveloperTokenScope, {
      as: 'developerTokens',
      constraints: false,
      foreignKey: 'scopeId',
    });
  }
}

module.exports = (sequelize) => {
  Scope.init(
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
      description: {
        type: DataTypes.STRING(500),
      },
      group: {
        type: DataTypes.STRING,
      },
    },
    {
      modelName: 'Scope',
      sequelize,
    },
  );
  return Scope;
};
