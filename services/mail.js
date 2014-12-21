var nodemailer = require('nodemailer');


// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(global.config.smtp);

exports.sendConfirmationMail = function(user, token) {
    var html = '<b>Hello ' + (user.displayName || user.username) + '</b><br>' +
            'We need to confirm that this email address is yours. By clicking ' +
            'the link below, you will confirm this e-mail address belongs to you ' +
            'and your acount will be activated.<br><br>' +
            '<a href="' + global.config.siteRoot + '/user/confirmation/' + token + '" ' +
            'target="_blank">Confirm</a><br><br>Regards<br><br>Vitrine';

    var mailOptions = {
        from: 'Vitrine <info@vitrine.im>',
        to: user.email,
        subject: 'Account confirmation',
        html: html
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};


exports.sendWelcomeMail = function(user) {
    var mailOptions = {
        from: 'Vitrine ✔ <info@vitrine.im>', // sender address
        to: user.email, // list of receivers
        subject: 'Welcome to Vitrine', // Subject line
        html: '<b>Hello world ✔</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};
