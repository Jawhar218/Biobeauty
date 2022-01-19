var express = require('express');
const passport = require('passport');
var router = express.Router();
var connection = require('../../lib/db');
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt =require('bcrypt');

router.get('/', function (req, res, next) {
    res.render('admins/adminlogin');
  });
  
router.get('/admindashboard', (req,res,next)=>{
    res.render('admins/admindashboard');
});

passport.serializeUser(({ id, username }, done) => {
    done(null, { id, username });
  });
  
  passport.use(new LocalStrategy(
    function(username, password, done) { 
        
        connection.query("SELECT * FROM users WHERE username = ? ",[username], function(err, rows){
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false);
              }
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false);
            return done(null, rows[0]);
        }); 
  }));
  
  router.post('/adminlogin',
   passport.authenticate('local'), 
    function(req, res){
      res.redirect('admindashboard');
    }
  )


module.exports = router;