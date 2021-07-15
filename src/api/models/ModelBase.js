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

  static async findAllWithPaging(
    attribute = {},
    { size, page, sort, srdir, customSort, query, draw } = {},
  ) {
    let pagingSize = Math.max(size, 1);
    let pageQuery = Math.max(page, 1);
    let sortQuery = sort;
    let srdirQuery = srdir;

    if (!sortQuery) sortQuery = 'updatedAt'; //default sort by latest update

    if (srdirQuery) {
      srdirQuery = srdirQuery < 0 ? 'DESC' : 'ASC';
    } else {
      srdirQuery = 'DESC';
    }

    let result = await this.findAndCountAll({
      limit: pagingSize,
      offset: pagingSize * (pageQuery - 1),
      order: Array.isArray(customSort) ? customSort : [[sortQuery, srdirQuery]],
      ...attribute,
    });

    return {
      ...result,
      page,
      size: pagingSize,
      sort: sortQuery,
      srdir: srdirQuery,
      q: query,
      draw: draw,
    };
  }
}

module.exports = ModelBase;
