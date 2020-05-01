const mongoose = require('mongoose');
const express = require('express');
const {ObjectID} = require('mongodb');
const Joi = require('joi');
require('dotenv').config();

const artistModel = require('./api/artist/artist.model');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const url = process.env.dbUrl;

app.get('/', (req, res) => {
    res.send('hello from API');
})

app.get('/artist', async (req, res)=>{
    const docs = await artistModel.find();

    res.send(docs);
})

app.post('/artist', validateArtist, (req, res) =>{
    const artist  = {
        name: req.body.name
    }

    artistModel.insert(artist, (err,  result) =>{
        if (err) {
            return res.sendStatus(500);
        }
        res.send(artist);
    })
} )

app.get('/artist/:id', async (req, res) => {
      
try{const artist = await artistModel.findById({_id: req.params.id});
if(!artist){
    res.send('not found');}
res.send(artist);
}
catch (error){
    res.send(error);
} 
})

app.put('/artist/:id', validateArtist, async (req, res) => {
    try{ const artist = await artistModel.findByIdAndUpdate({_id: req.params.id}, {$set: {name: req.body.name }, new:true});
        res.send(artist);}
        catch (error){
            res.send(error);
        }
})

app.delete('/artist/:id', async(req, res) => {
    try{await artistModel.deleteById({_id: req.params.id})
    res.send('was del');}
    catch(error) {
        res.send(error);
    }
})

function validateArtist (req, res, next) {
    const schema = Joi.object().keys({
        name: Joi.string().required()
    })
    const result = Joi.validate(req.body, schema);
		if (result.error) {
			return res.status(400).send(result.error);
		}
    next();
}

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if(err) {
        console.log(err);
      process.exit(1);
    }
    
    console.log("Connected successfully to BD");
   
    app.listen(process.env.PORT, ()=>{
        console.log('app is runnin on port ' + process.env.PORT);
    })   
  });
