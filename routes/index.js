const fs = require('fs');
const express = require('express');
const multer = require('multer'); 
var connection = require('../lib/db');
const router = express.Router();
const storage = multer.memoryStorage()
const upload =multer({storage});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('accueil', { title: 'accueil' });
});

router.get('/accueil', function( req , res , next){
  res.render('accueil', { title: 'accueil' });
});

router.get('/accueil', (req, res) => {
  connection.query('SELECT * FROM products', (err, rows) => {
      if (!err) {
          res.render('accueil', {
              title: 'Products',
              products: rows
          });
      } else {
          console.log(err);
      }
  });
});

module.exports = router;
