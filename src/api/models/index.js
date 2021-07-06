const { Sequelize, Op } = require('sequelize');
const ModelBase = require('./ModelBase');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
);

const db = {};

for (const key in db) {
  if (Object.hasOwnProperty.call(db, key)) {
    if (db[key].prototype instanceof ModelBase) {
      db[key].associate(db);
      db[key].associateBase(db);
    }
  }
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

db.startDB = async () => {
  await sequelize.authenticate();
};

db.sync = async () => {
  await db.sequelize.sync({
    force: true,
  });
};

module.exports = db;
