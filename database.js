const mysql = require('mysql');

const dbConnection = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bde2175ab374cb',
    password: 'cabc2fd4',
});


module.exports = dbConnection;