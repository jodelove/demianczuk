var express = require('express');
var router = express.Router();

// templates

router.get('/glowna.html', function (req, res, next) {
  res.render('home', { title: 'Demiańczuk - edukacja matematyczna' });
});

router.get('/o-mnie.html', function (req, res, next) {
  res.render('about', { title: 'Demiańczuk - o mnie' });
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

router.get('/egzamin-gimnazjalny.html', function (req, res, next) {
  res.render('offer/highschool', { title: 'Demiańczuk - egzamin gimnazjalny' });
});

router.get('/matura-podstawowa.html', function (req, res, next) {
  res.render('offer/secondarybasic', { title: 'Demiańczuk - matura podstawowa' });
});

router.get('/matura-rozszerzona.html', function (req, res, next) {
  res.render('offer/secondaryextended', { title: 'Demiańczuk - matura rozszerzona' });
});

router.get('/student.html', function (req, res, next) {
  res.render('offer/student', { title: 'Demiańczuk - student' });
});

router.get('/lekcje-indywidualne.html', function (req, res, next) {
  res.render('offer/individual', { title: 'Demiańczuk - lekcje indywidualne' });
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

router.get('/oferta/*', function (req, res, next) {
  res.render('index', { title: 'Demiańczuk - edukacja matematyczna' });
});

router.get('/*', function (req, res, next) {
  res.render('index', { title: 'Demiańczuk - edukacja matematyczna' });
});

module.exports = router;
