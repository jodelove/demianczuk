var express = require('express');
var url = require('url');
var router = express.Router();
var apiKey = process.env.DEMIANCZUK_MAILGUN_API_KEY;
var domain = 'demianczuk.edu.pl';
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

var app = express();

router.get('/wyslij-mail', function (req, res, next) {
  var email = app.get('env') === 'development' ? 'demianczuk@mailinator.com' : 'bartosz.demianczuk@gmail.com';

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
    from: 'Demiańczuk - Edukacja Matematyczna <no-reply@demianczuk.edu.pl>',
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

router.get('/opinie', function (req, res, next) {
  // call to http://www.e-korepetycje.net/bartosz-demianczuk/matematyka
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify({
    success: true,
    stats: {
      count: 1,
      opinionCountString: '1 opinię',
      scoreString: '5.0',
      scoreStars: ['fa-star', 'fa-star', 'fa-star', 'fa-star', 'fa-star']
    },
    opinions: [
      {
        name: "Michalina",
        time: "18 sierpnia 2016",
        score: 100,
        textBody: "<p>Korepetytor godny polecenia, udziela cennych rad.</p>"
      }
    ]
  }))
});

module.exports = router;
