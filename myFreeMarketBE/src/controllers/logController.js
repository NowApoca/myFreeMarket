const database = require(__dirname + "/../database/database");

async function logIn(req, res){
    const users = database.getUsersCollection();
    const userMail = await users.findOne({mail: req.body.mail});
    const user = await users.findOne({mail: req.body.mail,  password: req.body.password});
    if(user){
        await users.updateOne({mail: req.body.mail}, {$set: {loginFailedAttempts: 0, loginStatus: true}});
        res.status(200).json(user);
    }else{
        let statusMessage = "";
        if(userMail){
            if(userMail.loginFailedAttempts == 2){
                await users.updateOne({mail: req.body.mail}, {$set: {loginStatus: false}});
                statusMessage = "Blocked Account.";
            }else{
                await users.updateOne({mail: req.body.mail}, {$inc: {loginFailedAttempts: 1}});
                statusMessage = "Invalid Mail or Password."
            }
        }else{
            statusMessage = "Invalid Mail or Password."
        }
        res.statusMessage = statusMessage;
        res.status(404).end();
    }
    return;
}

async function logUp(req, res){
    const users = database.getUsersCollection();
    const balance = database.getBalanceCollection();
    const user = await users.findOne({mail: req.body.mail});
    if(user){
        res.statusMessage = "Mail already in use.";
        res.status(404).end()
        return;
    }
    await users.insertOne({name: req.body.name,
        lastName:  req.body.lastName,
        mail: req.body.mail,
        password: req.body.password,
        balance: 100,
        historicPasswords:[],
        favProducts: [],
        favSellers: [],
        sales: [],
        level: 0,
        purchases: [],
        productsPublished: [],
        loginFailedAttempts: 0,
        loginStatus: true});
    let output = {
        result:"DONE"
    }
	res.status(200).json(output);
}

module.exports = {
    logIn,
    logUp,
}