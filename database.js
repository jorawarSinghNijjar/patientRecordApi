const mysql = require('mysql');

const herokuConfig = {
    connectionLimit: 100,
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bde2175ab374cb',
    password: 'cabc2fd4',
    database: "heroku_d78b44498ae6bea"
};

const localConfig = {
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: "patientRecord"
};

const dbPool = mysql.createPool({
    connectionLimit: herokuConfig.connectionLimit,
    host: herokuConfig.host,
    user: herokuConfig.user,
    password: herokuConfig.password,
    database: herokuConfig.database
});


module.exports = dbPool;