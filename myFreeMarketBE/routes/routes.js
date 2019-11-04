
const express = require('express');
const router = express.Router();
const logController = require("../src/controllers/logController");
const productController = require("../src/controllers/productController");
const userController = require("../src/controllers/userController");

/* Home */

router.get("/", function(req,res){
    res.send("<h1>Hola</h1>")
});

/* Log Apis */

router.post("/login", logController.logIn);
router.post("/logup", logController.logUp);
router.get("/logout", logController.logUp);

/* Product Apis*/

router.get("/products", productController.getProducts);
router.post("/publish", productController.publish);
router.get("/product/:id", productController.getProductData);
router.post("/product/pause/:id", productController.pauseProduct);
router.post("/product/unpause/:id", productController.unpauseProduct);
router.post("/product/delete/:id", productController.deleteProduct);
router.post("/product/purchase/:productId/:purchaser", productController.purchaseProduct);

/* User Apis*/

router.get("/user-products/:user", userController.getUserProducts);

module.exports = router;