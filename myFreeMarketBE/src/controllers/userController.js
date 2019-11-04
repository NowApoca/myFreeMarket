const database = require("../database/database");

async function getUserProducts(req, res){
    const products = database.getProductsCollection();
    const queryResult = await products.find({owner: req.body.user});
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
module.exports = {
    getUserProducts,
}