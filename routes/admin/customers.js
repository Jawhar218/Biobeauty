var express = require('express');
var router = express.Router();
var connection = require('../../lib/db');


router.get('/', (req,res)=>{
  connection.query('SELECT * FROM customers ', (err, rows)=> {
    if(!err){
      res.render('admins/customers/customers', {
        title: 'customers',
        customers: rows
      });
    }else {
      console.log(err);
    }
  })
})

router.post('/delete/:id', (req,res) =>{
  const id = req.params.id;
  connection.query('DELETE FROM customers WHERE id= ?', [id] , (err) => {
    if(!err){
      res.redirect('/customers');
    }else{
      console.log(err);
    }
  })
})

module.exports = router;
