const mysql = require('mysql');

const dbConnection = mysql.createPool({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bde2175ab374cb',
    password: 'cabc2fd4',
    db: "heroku_d78b44498ae6bea"
});


module.exports = dbConnection;