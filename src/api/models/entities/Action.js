const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class Action extends ModelBase {
  static associate(models) {
    this.belongsToMany(models.Scope, {
      through: 'ScopeActions',
      as: 'scopeActions',
      constraints: false,
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
