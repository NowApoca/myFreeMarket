
const express = require('express');
const router = express.Router();
const logController = require("../src/controllers/logController");
const productController = require("../src/controllers/productController");

/* Home */

router.get("/", function(req,res){
    res.send("<h1>Hola</h1>")
});

/* Log Apis */

router.post("/login", logController.logIn);
router.post("/logup", logController.logUp);
router.get("/logout", logController.logUp);

/* Product Apis*/

router.post("/publish", productController.publish);

module.exports = router;