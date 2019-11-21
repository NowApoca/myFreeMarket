const express = require('express');
const router = express.Router();
const {proccessUser, proccessTransaction, checkUser} = require("./middleware")
const balanceController = require(__dirname + "/../src/controllers/balanceController")
/* Home */

// router.get("/products", productController.getProducts);
// router.post("/publish", productController.publish);

/* Balance Controller */

router.post("/balance/add/deposit/address", checkUser, balanceController.newDepositAddress);
router.post("/balance/withdraw", proccessUser, proccessTransaction, balanceController.withdraw);
router.post("/balance/add/user", checkUser, balanceController.newUser);

module.exports = router;