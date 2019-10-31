const database = require("../database/database");
const uuidv4 = require('uuid/v4');

async function publish(req, res){
    const products = database.getProductsCollection();
    const result = {};
    try{
        const item = {productName: req.body.productName,
            price: req.body.price,
            initialStock: req.body.initialStock,
            description: req.body.description,
            dues: req.body.dues,
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

module.exports = {
    publish,
}

