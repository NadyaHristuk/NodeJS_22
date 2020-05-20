const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'cats.shelter.2017@gmail.com',
           pass: 'vesna8888'
       }
   });

   const mailOptions = {
    from: 'elhe2013@gmail.com', // sender address
    to: 'elhe2013@gmail.com', // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html here</p>'// plain text body
  };


  transporter.sendMail(mailOptions)
  .then(result => {
    console.log(result)
                    // res.status(200).json({
                    //     success: result
                    // });
        
    })
                .catch(err => {
        
                    console.log('error: ', err);
                    // res.status(401).json({
                    //     success: false
                    // });
        
                });

                