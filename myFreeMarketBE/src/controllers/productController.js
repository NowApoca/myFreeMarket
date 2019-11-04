const database = require("../database/database");
const uuidv4 = require('uuid/v4');

async function getProducts(req, res){
    const products = database.getProductsCollection();
    const queryResult = await products.find();
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

async function publish(req, res){
    const products = database.getProductsCollection();
    const result = {};
    try{
        const item = {productName: req.body.productName,
            price: req.body.price,
            initialStock: req.body.initialStock,
            description: req.body.description,
            dues: req.body.dues,
            status: "available",
            owner: req.body.owner,
            productKey: uuidv4(),
            timestamp: Math.trunc((new Date()).getTime()/1000)}
        await products.insertOne(item);
        result.id = item.productKey;
        result.result = "ok";
        
    }catch(e){
        console.log(e);
        result.id = null;
        result.result = "err";
    }
	res.status(200).json(result);
}

async function getProductData(req, res){
    const products = database.getProductsCollection();
    const productData = await products.findOne({productKey: req.params.id})
	res.status(200).json(productData);
}

async function pauseProduct(req, res){
    const products = database.getProductsCollection();
    const productData = await products.updateOne({productKey: req.params.id},{ $set: { status: "paused"} });
	res.status(200).json(productData);
}

async function unpauseProduct(req, res){
    const products = database.getProductsCollection();
    const productData = await products.updateOne({productKey: req.params.id},{ $set: { status: "available"} });
	res.status(200).json(productData);
}

async function deleteProduct(req, res){
    const products = database.getProductsCollection();
    const productData = await products.deleteOne({productKey: req.params.id});
	res.status(200).json(productData);
}

async function purchaseProduct(req, res){
    const products =  database.getProductsCollection();
    const users =  database.getUsersCollection();
    const product = await products.findOne({productKey: req.params.productId});
    const seller = await users.findOne({mail: product.owner});
    const purchaser = await users.findOne({mail: req.params.purchaser});
    await users.updateOne({mail: req.params.purchaser}, { $set: { balance: (parseInt(purchaser.balance) - parseInt(product.price))}});
    await users.updateOne({mail: product.owner},{ $set: { balance: (parseInt(seller.balance) + parseInt(product.price))}} );
    await products.updateOne({productKey: req.params.productId},{ $set: { status: "purchased"} });
	res.status(200).json({});
}

module.exports = {
    getProducts,
    publish,
    getProductData,
    pauseProduct,
    unpauseProduct,
    deleteProduct,
    purchaseProduct,
}

