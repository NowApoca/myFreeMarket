
const express = require('express');
const router = express.Router();
const logController = require(__dirname + "/../src/controllers/logController");
const productController = require(__dirname + "/../src/controllers/productController");
const userController = require(__dirname + "/../src/controllers/userController");
const monitorController = require("../src/controllers//monitorController");
const { checkUserExist, validateProductParameters, checkProductExist, validateProductchangeParameters } = require("./middleware")
/* Home */

router.get("/", function(req,res){
    res.send("<h1>Hola</h1>")
});

/* Monitor Apis */

router.get("/ping", monitorController.ping);

/* Log Apis */

router.post("/login", logController.logIn);
router.post("/logup", logController.logUp);

/* Product Apis*/

router.get("/products", productController.getProducts);
router.post("/publish", validateProductParameters, productController.publish);
router.get("/product/:id", checkProductExist, productController.getProductData);
router.post("/product/pause/:id", checkProductExist, productController.pauseProduct);
router.post("/product/unpause/:id", checkProductExist, productController.unpauseProduct);
router.post("/product/delete/:id", checkProductExist, productController.deleteProduct);
router.post("/product/purchase/:productId/:purchaser", productController.purchaseProduct);
router.post("/product/:productId/comment", productController.commentProduct);
router.post("/product/:productId/comment/:action/:numberComment", productController.voteCommentProduct);
router.post("/product/:productId/comment/subcomment/:numberComment", productController.subcommentComment);
router.post("/product/:productId/comment/subcomment/:action/:numberComment/:numberSubcomment", productController.voteSubcommentProduct);
router.post("/product/:productId/change/parameter/:parameter/value/:value", validateProductchangeParameters, productController.changeProductParameters);

// /* User Apis*/

// router.get("/user/:user/products/", checkUserExist, userController.getUserProducts);
// router.get("/user/:user/sales", userController.getUserSales);
// router.get("/user/:user/purchases", userController.getUserPurchases);
// router.get("/user/:user/fav/products", userController.getUserFavProducts);
// router.get("/user/:user/data", userController.getUserData);
// router.get("/user/:user/fav/sellers", userController.getUserFavSellers);
// router.get("/user/:user/historic/movements", userController.getUserHistoricMovement);

// router.post("/user/:user/change/password", checkUserExist, userController.setPassword);
// router.post("/user/:user/change/description", userController.changeDescription);
// router.post("/user/:user/change/data/:data/topic/:topic", userController.changeUserData);
// router.post("/user/:user/change/level/:level", userController.changeUserLevel);
// router.post("/user/:user/notifications", userController.setNotifications);
// router.post("/user/:user/fav/action/:action/:product", userController.getUserProducts);
// router.post("/user/:user/fav/action/:action/:seller", userController.getUserProducts);
// router.post("/user/:user/ban", userController.getUserProducts);
// // router.post("/user/:user/enable/2FA", userController.getUserProducts);
// // router.post("/user/:user/add/deposit/address", userController.getUserProducts);
// // router.post("/user/:user/delete/ip/:ip", userController.getUserProducts);

// /* Complains Apis*/

// router.get("/complain/by/colour/:colour", userController.getUserProducts);
// router.post("/complain/:complainID/change/colour/:colour", userController.getUserProducts);
// router.post("/complain/close/:complainID", userController.getUserProducts);
// router.post("/complain/and/point/:complainID", userController.getUserProducts);
// router.post("/complain/:complainID/comment", userController.getUserProducts);
// router.post("/complain/:complainID/subcomment", userController.getUserProducts);
// router.post("/complain/from/user/:user", userController.getUserProducts);

// /* Balance Apis*/

// router.get("/balance/of/user/:user", userController.getUserProducts);
// router.get("/balance/stats/of/net", userController.getUserProducts);
// router.get("/balance/:dataRequested/of/user/:user", userController.getUserProducts);
// router.post("/balance/edit/address/note/:address", userController.getUserProducts);
// router.post("/balance/withdraw/txID/:txID/user/:user", userController.getUserProducts);
// router.post("/balance/deposit/address/:address/txID/:txID", userController.getUserProducts);
// router.post("/balance/deposit/confirmation/address/:address/txID/:txID", userController.getUserProducts);

/* Auctions Apis*/

// router.get("/auction/data", userController.getUserProducts);
// router.get("/auction/available", userController.getUserProducts);
// router.get("/auction/:auctionID", userController.getUserProducts);
// router.get("/auction/posted", userController.getUserProducts);
// router.get("/auction/participated", userController.getUserProducts);
// router.get("/auction/won", userController.getUserProducts);
// router.post("/auction", userController.getUserProducts);
// router.post("/auction/increase/value", userController.getUserProducts);
// router.post("/auction/comment/:auctionID", userController.getUserProducts);
// router.post("/auction/subcomment/:auctionID", userController.getUserProducts);

module.exports = router;