const database = require("../database/database");

async function logIn(req, res){
    const users = database.getUsersCollection();
    const query = await users.find({mail: req.body.mail,  password: req.body.password});
    let output = {};
    query.forEach(function(item){
        if(item){
            output.result = true;
        }else{
            output.result = false;
        }
    })
	res.status(200).json(output);
}

async function logUp(req, res){
    const users = database.getUsersCollection();
    await users.insertOne({name: req.body.name, lastName:  req.body.lastName, mail: req.body.mail,  password: req.body.password});
    let output = {
        result:"DONE"
    }
	res.status(200).json(output);
}

async function logOut(req, res){
    res.send("<h1>LOGEADO UP</h1>")
}

module.exports = {
    logIn,
    logUp,
    logOut,
}