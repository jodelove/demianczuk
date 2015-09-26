var express = require('express');
var router = express.Router();

// templates

router.get('/o-mnie.html', function(req, res, next) {
  res.render('home', { title: 'Demiańczuk - edukacja matematyczna' });
});

router.get('/oferta.html', function(req, res, next) {
  res.render('offer', { title: 'Demiańczuk - oferta edukacyjna' });
});

router.get('/referencje.html', function(req, res, next) {
  res.render('testimonials', { title: 'Demiańczuk - referencje' });
});

router.get('/kontakt.html', function(req, res, next) {
  res.render('contact', { title: 'Demiańczuk - informacje kontaktowe' });
});

// app urls

router.get('/*', function(req, res, next) {
  res.render('index', { title: 'Demiańczuk - edukacja matematyczna' });
});

module.exports = router;