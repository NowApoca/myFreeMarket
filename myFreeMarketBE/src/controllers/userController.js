const database = require(__dirname + "/../database/database");

async function getUserProducts(req, res){
    const { user } = res.locals
    const products = database.getProductsCollection();
    // An optimization is save product keys in user and find it.
    const queryResult = await products.find({owner: req.params.user});
    let output = {
        products: [],
    };
    await queryResult.forEach(function(item){
        if(item){
            output.result = true;
            output.products.push(item);
        }else{
            output.result = false;
        }
    })
	res.status(200).json(output);
}

async function getUserSales(req, res){
    const { user } = res.locals
    const products = database.getProductsCollection();
    const queryResult = await products.aggregate([{$match: {productKey: {$in:user.sales}}}])
    let output = {
        products: [],
    };
    await queryResult.forEach(function(item){
        if(item){
            output.result = true;
            output.products.push(item);
        }else{
            output.result = false;
        }
    })
	res.status(200).json(output);
}

async function getUserPurchases(req, res){
    const { user } = res.locals
    const products = database.getProductsCollection();
    const queryResult = await products.aggregate([{$match: {productKey: {$in:user.purchases}}}])
    let output = {
        products: [],
    };
    await queryResult.forEach(function(item){
        if(item){
            output.result = true;
            output.products.push(item);
        }else{
            output.result = false;
        }
    })
	res.status(200).json(output);
}

async function getUserFavProducts(req, res){
    const { user } = res.locals
    const products = database.getProductsCollection();
    const queryResult = await products.aggregate([{$match: {productKey: {$in:user.favProducts}}}])
    let output = {
        products: [],
    };
    await queryResult.forEach(function(item){
        if(item){
            output.result = true;
            output.products.push(item);
        }else{
            output.result = false;
        }
    })
	res.status(200).json(output);
}

async function getUserData(req, res){
    const { user } = res.locals;
    const output = {
        balance: user.balance
    }
	res.status(200).json(output);
}

async function getUserFavSellers(req, res){
    const { user } = res.locals
    const products = database.getProductsCollection();
    const queryResult = await products.aggregate([{$match: {productKey: {$in:user.favSellers}}}])
    let output = {
        products: [],
    };
    await queryResult.forEach(function(item){
        if(item){
            output.result = true;
            output.products.push(item);
        }else{
            output.result = false;
        }
    })
	res.status(200).json(output);
}

async function getUserHistoricMovement(req, res){
    const { user } = res.locals;
    const output = user.movements;
	res.status(200).json(output);
}

async function setPassword(req, res){
    const { user } = res.locals;
    if(user.historicPasswords.indexOf(req.body.newPassword) > 0){
        user.historicPasswords.push(user.password);
        await users.updateOne({owner: req.params.user},{"$set":{password: req.params.newPassword, passwords: user.passwords}})
        res.status(200).json("Done.");
    }
    res.status(404).json("Password already used.");
}

async function setDescription(req, res){
    await users.updateOne({owner: req.params.user},{"$set":{description: req.body.description}})
    res.status(200).json("Done.");
    
}

async function setUserData(req, res){
    const { user } = res.locals;
    user[req.params.topic] = req.params.data
    await users.updateOne({owner: req.params.user},{"$set":{description: req.body.description}})
    res.status(200).json("Done.");
    
}

async function setUserLevel(req, res){
    await users.updateOne({owner: req.params.user},{"$set":{level: parseInt(req.params.level)}})
    res.status(200).json("Done.");
    
}

async function setNotifications(req, res){
    await users.updateOne({owner: req.params.user},{"$set":{notifications: req.body.notifications}})
    res.status(200).json("Done.");
    
}

async function favSeller(req, res){
    const { user } = res.locals;
    if(req.params.action == "unfav"){
        user.favSellers.splice(user.favSellers.indexOf(req.params.seller),1);
    }else{
        user.favSellers.push(req.params.seller);
    }
    await users.updateOne({owner: req.params.user},{"$set":{favSellers: user.favSellers}})
    res.status(200).json("Done.");
    
}

async function favProduct(req, res){
    const { user } = res.locals;
    if(req.params.action == "unfav"){
        user.favSellers.splice(user.favProducts.indexOf(req.params.product),1);
    }else{
        user.favSellers.push(req.params.product);
    }
    await users.updateOne({owner: req.params.user},{"$set":{notifications: user.favProducts}})
    res.status(200).json("Done.");
    
}

async function banUser(req, res){
    const { user } = res.locals;
    user.status = {
        available: false,
        expirationBan: req.body.expirationBan,
        reason: req.body.reason,
        banner: req.body.banner,
    }
    await users.updateOne({owner: req.params.user},{"$set":{status: user.status}})
    res.status(200).json("Done.");
    
}

module.exports = {
    getUserProducts,
    getUserSales,
    getUserPurchases,
    getUserFavProducts,
    getUserData,
    getUserFavSellers,
    getUserHistoricMovement,
    setPassword,
    setDescription,
    setUserData,
    setUserLevel,
    setNotifications,
    favSeller,
    favProduct,
    banUser,
}