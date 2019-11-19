const { isValidEthAddress } = require("../src/ethereumUtils")
const constants = require("../constants");
function proccessUser(req, res, next){
    res.locals.user = req.body.user;
    next();
}

function proccessTransaction(req, res, next){
    res.locals.fromUser = req.body.fromUser;
    res.locals.txID = req.body.txID;
    res.locals.amount = req.body.amount;

    const speed = req.body.speed;
    if((speed != "low") && (speed != "medium") && (speed != "fast")){
        res.statusMessage = " Not valid speed."
        res.status(400).end();
    }
    res.locals.speed = speed;

    const toAddress = req.body.toAddress;
    if(!isValidEthAddress(toAddress)){
        res.statusMessage = "Invalid to address. Try again."
        res.status(400).end()
    }
    res.locals.toAddress = toAddress;

    const amount = req.body.amount;
    if(parseInt(amount) < constants.minWithdraw){
        res.statusMessage = " Amount must be greater than '"+ constants.minWithdraw + "'."
        res.status(400).end();
    }
    res.locals.amount = amount;
    next();
}


module.exports = {
    proccessUser,
    proccessTransaction,
}