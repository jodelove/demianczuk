var express = require('express');
var url = require('url');
var router = express.Router();
var apiKey = process.env.DEMIANCZUK_MAILGUN_API_KEY;
var domain = 'demianczuk.edu.pl';
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});
var syncRequest = require('sync-request');
var cheerio = require('cheerio');
var polishPlural = require('smart-plurals').Plurals.getRule('pl');

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
  var email = app.get('env') === 'development' ? 'demianczuk@mailinator.com' : 'bartosz.demianczuk@gmail.com';
  var opinionsHtml = syncRequest('GET', 'http://www.e-korepetycje.net/bartosz-demianczuk#opinie');

  res.setHeader('Content-Type', 'application/json');

  var failure = function () {
    res.status(500);
    return res.send(JSON.stringify({
      success: false,
      error: "Nie udało się pobrać opinii"
    }));
  }

  // check if we got HTML with opinions
  if (!opinionsHtml || opinionsHtml.statusCode !== 200) {
    failure();
  }

  // try to parse opinions
  var $  = cheerio.load(opinionsHtml.getBody());
  var stars = $('.opinion-list .opinion .stars');

  if (!stars.length) {
    failure();
  }

  var totalScore = 0;

  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    var score = parseInt($(stars[i]).prop('class').replace('stars', '').replace('small', '').replace('s_', '').trim()) * 2;
    totalScore += score;
  }
  totalScore = totalScore / (stars.length * 100) * 5.0;

  var scoreStars = [];
  for (var i = 0, score = totalScore; i < 5; i++) {
    if (score > 1) {
      scoreStars.push('fa-star');
      score -= 1.0;
    } else if (score > 0.75) {
      scoreStars.push('fa-star');
      score -= 0.75;
    } else if (score > 0.50) {
      scoreStars.push('fa-star-half-o');
      score -= 0.50;
    } else if (score > 0.25) {
      scoreStars.push('fa-star-half-o');
      score -= 0.25;
    } else {
      scoreStars.push('fa-star-o');
    }
  }

  return res.send(JSON.stringify({
    success: true,
    stats: {
      count: stars.length,
      opinionCountString: stars.length +  " " + polishPlural(stars.length, ['opinia', 'opinie', 'opinii']),
      scoreString: totalScore.toFixed(2),
      scoreStars: scoreStars
    }
  }))
});

module.exports = router;
