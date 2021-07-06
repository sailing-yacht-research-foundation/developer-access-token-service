const { Model } = require('sequelize');

class ModelBase extends Model {
  static associateBase(models) {
    this.belongsTo(models.userProfile, {
      as: 'createdBy',
      foreignKey: 'createdById',
      constraints: false,
    });
    this.belongsTo(models.userProfile, {
      as: 'updatedBy',
      foreignKey: 'updatedById',
      constraints: false,
    });
  }

  static associate() {}
}

module.exports = ModelBase;
