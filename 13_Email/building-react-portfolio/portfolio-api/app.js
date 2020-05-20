const express = require('express');

const cors = require('cors');
require('dotenv').config()

// const sendGrid = require('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');

const app = express();


app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change later to only allow our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.get('/api', (req, res, next) => {
    res.send('API Status: I\'m awesome')
});


app.post('/api/email', (req, res, next) => {

    console.log(req.body);

    sgMail.setApiKey('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');
    const msg = {
          to: 'elhe2013@gmail.com',
          from: 'elhe2013@gmail.com',
          subject: 'From ' + req.body.email,
          text: req.body.message,
          };
        sgMail.send(msg).then(result => {
        console.log(result)
                        res.status(200).json({
                            success: result
                        });
            
        })
                    .catch(err => {
            
                        console.log('error: ', err);
                        res.status(401).json({
                            success: false
                        });
            
                    });

                })

const port = process.env.PORT
app.listen(port, ()=>console.log('Server is running on' + port));


