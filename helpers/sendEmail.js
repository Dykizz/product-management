const nodemailer = require('nodemailer');
module.exports.sendEmail = (email,subject,html) => {

    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail as the email service
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER, // Your Gmail email address
        clientId: process.env.CLIENT_ID, // OAuth 2.0 client ID
        clientSecret: process.env.CLIENT_SECRET, // OAuth 2.0 client secret
        refreshToken: process.env.REFRESH_TOKEN // OAuth 2.0 refresh token
      }
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: subject, // Subject line
      html : html // Plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}