const smtpTransport = require('../connection/mail');
const config = require('../../config/main');

exports.sendEmail = function (email, subject, html) {
    
    const message = {
        to: email,
        from: config.mailUser,
        subject: subject,
        html: html
    };
                
    smtpTransport.sendMail(message, function(err,info) {
        if(err) {
            console.log(err)    
        } else {
            console.log(info);
        }
      });
};

