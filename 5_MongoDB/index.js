const express = require('express');
const {MongoClient, ObjectID} = require('mongodb');
const Joi = require('joi');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());

const url = process.env.dbUrl;

const dbName = 'test';

let db;

app.get('/', (req, res) => {
    res.send('hello from API');
})

app.get('/artists', (req, res)=>{
    db.collection('artists').find().toArray((err, docs) => {
        if (err) return res.sendStatus(500);

        res.send(docs);
    })
})

app.post('/artists', validateArtist, (req, res) =>{
    const artist  = {
        name: req.body.name
    };

    db.collection('artists').insertOne(artist, (err) =>{
        if (err) return res.sendStatus(500);

        res.status(200).json(artist);
    })
} )

app.get('/artists/:id', (req, res) => {
    db.collection('artists').findOne({_id: ObjectID(req.params.id)}, (err, docs) => {
        if (err) return res.sendStatus(500);

        res.status(200).json(docs);
    })
})

app.put('/artists/:id', validateArtist, (req, res) => {
    db.collection('artists').updateOne({_id: ObjectID(req.params.id)}, {$set: {name: req.body.name }}, (err, docs) =>
    {
        if (err) return res.sendStatus(500);
        res.status(200).send('was upd');
    } )
})

app.delete('/artists/:id', (req, res) => {
    db.collection('artists').deleteOne({_id: ObjectID(req.params.id)}, (err, result) => {
        if (err) return res.sendStatus(500);
        res.status(200).send('was del');
    })
})

function validateArtist (req, res, next) {
    const schema = Joi.object().keys({
        name: Joi.string().required()
    });
    const result = Joi.validate(req.body, schema);

    if (result.error) return res.status(400).send(result.error);

    next();
}

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, databaseConect) => {
    if(err) return console.log(err);
    
    console.log("Connected successfully to BD");
   
    db = databaseConect.db(dbName);

    app.listen(process.env.PORT, () => {
        console.log('app is runnin on port ' + process.env.PORT);
    })  
  });
