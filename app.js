'use strict';
const dotenv = require('dotenv').config()
const nodemailer = require("nodemailer");
const exphbs = require('express-handlebars');
const express = require("express");
const path = require('path');
const app = express();
const route = express.Router();
const port = process.env.PORT || 465;

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

// loads the orders page.
app.get('/orders', (req, res) => {
  // use the rendering engine (in this case handlebars) to show the page.
  res.render('order', { layout: false });
});

// main route
app.get('/', express.static(path.join(__dirname, "/")));

// for development and debugging
if (require.main === module) {
  require('http').createServer(app).listen(3000, function () {
    console.info("Listening for HTTP on", this.address());
  });
}

// this route is for passing the information from the order form to the backend
app.post('/send-email', function (req, res) {
  const output = `
  <style>
    h3 {
      font-size: 3rem;
    }
  </style>    
  <p> New Order Request!</p>
  <h3> Contact Details </h3>
  <ul>
    <li>Custom or Catalog: ${req.body.customOrCatalog}</li>
    <li>Occasion: ${req.body.occasion}</li>
    <li>Cookie Options: ${req.body.cookieOptions}</li>
    <li>Cookie Details: ${req.body.orderDetails}</li>
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
        to: "danieljhawn@gmail.com, eschatonnow@gmail.com", // list of receivers
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