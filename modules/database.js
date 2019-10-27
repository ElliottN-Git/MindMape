const sqlite = require("sqlite");
const dbPromise = sqlite.open("./mindMAPE-db.db");
module.exports = dbPromise;