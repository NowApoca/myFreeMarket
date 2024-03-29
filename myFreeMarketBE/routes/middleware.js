const database = require(__dirname + "/../src/database/database");

async function checkUserExist(req, res, next){
    const users = database.getUsersCollection();
    const user = await users.findOne({mail: req.params.user});
    if(user === null){
        res.statusMessage = "User does not exist."
        res.status(404).end();
        return;
    }
    res.locals["user"] = user;
    next();
}

async function checkLevel(req, res, next){
    const users = database.getUsersCollection();
    const user = await users.findOne({mail: req.params.user});
    if(user.level < 3){
        res.statusMessage = "User has not enough level account."
        res.status(404).end();
        return;
    }
    next();
}

async function voteComplainMiddleware(req, res, next){
    const users = database.getUsersCollection();
    const complains = database.getComplainsCollection();
    const user = await users.findOne({mail: req.params.user});
    const complain = await complains.findOne({complainKey: req.params.complainId});
    if(complain.voters.indexOf(user.mail) < 0){
        res.locals.voted = false;
    }else{
        res.locals.voted = true;
    }
    next();
}

async function voteCommentComplainMiddleware(req, res, next){
    const users = database.getUsersCollection();
    const complains = database.getComplainsCollection();
    const user = await users.findOne({mail: req.params.user});
    const complain = await complains.findOne({complainKey: req.params.complainId});
    const comment = complain.comments[parseInt(req.params.numberComment)]
    if(comment.voters.indexOf(user.mail) < 0){
        res.locals.voted = false;
    }else{
        res.locals.voted = true;
    }
    res.locals.comment = comment;
    res.locals.numberComment = parseInt(req.params.numberComment)
    next();
}

async function checkProductExist(req, res, next){
    const products = database.getProductsCollection();
    const product = await products.findOne({productKey: req.params.productId});
    if(product === null){
        res.statusMessage = "Product with id '"+ req.params.productId +"' does not exist."
        res.status(404).end();
        return;
    }
    res.locals["productData"] = product;
    next();
}

async function validateProductParameters(req, res, next){
    const parametersNumber = ["price", "initialStock", "dues"]
    res.locals = {
        productName: req.body.productName,
        price: parseInt(req.body.price),
        initialStock: parseInt(req.body.initialStock),
        description: req.body.description,
        dues: parseInt(req.body.dues),
        owner: req.body.owner,
    }
    for(let parameter of parametersNumber){
        if(isNaN(res.locals[parameter])){
            res.statusMessage = "Parameter '" + parameter + "' must be a number."
            res.status(404).end();
            return;
        }
    }
    next();
}

async function validateProductchangeParameters(req, res, next){
    const parametersEnabledToChange = ["price", "initialStock", "dues", "productName", "description"];
    if(parametersEnabledToChange.indexOf(req.params.parameter) < 0){
        res.statusMessage = "Not a product format."
        res.status(404).end();
        return;
    }
    const parametersNumber = ["price", "initialStock", "dues"];
    if(parametersNumber.indexOf(req.params.parameter) >= 0){
        req.params.value = parseInt(req.params.value)
    }
    next();
}

module.exports = {
    checkUserExist,
    checkLevel,
    voteComplainMiddleware,
    voteCommentComplainMiddleware,
    validateProductParameters,
    checkProductExist,
    validateProductchangeParameters,
}