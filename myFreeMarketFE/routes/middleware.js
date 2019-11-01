const uuid4 = require("uuid/v4");

function verifySession (req, res, next){
    var cookie = req.cookies.sessionID;
    if (cookie === undefined)
    {
        res.locals.verified = false;
    } 
    else
    {
        res.locals.verified = true;
    } 
    next();
}


function createSessionID(res){
    res.cookie('sessionID', uuid4(), { maxAge: 10000, httpOnly: true });
}

module.exports = {
    createSessionID,
    verifySession,
}