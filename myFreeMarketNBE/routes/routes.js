
const express = require('express');
const router = express.Router();
const {proccessUser, proccessTransaction} = require("./middleware")
const balanceController = require(__dirname + "/../src/controllers/balanceController")
/* Home */

// router.get("/products", productController.getProducts);
// router.post("/publish", productController.publish);

/* Balance Controller */

router.post("/balance/add/deposit/address", proccessUser, balanceController.newDepositAddress);
router.post("/balance/withdraw", proccessTransaction, balanceController.withdraw);

module.exports = router;