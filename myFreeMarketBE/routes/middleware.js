const database = require(__dirname + "/../src/database/database");


async function checkUserExist(){
    const users = database.getUsersCollection();
    const user = await users.findOne({owner: req.params.user});
    if(!user){
        res.status(404).json("User does not exist.");
    }
    res.locals = {
        user: user
    }
    next();
}

module.exports = {
    checkUserExist: checkUserExist
}