const uuid4 = require("uuid/v4");
const memCache = require("memory-cache");

function verifySession (req, res, next){
    let userSession = memCache.get(req.cookies.sessionID);
    if (userSession === null)
    {
        res.locals.verified = false;
    } 
    else
    {
        res.locals.verified = true;
        res.locals.user = userSession.user;
    } 
    next();
}


function createSessionID(res, user){
    const uuid = uuid4();
    memCache.put(uuid,{
        user: user.mail
    },10*1000);
    res.cookie('sessionID', uuid, { maxAge: 10000, httpOnly: true });
}

module.exports = {
    createSessionID,
    verifySession,
}