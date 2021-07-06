const { Model } = require('sequelize');

class ModelBase extends Model {
  static associateBase(models) {
    this.belongsTo(models.DevTokenAdmin, {
      as: 'createdBy',
      foreignKey: 'createdById',
      constraints: false,
    });
    this.belongsTo(models.DevTokenAdmin, {
      as: 'updatedBy',
      foreignKey: 'updatedById',
      constraints: false,
    });
  }

  static associate() {}
}

module.exports = ModelBase;
