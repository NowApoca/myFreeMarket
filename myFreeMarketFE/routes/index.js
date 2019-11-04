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
  //res.json(student);
  res.redirect("/")
});

router.post('/login/done', verifySession, async function(req,res){
  const user = {
      mail: req.body.mail,
      password: req.body.password
  }
  let resBE = await apiBackEnd.postBackEnd("/login", user);
  if(resBE.data.result == true){
    createSessionID(res, user);
  }
  res.redirect("/")
});

/* POST products routes. */

router.get('/publish', verifySession, async function(req,res){
  res.render('publish',{title: "Express"});
});

router.get('/product/:id/:title', verifySession, async function(req,res){
  const productData = (await apiBackEnd.getBackEnd("/product/"+req.params.id)).data;
  res.render('product',{title: productData.productName, price: productData.price, description: productData.description,
     productKey: productData.productKey});
});

router.post('/product/pause/:id', verifySession, async function(req,res){
  await apiBackEnd.postBackEnd("/product/pause/"+req.params.id,{});
  res.redirect("/")
});

router.post('/product/unpause/:id', verifySession, async function(req,res){
  await apiBackEnd.postBackEnd("/product/unpause/"+req.params.id,{});
  res.redirect("/")
});

router.post('/product/delete/:id', verifySession, async function(req,res){
  await apiBackEnd.postBackEnd("/product/delete/"+req.params.id,{});
  res.redirect("/")
});

router.post('/product/purchase/:id', verifySession, async function(req,res){

  const memCache = require("memory-cache");
  let user = memCache.get(req.cookies.sessionID)

  await apiBackEnd.postBackEnd("/product/purchase/"+req.params.id+"/"+user.user,{});
  res.redirect("/")
});

router.post('/publish/done', verifySession, productsController.publish );

module.exports = router;
