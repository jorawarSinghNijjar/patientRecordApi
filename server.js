const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const dbConnection = require('./database');

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

//POST SINGLE patient
app.post('/patient', (req, res, next) => {
    let patient = req.body.data;
    if(!patient){
        return res.status(400).send({error: true, message: 'Please provide patient'});
    }

    dbConnection.query('INSERT INTO patients (name, phone_number, disease_type) VALUES (?,?,?)',patient, (err, result, fields) => {
        if(err) throw err;
        return res.send({error: false, data: result, message: 'New patient created successfully!'});
    });
});

//DELETE SINGLE patient
app.delete('/patient', (req, res, next) => {
    let patientId = req.body.id;
    if(!patientId){
        return res.status(400).send({error: true, message: 'Please provide a patient id'});
    }

    dbConnection.query('DELETE FROM patients WHERE id = ?', patientId, (err, result, fields) => {
        if(err) throw err;
        return res.send({error: false, data: result, message:'patient has been updated successfully'});
    });

});



//UPDATE SINGLE patient
app.put('/patient', (req, res, next) => {
    let patientId = req.body.id;
    let patient = req.body.patient;
    if(!patientId || !patient){
        return res.status(400).send({error: true, message: 'Please provide a patient id'});
    }

    dbConnection.query('UPDATE patients SET patient = ? WHERE id = ?', [patient, patientId], (err, result, fields) => {
        if(err) throw err;
        return res.send({error: false, data: result, message:'patient has been updated successfully'});
    });

});



//GET SINGLE patient
app.get('/patient/:id', (req,res,next) => {
    let patientId = req.params.id;
    dbConnection.query('SELECT * FROM patients WHERE id=?', patientId, (err, result, fields) => {
        if(err) throw err;
        return res.send({error: false, data: result, message:'single patient'});
    });
})

//GET route
app.get('/patients', (req, res, next) => {
    dbConnection.query('SELECT * FROM patients', (err, result, fields) =>{
        if(err) throw err;
        return res.send({error: false, data: result, message:"patients list"});
    });
});



//DEFAULT route
app.get('/',(req, res, next) => {
    return res.send({error: false, message:'Default Page'});
});

dbConnection.connect((err) => {
    if(err){
        console.log(err);
    }

    console.log('connected as id: ' + dbConnection.threadId);
    // dbConnection.query('SET GLOBAL sql_mode = "ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"', (err,result,fields) => {
    //     if(err) throw err;
    //     console.log("sql_mode updated successfully!");
    // });

    // dbConnection.query('CREATE DATABASE IF NOT EXISTS api_db', (err,result,fields) => {
    //     if(err) throw err;
    // });

    // dbConnection.query('USE api_db', (err,result,fields) => {
    //     if(err) throw err;
    // })

    let createTable = "CREATE TABLE IF NOT EXISTS patients(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL, phone_number VARCHAR(20) NOT NULL, disease_type VARCHAR(255),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE = InnoDB DEFAULT CHARSET = latin1;";

    dbConnection.query(createTable, (err,result,fields) => {
        if(err) throw err;
        console.log(result)
    })
    app.listen(PORT,() => {
        console.log("Server is running at localhost: " + PORT);
    });
});



module.exports = app;