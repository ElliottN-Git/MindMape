const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPromise = sqlite.open({
    filename: "./mindMAPE-db.db",
    driver: sqlite3.Database
});

//Try this:
// async function openDb() {
//     return sqlite.open({
//       filename: './database.db',
//       driver: sqlite3.Database,
//     });
//   }

module.exports = dbPromise;