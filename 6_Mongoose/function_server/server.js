const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const apiArtistsRoutes = require('./artists/artist.router');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger('combined'));
app.use(cors());


app.get('/', (req, res) => {
    res.send('hello from API');
})

app.use('/api/artists', apiArtistsRoutes);

mongoose.connect(process.env.MONGODB_URL, 
    { useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false });
   

console.log("Connected successfully to BD");

app.listen(process.env.PORT, (err)=>{
    if (err) throw err;
    console.log('app is runnin on port ' + process.env.PORT);
})  

async function startServer() {
try {
    await mongoose.connect(process.env.MONGODB_URL, 
        { useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false });
       
    
    console.log("Connected successfully to BD");
   
    app.listen(process.env.PORT, (err)=>{
        if (err) throw err;
        console.log('app is runnin on port ' + process.env.PORT);
    })   
}
 catch (err) {
    console.log(err)
}};

startServer();
