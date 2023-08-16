// const sqlite = require("sqlite");
// const sqlite3 = require("sqlite3");
// const dbPromise = sqlite.open({
//     filename: "./mindMAPE-db.db",
//     driver: sqlite3.Database
// });

// //Try this:
// // async function openDb() {
// //     return sqlite.open({
// //       filename: './database.db',
// //       driver: sqlite3.Database,
// //     });
// //   }

// module.exports = dbPromise;

const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres
// Option 3: Passing parameters separately (other dialects)

// const sequelize = new Sequelize('mindmapeDB', 'sqlserver ', 'testingLocalLogin', {
//   dialect: 'mssql',
//   host: '127.0.0.1', //'34.89.61.55', 
//   timestamps: false,
//   dialectOptions: {
//     socketPath: 'neon-reporter-395414:europe-west2:mindmape' //or '/cloudsql/mindmape' ?
//   },
// });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mssql',
    server: process.env.INSTANCE_HOST, //'34.89.61.55', 
    user: process.env.DB_USER,
    port: process.env.DB_PORT

  //   timestamps: false,
});

async function tryAuth() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

tryAuth();

module.exports = sequelize;