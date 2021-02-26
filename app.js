"use strict";
require('dotenv').config()
const nodemailer = require("nodemailer");
const exphbs = require('express-handlebars');
const express = require("express");
// const path = require('path');
const app = express();
const route = express.Router();
const port = 5000;

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', route);

app.listen(port, () => {
  console.log('Server listening on port ' + port)
})

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send-email', function (req, res) {
  // Grab the form data and send email
  res.json().send();
  console.log(req.body);
});

function sendEmail(data) {
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_LOGIN, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Escha the Bones" <escha@nomanshigh.com>', // sender address
      to: "danieljhawn@gmail.com, eschatonnow@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);
};
// sendEmail();