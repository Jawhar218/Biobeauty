var express = require('express');
const passport = require('passport');
var router = express.Router();
var connection = require('../../lib/db');
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt =require('bcrypt');
const fs = require('fs');
const multer = require('multer'); 
const storage = multer.memoryStorage()
const upload =multer({storage});

/* GET users listing. */

router.get('/signup', function (req, res, next) {
  res.render('clients/signup');
});

router.get('/profile', function (req, res, next) {
	connection.query('SELECT * FROM products p', (err, rows) => {
        if (!err) {
            res.render('clients/profile', {
                title: 'Products',
                products: rows
            });
        } else {
            console.log(err);
        }
    });
  
});

router.get('/commande', (req, res)=>{
	connection.query('SELECT * FROM commande c, products p WHERE c.idProducts = p.id ;' , (err, rows)=>{
        const commande = rows[0];
       // commande.dateCmd = commande.dateCmd ? commande.dateCmd.toISOString().split("T") : null;
        if(!err){
            res.render('admins/commande/commande', {
                title: 'Commandes',
                commandes : rows
        });    
        }else {
            console.log(err);
        }
    })
})


router.post('/signup', (req,res) =>{
  const {name , firstname, tel , email , password} = req.body;
  console.log(req.body);
  connection.query('INSERT INTO customers (name, firstname, tel, email, password) VALUES (?, ? , ?, ?, ?)', [name , firstname , tel , email , password] , (err) => {
    if(!err){
      res.redirect('commande');
    }else{
      console.log(err);
    }
  })
});

// passport.serializeUser(({ id, username }, done) => {
//   done(null, { id, username });
// });

// passport.use(new LocalStrategy(
//   function(username, password, done) { 
      
//       connection.query("SELECT * FROM customers WHERE email = ? ",[username], function(err, rows){
//           if (err)
//               return done(err);
//           if (!rows.length) {
//               return done(null, false);
//             }
//           if (password != rows[0].password)
//               return done(null, false);
//           return done(null, rows[0]);
//       }); 
// }));

router.get('/login', function (req, res, next) {
  res.render('clients/login');
});

router.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query("SELECT * FROM customers WHERE email = ? AND password = ?", [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('profile');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

router.get('/logout', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('../accueil');
	} else {
		response.redirect('../accueil');
	}
	response.end();
});


router.post('/commande' , (req, res)=>{
	res.render('/commande');
})




// router.post('/login',
//  passport.authenticate('local'), 
//   function(req, res){
//     console.log(req.user);
//     res.redirect('profile')
//   }
// )



// router.post('/addcommande' ,upload.single('image'), (req,res) =>{
//     let imagePath = '';
//     if(req.file) {
//         const buffer = req.file.buffer;
//         const name = req.file.originalname;
//         const ext = name.split('.').pop();
//         imagePath = '/images/' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
//         fs.writeFileSync(`./public${imagePath}`, buffer);
//     }
//     const {name , description , price ,date} =req.body;
//     connection.query("INSERT INTO products (name, description, price, date, image) values (?, ?, ?, ?, ?)", [name , description , price , date, imagePath], (err)=>{
//         if(!err){
//             res.redirect('/products');
//         } else {
//             console.log(err);
//         }
//     })
// })




module.exports = router;
