const nodemailer = require("nodemailer");
require('dotenv').config();

// create reusable transporter object using the default SMTP transport
module.exports = transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "jhernandezd95@gmail.com", // generated ethereal user
      pass: process.env.PASSWORD_EMAIL, // generated ethereal password
    },
  });