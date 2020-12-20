const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;

var app = express();
app.use(bodyparser.json());

app.listen(3000, () => {
    console.log('Express server is runnig at port no : 3000')
});

const dbName = "EmployeesDB";
const collection = "Employees";
const url = "mongodb://localhost:27017";
const mongoOptions = { useNewUrlParser: true };

const state = {
    db: null
};

const getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

MongoClient.connect(url, mongoOptions, (err, client) => {
    if (!err) {
        state.db = client.db(dbName);
        console.log('DB Connection Succeded.');
    } else {
        console.log('DB Connection Failed \n Error : ' + JSON.stringify(err));
    }
});

app.get('/employees', (req, res) => {
    state.db.collection(collection).find({}).toArray((err, documents) => {
        if (!err) {
            res.send(documents);
        } else {
            console.log(err);
        }
    })
});

app.get('/employees/:id', (req, res) => {
    let id = req.params.id;
    state.db.collection(collection).find({ _id: getPrimaryKey(id) }).toArray((err, documents) => {
        if (!err) {
            res.send(documents);
        } else {
            console.log(err);
        }
    })
});

app.delete('/employees/:id', (req, res) => {
    let id = req.params.id;
    state.db.collection(collection).findOneAndDelete({ _id: getPrimaryKey(id) }, (err, result) => {
        if (!err) {
            res.send(result);
        } else {
            console.log(err);
        }
    })
});

app.post('/employees', (req, res) => {
    let emp = req.body;
    state.db.collection(collection).insertOne(emp, (err, result) => {
        if (!err) {
            res.send(result);
        } else {
            console.log(err);
        }
    })
});

app.put('/employees', (req, res) => {
    let id = req.body._id;
    let emp = req.body;
    state.db.collection(collection).findOneAndUpdate({ _id: getPrimaryKey(id) }, { $set: { emp_no: emp.emp_no, birth_date: emp.birth_date, first_name: emp.first_name, last_name: emp.last_name, gender: emp.gender, hire_date: emp.hire_date } }, { returnOriginal: false }, (err, result) => {
        if (!err) {
            res.send(result);
        } else {
            console.log(err);
        }
    })
});