'use strict';
const dotenv = require('dotenv').config()
const nodemailer = require("nodemailer");
const exphbs = require('express-handlebars');
const express = require("express");
const path = require('path');
const app = express();
const route = express.Router();
const port = process.env.PORT || 5000;

// View engine setup
app.engine('handlebars', exphbs({
  defaultLayout: null
}));
app.set('view engine', 'handlebars');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/'));

// initialize the server
app.listen(port, () => {
  console.log('Server listening on port ' + port)
})

// loads the main page.
app.get('/', (req, res) => {
  // use the rendering engine (in this case handlebars) to show the page.
  res.render('index', { layout: false });
});


// this route is for passing the information from the order form to the backend
app.post('/send-email', function (req, res) {
  const output = `
  <style>
    body {
      background-color: rgb(26, 153, 147);
    }
    h3 {
      font-size: 10rem;
    }
  </style>    
  <p> New Order Request!</p>
  <h3> Contact Details </h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Date: ${req.body.date}</li>
    <li>Quantity Requested: ${req.body.quantity}</li>
    <li>Theme/Event: ${req.body.theme}</li>
    <li>Shipping: ${req.body.shipOrNo}</li>
    <li>Notes: ${req.body.message}</li>
  </ul>  
  `
  function sendEmail() {
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_LOGIN, // generated ethereal user
          pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Escha the Bones" <escha@nomanshigh.com>', // sender address
        to: "danieljhawn@gmail.com", // list of receivers
        subject: "Testing", // Subject line
        text: "", // plain text body, some email clients won't display HTML
        html: output // html body - this
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    main().catch(console.error);
  };

  sendEmail();
  res.render('success', { msg: 'Your order request has been sent!' });
  
  console.log(output);
});

module.exports = app;