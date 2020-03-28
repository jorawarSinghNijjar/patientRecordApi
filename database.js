const mysql = require('mysql');

const dbPool = mysql.createPool({
    connectionLimit: 100,
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bde2175ab374cb',
    password: 'cabc2fd4',
    database: "heroku_d78b44498ae6bea"
});


module.exports = dbPool;