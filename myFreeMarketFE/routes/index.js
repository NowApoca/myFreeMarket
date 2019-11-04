const express = require('express');
const apiBackEnd = require("../src/requestBE");
const router = express.Router();
const { createSessionID, verifySession } = require("./middleware");
const uuid4 = require("uuid/v4");
const logController = require("./controllers/logController");
const productsController = require("./controllers/productsController");
/* GET home page. */

router.get('/', verifySession, logController.rootDomain);

/* GET logout page. */
router.get('/logout', verifySession, function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', verifySession, function(req, res) {
  res.render('login', { title: 'Express' });
});

/* GET logup page. */
router.get('/logup', verifySession, function(req, res) {
  res.render('logup', { title: 'Express' });
});

router.post('/logup/done', verifySession, async function(req,res){
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

router.post('/login/done', verifySession, async function(req,res){
  const user = {
      mail: req.body.mail,
      password: req.body.password
  }
  let resBE = await apiBackEnd.postBackEnd("/login", user);
  if(resBE.data.result == true){
    createSessionID(res, user);
    res.render('home',{user: user.mail});
  }else{
    res.render('index',{result: resBE.data.result});
  }
});

/* POST products routes. */

router.get('/publish', verifySession, async function(req,res){
  res.render('publish',{title: "Express"});
});

router.get('/product/:id/:title', verifySession, async function(req,res){
  const productData = (await apiBackEnd.getBackEnd("/product/"+req.params.id)).data;
  console.log(productData)
  res.render('product',{title: productData.productName, price: productData.price, description: productData.description});
});

router.post('/publish/done', verifySession, productsController.publish );

module.exports = router;
