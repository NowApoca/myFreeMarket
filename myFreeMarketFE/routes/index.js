const express = require('express');
const apiBackEnd = require("../src/requestBE");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
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
  res.render('logup', {});
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
  console.log(result);
  res.render('home',{result: result.data.result});
});

module.exports = router;
