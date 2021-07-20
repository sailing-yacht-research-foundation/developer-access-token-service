const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class Developer extends ModelBase {
  static associate(models) {
    this.hasMany(models.DeveloperToken, {
      as: 'tokens',
      constraints: false,
      foreignKey: 'developerId',
    });
  }
}

module.exports = (sequelize) => {
  Developer.init(
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
      email: {
        type: DataTypes.STRING,
      },
    },
    {
      modelName: 'Developer',
      sequelize,
    },
  );
  return Developer;
};
