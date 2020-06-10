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
    connectionLimit: localConfig.connectionLimit,
    host: localConfig.host,
    user: localConfig.user,
    password: localConfig.password,
    database: localConfig.database
});


module.exports = dbPool;