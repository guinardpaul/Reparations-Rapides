const nodemailer = require('nodemailer');

module.exports = (router) => {

  var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
      user: "guinardpaul@gmail.com",
      pass: "bidasse12"
    }
  });

  router.post('/sendMail', function (req, res) {
    var mailOptions = {
      from: 'Paul Guinard <guinardpaul@gmail.com>',
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.text
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (err, mail) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        res.status(200).json({
          success: true,
          message: 'Email envoyer',
          obj: mail
        })
      }
    });
  });

  return router;
}