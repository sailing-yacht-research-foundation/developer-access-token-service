const { DataTypes } = require('sequelize');
const ModelBase = require('../ModelBase');

class ExistingTable extends ModelBase {
  static associate(models) {}
}

module.exports = (sequelize) => {
  ExistingTable.init(
    {
      other_column: {
        type: DataTypes.INTEGER,
      },
    },
    {
      modelName: 'ExistingTable',
      sequelize,
    },
  );
  ExistingTable.sync = () => Promise.resolve();
  return ExistingTable;
};
