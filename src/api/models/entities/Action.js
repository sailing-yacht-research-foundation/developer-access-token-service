const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class Action extends ModelBase {
  static associate(models) {
    this.belongsToMany(models.Scope, {
      through: models.ScopeAction,
      as: 'scopes',
      constraints: false,
      foreignKey: 'actionId',
    });
    this.hasMany(models.ScopeAction, {
      as: 'scopeActions',
      constraints: false,
      foreignKey: 'actionId',
    });
  }
}

module.exports = (sequelize) => {
  Action.init(
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
      service: {
        type: DataTypes.STRING,
      },
    },
    {
      modelName: 'Action',
      sequelize,
    },
  );
  return Action;
};
