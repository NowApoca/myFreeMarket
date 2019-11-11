const database = require(__dirname + "/../database/database");

async function getUserProducts(req, res){
    const { user } = res.locals;
    const products = database.getProductsCollection();
    // An optimization is save product keys in user and find it.
    const queryResult = await products.find({owner: user.mail});
    let output = [];
    await queryResult.forEach(function(item){
        if(item){
            output.push(item);
        }
    })
	res.status(200).json(output);
}

async function getUserProductsMovements(req, res){
    const { user } = res.locals
    const products = database.getProductsCollection();
    const queryResult = await products.aggregate([{$match: {productKey: {$in: user[req.params.action]}}}])
    let output = [];
    await queryResult.forEach(function(item){
        if(item){
            output.push(item);
        }
    })
	res.status(200).json(output);
}

async function getUserFavProducts(req, res){
    const { user } = res.locals
    const products = database.getProductsCollection();
    const queryResult = await products.aggregate([{$match: {productKey: {$in:user.favProducts}}}])
    let output = [];
    await queryResult.forEach(function(item){
        if(item){
            output.push(item);
        }
    })
	res.status(200).json(output);
}

async function getUserData(req, res){
    const { user } = res.locals;
    const output = {
        balance: user.balance,
        name: user.name,
        mail: user.mail
    }
	res.status(200).json(output);
}

async function getUserFavSellers(req, res){
    const { user } = res.locals
    const users = database.getProductsCollection();
    const queryResult = await users.aggregate([{$match: {mail: {$in:user.favSellers}}}])
    let output = [];
    await queryResult.forEach(function(item){
        if(item){
            output.push(item);
        }
    })
	res.status(200).json(output);
}

async function setPassword(req, res){
    const { user } = res.locals;
    if(user.historicPasswords.indexOf(req.body.newPassword) < 0){
        const users = database.getUsersCollection();
        user.historicPasswords.push(user.password, req.body.newPassword);
        await users.updateOne({mail: req.params.user},{"$set":{password: req.body.newPassword, historicPasswords: user.historicPasswords}})
        res.status(200).json("Done.");
    }
    res.statusMessage = "Password already used."
    res.status(404).end();
}

async function setDescription(req, res){
    const users = database.getUsersCollection();
    await users.updateOne({mail: req.params.user},{"$set":{description: req.body.description}})
    res.status(200).json("Done.");
}

async function setUserData(req, res){
    const { user } = res.locals;
    user[req.params.topic] = req.params.data
    await users.updateOne({owner: req.params.user},{"$set":{description: req.body.description}})
    res.status(200).json("Done.");
}

async function setUserLevel(req, res){
    const users = database.getUsersCollection();
    await users.updateOne({mail: req.params.user},{"$set":{level: parseInt(req.params.level)}});
    res.status(200).json("Done.");
    
}

async function setNotifications(req, res){
    await users.updateOne({owner: req.params.user},{"$set":{notifications: req.body.notifications}})
    res.status(200).json("Done.");
    
}

async function favSeller(req, res){
    const { user } = res.locals;
    const users = database.getUsersCollection();
    const seller = await users.findOne({mail: req.params.favSeller})
    if(seller === null){
        res.statusMessage = "No existing user."
        res.status(404).end()
        return;
    }
    if(req.params.action == "unfav"){
        user.favSellers.splice(user.favSellers.indexOf(req.params.favSeller),1);
    }else{
        user.favSellers.push(req.params.favSeller);
    }
    await users.updateOne({mail: user.mail},{"$set":{favSellers: user.favSellers}})
    res.status(200).json("Done.");
    
}

async function favProduct(req, res){
    const { user } = res.locals;
    const users = database.getUsersCollection();
    if(req.params.action == "unfav"){
        user.favProducts.splice(user.favProducts.indexOf(req.params.product),1);
    }else{
        user.favProducts.push(req.params.productId);
    }
    await users.updateOne({mail: user.mail},{"$set":{favProducts: user.favProducts}})
    res.status(200).json("Done.");
    
}

async function banUser(req, res){
    const { user } = res.locals;
    const users = database.getUsersCollection();
    await users.updateOne({mail: req.params.banned},{"$set":{status: {
        available: false,
        expirationBan: req.body.expirationBan,
        reason: req.body.reason,
        banned: req.params.banned,
    }}})
    res.status(200).json("Done.");
}

module.exports = {
    getUserProducts,
    getUserProductsMovements,
    getUserFavProducts,
    getUserData,
    getUserFavSellers,
    setPassword,
    setDescription,
    setUserData,
    setUserLevel,
    setNotifications,
    favSeller,
    favProduct,
    banUser,
}