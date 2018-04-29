const pgp = require('pg-promise')(/*options*/);
const config = require('../../config/main');

// Creating a new database instance from the connection details:
const db = pgp(config.connectionString);

// Exporting the database object for shared use:
module.exports = db;