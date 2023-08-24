const { Sequelize } = require('sequelize');

// module.exports = new Sequelize(process.env.PGLINK, {
//   dialect: 'postgres',
//   host: process.env.PGHOST,
//   // port: process.env.PGPORT,
//   // dialectOptions: {
//   //   ssl: process.env.DB_ENABLE_SSL && {
//   //     require: true
//   //   }
//   // }
// });
module.exports = new Sequelize(process.env.PGLINK, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: 'true'
    }
  }, //removed ssl
});
