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

db.Action = require('./entities/Action')(sequelize);
db.DevTokenAdmin = require('./entities/DevTokenAdmin')(sequelize);
db.Scope = require('./entities/Scope')(sequelize);
db.Developer = require('./entities/Developer')(sequelize);
db.DeveloperToken = require('./entities/DeveloperToken')(sequelize);

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
  // const task = [];

  // for (const key in db) {
  //   if (Object.hasOwnProperty.call(db, key)) {
  //     if (!(db[key].prototype instanceof ModelBase)) continue;
  //     if (!db[key].doSync) continue;

  //     task.push(db[key].sync({ force: true }));
  //   }
  // }
  // await Promise.all(task);
  await db.sequelize.sync({ force: true });
};

module.exports = db;
