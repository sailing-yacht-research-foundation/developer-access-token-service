const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class Scope extends ModelBase {
  static associate(models) {
    this.belongsTo(models.Action, {
      as: 'action',
      constraints: false,
      foreignKey: 'actionId',
    });

    this.belongsTo(models.Scope, {
      as: 'scope',
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
    },
    {
      modelName: 'ScopeAction',
      sequelize,
    },
  );
  return Scope;
};
