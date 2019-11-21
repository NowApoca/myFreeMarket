const { isValidEthAddress } = require("../src/ethereumUtils")
const constants = require("../constants");
const database = require("../src/database/database")

async function checkUser(req, res, next){
    res.locals.user = req.body.user;
    next();
}

async function proccessUser(req, res, next){
    const users = database.getUsersCollection();
    const user = await users.findOne({mail: req.body.fromUser})
    if(user === null){
        res.statusMessage = "Not existing user."
        res.status(400).end()
        return;
    }
    // add own checksum to txID
    res.locals.fromUser = req.body.fromUser;
    next();
}

function proccessTransaction(req, res, next){
    res.locals.txID = req.body.txID;
    res.locals.amount = req.body.amount;

    const speed = req.body.speed;
    if((speed != "low") && (speed != "medium") && (speed != "fast")){
        res.statusMessage = "Not valid speed."
        res.status(400).end()
        return;
    }
    res.locals.speed = speed;

    const toAddress = req.body.toAddress;
    if(!isValidEthAddress(toAddress)){
        res.statusMessage = "Invalid 'to' address. Try again."
        res.status(400).end()
        return;
    }
    res.locals.toAddress = toAddress;

    const amount = req.body.amount;

    if(parseInt(amount) < 0){
        res.statusMessage = "Amount must be greater than '0'."
        res.status(400).end();
        return;
    }

    if(parseInt(amount) <= constants.minWithdraw){
        res.statusMessage = "Amount must be greater than '"+ constants.minWithdraw + "'."
        res.status(400).end();
        return;
    }
    res.locals.amount = amount;
    next();
}

module.exports = {
    checkUser,
    proccessUser,
    proccessTransaction,
}