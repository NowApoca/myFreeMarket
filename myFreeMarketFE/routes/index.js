const express = require('express');
const apiBackEnd = require("../src/requestBE");
const router = express.Router();
/* GET home page. */

router.get('/', function(req, res) {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.render('index', { result: 'noooo0000000000000000000000000000oooo' });
});

/* GET logout page. */
router.get('/logout', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Express' });
});

/* GET logup page. */
router.get('/logup', function(req, res) {
  res.render('logup', { title: 'Express' });
});

router.post('/logup/done',async function(req,res){
  const user = {
      name : req.body.name,
      lastName : req.body.lastName,
      mail: req.body.mail,
      password: req.body.password
  }
  let result = await apiBackEnd.postBackEnd("/logup", user);
  res.render('index',{result: result.data.result});
  //res.json(student);
   
});

router.post('/login/done',async function(req,res){
  const user = {
      mail: req.body.mail,
      password: req.body.password
  }
  let result = await apiBackEnd.postBackEnd("/login", user);
  res.render('home',{result: result.data.result});
});

router.get('/publish',async function(req,res){
  res.render('publish',{title: "Express"});
});

router.post('/publish/done',async function(req,res){
  const product = {
    productName: req.body.productName,
    price: req.body.price,
    initialStock: req.body.initialStock,
    description: req.body.description,
    dues: req.body.dues,
  }
  let result = await apiBackEnd.postBackEnd("/publish", product);
  res.render('home',{result: result.data.result});
});

module.exports = router;
