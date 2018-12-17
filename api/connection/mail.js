//const pgp = require('pg-promise')(/*options*/);
//const config = require('../../config/main');

// Creating a new database instance from the connection details:
//const db = pgp(config.connectionString);


const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
        host: 'mail.kia-bg.com',
        port: 587,
        secure: false,
        auth: {
            user: 'dani@kia-bg.com',
            pass: 'Rm%12-St&953-Ne'
        },
        tls: {
            rejectUnauthorized:false
        }
    });

// Exporting the database object for shared use:
module.exports = smtpTransport;