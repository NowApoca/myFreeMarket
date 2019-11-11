
const express = require('express');
const router = express.Router();
const logController = require(__dirname + "/../src/controllers/logController");
const productController = require(__dirname + "/../src/controllers/productController");
const userController = require(__dirname + "/../src/controllers/userController");
const complianController = require(__dirname + "/../src/controllers/complainController");
const monitorController = require("../src/controllers//monitorController");
const { checkUserExist, validateProductParameters,
     checkProductExist, validateProductchangeParameters,
     checkLevel, voteComplainMiddleware,
     voteCommentComplainMiddleware } = require("./middleware")
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
router.get("/product/:productId", checkProductExist, productController.getProductData);
router.post("/product/pause/:productId", checkProductExist, productController.pauseProduct);
router.post("/product/unpause/:productId", checkProductExist, productController.unpauseProduct);
router.post("/product/delete/:productId", checkProductExist, productController.deleteProduct);
router.post("/product/purchase/:productId/:purchaser", productController.purchaseProduct);
router.post("/product/:productId/comment", productController.commentProduct);
router.post("/product/:productId/comment/vote/:action/:numberComment", productController.voteCommentProduct);
router.post("/product/:productId/subcomment/:numberComment", productController.subcommentComment);
router.post("/product/:productId/subcomment/vote/:action/:numberComment/:numberSubcomment", productController.voteSubcommentProduct);
router.post("/product/:productId/change/parameter/:parameter/value/:value", validateProductchangeParameters, productController.changeProductParameters);

// /* User Apis*/

router.get("/user/:user/products", checkUserExist, userController.getUserProducts);
router.get("/user/:user/products/movements/:action", checkUserExist, userController.getUserProductsMovements);
router.get("/user/:user/fav/products", checkUserExist, userController.getUserFavProducts);
router.get("/user/:user/fav/sellers", userController.getUserFavSellers);
router.get("/user/:user/data", checkUserExist, userController.getUserData);

router.post("/user/:user/change/password", checkUserExist, userController.setPassword);
router.post("/user/:user/change/description", userController.setDescription);
router.post("/user/:user/change/level/:level", checkLevel, userController.setUserLevel);
router.post("/user/:user/fav/product/action/:action/:productId", checkUserExist, checkProductExist, userController.favProduct);
router.post("/user/:user/fav/seller/action/:action/:favSeller", checkUserExist, userController.favSeller);
router.post("/user/:user/ban/:banned", checkLevel, checkUserExist, userController.banUser);

// router.post("/user/:user/change/data/:data/topic/:topic", userController.setUserData);
// router.post("/user/:user/notifications", userController.setNotifications);
// router.post("/user/:user/enable/2FA", userController.getUserProducts);
// router.post("/user/:user/add/deposit/address", userController.getUserProducts);
// router.post("/user/:user/delete/ip/:ip", userController.getUserProducts);

// /* Complains Apis*/

router.get("/complain/by/colour/:colour", complianController.getComplainsByColour);
router.post("/complain/:complainId/change/colour/:colour", complianController.setComplainColour);
router.post("/complain/close/:complainId/user/:user", complianController.closeComplain);
router.post("/complain/comment/:complainId/user/:user", complianController.commentComplain);
router.post("/complain/:complainId/vote/:action/user/:user", checkUserExist, voteComplainMiddleware, complianController.voteComplain);
router.post("/complain/:complainId/vote/:action/user/:user/comment/:numberComment", checkUserExist, voteCommentComplainMiddleware, complianController.voteComplainComment);
router.post("/complain/new/user/:user", checkUserExist, complianController.newComplain);

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