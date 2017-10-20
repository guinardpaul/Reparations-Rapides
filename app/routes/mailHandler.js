const nodemailer = require('nodemailer');

module.exports = (router) => {

  var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "guinardpaul@gmail.com",
      pass: "bidasse12"
    }
  });

  router.post('/sendMail', function (req, res) {
    var mailOptions = {
      from: 'guinardpaul@gmail.com',
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
        res.end("error");
      } else {
        console.log("Message sent: " + response.message);
        res.end("sent");
      }
    });
  });

  return router;
}