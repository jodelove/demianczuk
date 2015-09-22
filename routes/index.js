var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home', { title: 'Demiańczuk - edukacja matematyczna' });
});

router.get('/o-mnie', function(req, res, next) {
  res.render('about-me', { title: 'Demiańczuk - o firmie' });
});

router.get('/oferta', function(req, res, next) {
  res.render('offer', { title: 'Demiańczuk - oferta edukacyjna' });
});

router.get('/referencje', function(req, res, next) {
  res.render('testimonials', { title: 'Demiańczuk - referencje' });
});

router.get('/kontakt', function(req, res, next) {
  res.render('contact', { title: 'Demiańczuk - informacje kontaktowe' });
});

module.exports = router;