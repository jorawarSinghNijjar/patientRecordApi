const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('./email');

const dbPool = require('./database');

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

    dbPool.query('INSERT INTO patients (name, phone_number, disease_type) VALUES (?,?,?)',patient, (err, result, fields) => {
        if(err) throw err;
        return res.send({error: false, data: result, message: 'New patient created successfully!'});
    });
});

//DELETE SINGLE patient
app.delete('/patient', (req, res, next) => {
    let patientId = req.query.id;
    console.log(req);
    if(!patientId){
        return res.status(400).send({error: true, message: 'Please provide a patient id'});
    }

    dbPool.query('DELETE FROM patients WHERE id = ?', patientId, (err, result, fields) => {
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

    dbPool.query('UPDATE patients SET name = ?, phone_number = ?, disease_type = ? WHERE id = ?', [patient.name, patient.phone_number, patient.disease_type, patientId], (err, result, fields) => {
        if(err) throw err;
        return res.send({error: false, data: result, message:'patient has been updated successfully'});
    });

});



//GET SINGLE patient
app.get('/patient/:id', (req,res,next) => {
    let patientId = req.params.id;
    dbPool.query('SELECT * FROM patients WHERE id=?', patientId, (err, result, fields) => {
        if(err) throw err;
        return res.send({error: false, data: result, message:'single patient'});
    });
})

//GET route
app.get('/patients', (req, res, next) => {
    dbPool.query('SELECT * FROM patients', (err, result, fields) =>{
        if(err) throw err;
        return res.send({error: false, data: result, message:"patients list"});
    });
});

//Send mail

app.post('/send',(req,res,next) => {
    if(!req.body.userEmail){
        return res.status(400).send({error: true, message: 'Please provide email address'});
    }
    const msg = {
        to: req.body.userEmail,
        from: "jorawarsinghnijjar@gmail.com",
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html
    };
    sgMail.send(msg)
    .then(result => {
        console.log(result);
        return res.send({message: "Mail sent successfully",error:false, result});
    })
    .catch(err => console.log(err));
    
})


//DEFAULT route
app.get('/',(req, res, next) => {
    return res.send({error: false, message:'Default Page'});
});

dbPool.on('acquire',(connection) => {
    
    console.log('Connection acquired: ' + connection.threadId);
    // dbPool.query('SET GLOBAL sql_mode = "ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"', (err,result,fields) => {
    //     if(err) throw err;
    //     console.log("sql_mode updated successfully!");
    // });

    // dbPool.query('CREATE DATABASE IF NOT EXISTS api_db', (err,result,fields) => {
    //     if(err) throw err;
    // });

    // dbPool.query('USE api_db', (err,result,fields) => {
    //     if(err) throw err;
    // })

  
    
});

let createTablePatientsQuery = "CREATE TABLE IF NOT EXISTS patients(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL, phone_number VARCHAR(20) NOT NULL, disease_type VARCHAR(255),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE = InnoDB DEFAULT CHARSET = latin1;";

let createTableHospitalsQuery = "CREATE TABLE IF NOT EXISTS hospitals(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL, phone_number VARCHAR(20) NOT NULL, email VARCHAR(255) NOT NULL, subsrciption_type VARCHAR(50) NOT NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE = InnoDB DEFAULT CHARSET = latin1;";

let createTableEmployeesQuery = "CREATE TABLE IF NOT EXISTS employees(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL, phone_number VARCHAR(20) NOT NULL, job_role VARCHAR(50) NOT NULL, hospital_id INT NOT NULL, login_id VARCHAR(255), password VARCHAR(255), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(hospital_id) REFERENCES hospitals(id)) ENGINE = InnoDB DEFAULT CHARSET = latin1;";



dbPool.query(createTablePatientsQuery, (err,result,fields) => {
    if(err) throw err;
    console.log("Patients Table created successfully!");
});


const createTableHospitals = (callback) => {
    dbPool.query(createTableHospitalsQuery, (err,result,fields) => {
        if(err) throw err;
        console.log("Hospitals Table created successfully!");
        // Employees table should be created only after creation of hospitals
        callback();
    });
};

createTableHospitals(() => {
    dbPool.query(createTableEmployeesQuery, (err,result,fields) => {
        if(err) throw err;
        console.log("Employees Table created successfully!");
    });
});

app.listen(PORT,() => {
    console.log("Server is running at localhost: " + PORT);
});



module.exports = app;