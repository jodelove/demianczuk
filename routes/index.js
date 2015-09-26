var express = require('express');
var router = express.Router();

// templates

router.get('/o-mnie.html', function (req, res, next) {
  res.render('home', { title: 'Demiańczuk - edukacja matematyczna' });
});

router.get('/oferta.html', function (req, res, next) {
  res.render('offer', { title: 'Demiańczuk - oferta edukacyjna' });
});

router.get('/referencje.html', function (req, res, next) {
  res.render('testimonials', { title: 'Demiańczuk - referencje' });
});

router.get('/kontakt.html', function (req, res, next) {
  res.render('contact', { title: 'Demiańczuk - informacje kontaktowe' });
});

// api urls

router.get('/mail', function (req, res, next) {
  var Mailgun = require('mailgun').Mailgun;
  var mg = new Mailgun('key-613459b22b6fa4bd5aee7d59e182666b');
  mg.sendText('no-reply@demianczuk.com',
         ['malpiszon13@gmail.com'],
         'Behold the wonderous power of email!',
         {'X-Campaign-Id': 'something'},
         function(err) { err && console.log(err) });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));
});

// app urls

router.get('/*', function (req, res, next) {
  res.render('index', { title: 'Demiańczuk - edukacja matematyczna' });
});

module.exports = router;