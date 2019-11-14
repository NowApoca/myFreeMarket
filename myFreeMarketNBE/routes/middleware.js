
function proccessUser(req, res, next){
    res.locals.user = req.body.user;
    next();
}

function proccessTransaction(req, res, next){
    res.locals.toAddress = req.body.toAddress;
    res.locals.fromUser = req.body.fromUser;
    res.locals.txID = req.body.txID;
    res.locals.amount = req.body.amount;
    res.locals.speed = req.body.speed;
    next();
}

module.exports = {
    proccessUser,
    proccessTransaction
}