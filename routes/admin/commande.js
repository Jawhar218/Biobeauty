var express = require('express');
var router = express.Router();
var connection = require('../../lib/db');


router.get('/', (req,res)=>{
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

router.post('/delete/:numCmd' , (req,res)=>{
   // let id = req.params.numCmd;
    connection.query('DELETE FROM commande WHERE numCmd = ?',[req.params.numCmd] , (err) =>{
        if(!err){
            res.redirect('/commande');
        }else{
            console.log(err);
    }
    })
})


module.exports = router;
