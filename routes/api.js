var express = require('express');
var url = require('url');
var router = express.Router();
var apiKey = process.env.DEMIANCZUK_MAILGUN_API_KEY;
var domain = 'demianczuk.edu.pl';
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

var app = express();

router.get('/wyslij-mail', function (req, res, next) {
  var email = app.get('env') === 'development' ? 'demianczuk@mailinator.com' : 'kontakt@demianczuk.edu.pl';

  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;

  if (!query.contact || !query.course) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400);
    return res.send(JSON.stringify({
      success: false,
      error: 'Some url parts are missing'
    }));
  }

  var data = {
    from: 'demianczuk.edu.pl <no-reply@demianczuk.edu.pl>',
    to: email,
    subject: '[demianczuk.edu.pl] Nowa wiadomość - ' + query.contact,
    text: 'Numer telefonu/email: ' + query.contact + '\n' + 'Rodzaj kursu: ' + query.course + '\n'
  };

  mailgun.messages().send(data).then(function (data) {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({ success: true }));
  }, function (err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({
      success: false,
      error: err
    }));
  });
});

module.exports = router;