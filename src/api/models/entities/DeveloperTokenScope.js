const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class DeveloperTokenScope extends ModelBase {
  static associate(models) {
    this.belongsTo(models.DeveloperToken, {
      as: 'developerTokenScopes',
      constraints: false,
      foreignKey: 'developerTokenId',
    });

    this.belongsTo(models.Scope, {
      as: 'tokenScopes',
      constraints: false,
      foreignKey: 'scopeId',
    });
  }
}

module.exports = (sequelize) => {
  DeveloperTokenScope.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      modelName: 'DeveloperTokenScope',
      sequelize,
    },
  );
  return DeveloperTokenScope;
};
