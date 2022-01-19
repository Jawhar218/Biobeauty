const fs = require('fs');
const express = require('express');
const multer = require('multer'); 
var connection = require('../../lib/db');
const router = express.Router();
const storage = multer.memoryStorage()
const upload =multer({storage});


router.get('/', (req, res) => {
    connection.query('SELECT * FROM products', (err, rows) => {
        if (!err) {
            res.render('admins/products/products', {
                title: 'Products',
                products: rows
            });
        } else {
            console.log(err);
        }
    });
});

router.post('/delete/:id', (req,res) =>{
    const id = req.params.id;
    connection.query('DELETE FROM products WHERE id = ?' , [id], (err)=> {
        if (!err) {
            res.redirect('/products');
        } else {
            console.log(err);
        }
    })
});

router.get('/edit/:id', (req,res)=>{
    const id = req.params.id;
    connection.query('SELECT * FROM products WHERE id = ?',[id], (err , row)=>{
        const product = row[0];
       // product.date = product.date ? product.date.toISOString().split("T")[0] : null;
        if(!err) {
            res.render('admins/products/edit', {
                title: 'edit',
                product
            });
        } else {
            console.log(err);
        }
    });
});

router.post('/edit/:id',upload.single('image'), (req,res) =>{
    const { name, description, price, date , } = req.body;
    const id=req.params.id;
    let imagePath = '';
    if(req.file) {
        const buffer = req.file.buffer;
        const name = req.file.originalname;
        const ext = name.split('.').pop();
        imagePath = '/images/' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
        console.log(imagePath);
        fs.writeFileSync(`./public${imagePath}`, buffer);
    }
    connection.query('UPDATE products SET name = ? , description = ? , price = ? , date = ? , image = ? WHERE id = ? ', [name,description,price,date,imagePath,id] ,(err)=>{
        if(!err){
            res.redirect('/products');
        }
    });
});

router.get('/add', (req,res)=> {
    res.render('admins/products/add');
})
router.post('/add' ,upload.single('image'), (req,res) =>{
    let imagePath = '';
    if(req.file) {
        const buffer = req.file.buffer;
        const name = req.file.originalname;
        const ext = name.split('.').pop();
        imagePath = '/images/' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
        fs.writeFileSync(`./public${imagePath}`, buffer);
    }
    const {name , description , price ,date} =req.body;
    connection.query("INSERT INTO products (name, description, price, date, image) values (?, ?, ?, ?, ?)", [name , description , price , date, imagePath], (err)=>{
        if(!err){
            res.redirect('/products');
        } else {
            console.log(err);
        }
    })
})



module.exports = router;