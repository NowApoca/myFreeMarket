const database = require(__dirname + "/../src/database/database");


async function checkUserExist(){
    const users = database.getUsersCollection();
    const user = await users.findOne({owner: req.params.user});
    if(!user){
        res.statusMessage = "User does not exist."
        res.status(404);
    }
    res.locals = {
        user: user
    }
    next();
}

async function checkProductExist(req, res, next){
    const products = database.getProductsCollection();
    const product = await products.findOne({productKey: req.params.id});
    if(!product){
        res.statusMessage = "Product with id '"+ req.params.id +"' does not exist."
        res.status(404).end();
        return;
    }
    res.locals = {
        productData: product
    }
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
    checkUserExist: checkUserExist,
    validateProductParameters,
    checkProductExist,
    validateProductchangeParameters,
}