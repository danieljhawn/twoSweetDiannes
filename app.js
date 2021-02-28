// "use strict";
require('dotenv').config()
const nodemailer = require("nodemailer");
const exphbs = require('express-handlebars');
const express = require("express");
const app = express();
const route = express.Router();
const port = 5000;

// View engine setup
app.engine('handlebars', exphbs({
  defaultLayout: null
}));
app.set('view engine', 'handlebars');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// initialize the server
app.listen(port, () => {
  console.log('Server listening on port ' + port)
})

// loads the orders page.
app.get('/orders', (req, res) => {
  // use the rendering engine (in this case handlebars) to show the page.
  res.render('order', { layout: false });
});

// this route is for passing the information from the form to the backend
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
        subject: "Testing", // Subject line
        text: "", // plain text body, some email clients won't display HTML
        html: output // html body - this
      });
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
  
    main().catch(console.error);
  };

  sendEmail();
  res.render('success', {msg:'Your order request has been sent!'});
  console.log('worked');
  console.log(output);
  
});
