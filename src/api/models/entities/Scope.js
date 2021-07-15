const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class Scope extends ModelBase {
  static associate(models) {
    this.belongsToMany(models.Action, {
      through: 'ScopeActions',
      as: 'scopeActions',
      constraints: false,
    });

    this.belongsToMany(models.DeveloperToken, {
      through: 'DeveloperTokenScope',
      as: 'tokenScopes',
      constraints: false,
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
    },
    {
      modelName: 'Scope',
      sequelize,
    },
  );
  return Scope;
};
