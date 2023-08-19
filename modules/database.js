// const sqlite = require("sqlite");
// const sqlite3 = require("sqlite3");
// const dbPromise = sqlite.open({
//     filename: "./mindMAPE-db.db",
//     driver: sqlite3.Database
// });

// module.exports = dbPromise;
//-------------------------------------------------------------------------------//

// Connect to CockroachDB through Sequelize using certs instead:
// See cert creation here: https://www.cockroachlabs.com/docs/stable/cockroach-cert

// var sequelize = new Sequelize('bank', 'maxroach', '', {
//   dialect: 'postgres',
//   port: 26257,
//   logging: false,
//   dialectOptions: {
//       ssl: {
//           ca: fs.readFileSync('certs/ca.crt')
//               .toString(),
//           key: fs.readFileSync('certs/client.maxroach.key')
//               .toString(),
//           cert: fs.readFileSync('certs/client.maxroach.crt')
//               .toString()
//       }
//   }
// });

// xOL-RkiNCRtvf_NML6RbqA

const { Sequelize } = require('sequelize-cockroachdb');

const connectionString = "postgresql://elliott:xOL-RkiNCRtvf_NML6RbqA@mindmape-9771.8nj.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"; //process.env.DATABASE_URL
const sequelize = new Sequelize(connectionString);


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