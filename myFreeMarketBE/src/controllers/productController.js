const database = require(__dirname + "/../database/database");
const uuidv4 = require('uuid/v4');

async function getProducts(req, res){
    const products = database.getProductsCollection();
    const queryResult = await products.find({status: {"$ne": "purchased"}});
    let output = [];
    if(await queryResult.count() == 0){
        res.statusMessage = "No products available."
        res.status(400).end();
        return;
    }
    await queryResult.forEach(function(item){
        if(item){
            output.push(item);
        }
    })
	res.status(200).json(output);
}

async function publish(req, res){
    const products = database.getProductsCollection();
    const { price, initialStock, description, dues, owner, productName} = res.locals
    const result = {};
    const item = {
        productName: productName,
        price: price,
        initialStock: initialStock,
        description: description,
        dues: dues,
        status: "available",
        owner: owner,
        productKey: uuidv4(),
        timestamp: Math.trunc((new Date()).getTime()/1000),
        comments: [],
        availableStock: initialStock,
    }
    try{
        
        await products.insertOne(item);
        
    }catch(e){
        console.log(e);
        result.id = null;
        result.result = "err";
    }
	res.status(200).json(item.productKey);
}

async function getProductData(req, res){
    const { productData } = res.locals;
    const products =  database.getProductsCollection();
    if(productData === null){
        res.statusMessage = "Product key '"+ req.params.id +"' does not exist as a product.";
        res.status(404).end();
        return;
    }
	res.status(200).json(productData);
}

async function pauseProduct(req, res){
    const { productData } = res.locals;
    const products =  database.getProductsCollection();
    await products.updateOne({productKey: productData.productKey},{ $set: { status: "paused"} });
	res.status(200).json();
}

async function unpauseProduct(req, res){
    const { productData } = res.locals;
    const products =  database.getProductsCollection();
    await products.updateOne({productKey: productData.productKey},{ $set: { status: "available"} });
	res.status(200).json();
}

async function deleteProduct(req, res){
    const { productData } = res.locals;
    const products =  database.getProductsCollection();
    await products.deleteOne({productKey: productData.productKey});
	res.status(200).json();
}

async function purchaseProduct(req, res){
    const products =  database.getProductsCollection();
    const users =  database.getUsersCollection();

    const product = await products.findOne({productKey: req.params.productId});
    if(product.availableStock <= 0){
        res.statusMessage = "There is no stock for that item."
        res.status(404).end();
    }
    const seller = await users.findOne({mail: product.owner});
    const purchaser = await users.findOne({mail: req.params.purchaser});
    const purchaserBalance = await users.findOne({mail: req.params.purchaser});
    if(purchaserBalance.balance < product.price){
        res.statusMessage = "Not enough founds. You need '" + (product.price - purchaserBalance.balance) + "' more for buying that product."
        res.status(404).end();
        return;
    }
    await products.updateOne({productKey: req.params.productId},{ $set: { status: "purchased"} });
    seller.sales.push(product.productKey)
    purchaser.purchases.push(product.productKey)
    await users.updateOne({mail: product.owner},{ "$set": { sales: seller.sales, balance: (parseInt(seller.balance) + parseInt(product.price))}});
    await users.updateOne({mail: req.params.purchaser},{ $set: { purchases: purchaser.purchases, balance: (parseInt(purchaser.balance) - parseInt(product.price)) }});
	res.status(200).json({});
}

async function commentProduct(req, res){
    const products =  database.getProductsCollection();
    const product = await products.findOne({productKey: req.params.productId});
    product.comments.push({
        comment: req.body.comment,
        timestamp: req.body.timestamp,
        user: req.body.user,
        comments: [],
    })
    await products.updateOne({productKey: req.params.productId}, {"$set": {comments: product.comments}});
	res.status(200).json({});
}

async function commentProduct(req, res){
    const products =  database.getProductsCollection();
    const product = await products.findOne({productKey: req.params.productId});
    product.comments.push({
        text: req.body.text,
        timestamp: Math.trunc((new Date()).getTime()/1000),
        user: req.body.user,
        subcomments: [],
        points: 0,
        voters: [],
    })
    await products.updateOne({productKey: req.params.productId}, {"$set": {comments: product.comments}});
	res.status(200).json();
}
// a
async function voteCommentProduct(req, res){
    const products =  database.getProductsCollection();
    const product = await products.findOne({productKey: req.params.productId});
    if(product.comments[parseInt(req.params.numberComment)].voters.indexOf(req.body.user)>=0){
        res.statusMessage = "You have already upvoted it."
        res.status(404).end();
        return;
    }
    if(req.params.action == "downvote"){
        product.comments[parseInt(req.params.numberComment)].points--;
    }else{
        product.comments[parseInt(req.params.numberComment)].points++;
    }
    product.comments[parseInt(req.params.numberComment)].voters.push(req.body.user);
    await products.updateOne({productKey: req.params.productId}, {"$set": {comments: product.comments}});
	res.status(200).json();
}

async function subcommentComment(req, res){
    const products =  database.getProductsCollection();
    const product = await products.findOne({productKey: req.params.productId});
    product.comments[parseInt(req.params.numberComment)].subcomments.push({
        text: req.body.text,
        timestamp: Math.trunc((new Date()).getTime()/1000),
        user: req.body.user,
    })
    await products.updateOne({productKey: req.params.productId}, {"$set": {comments: product.comments}});
	res.status(200).json({});
}


async function voteSubcommentProduct(req, res){
    const products =  database.getProductsCollection();
    const product = await products.findOne({productKey: req.params.productId});
    if(product.comments[parseInt(req.params.numberComment)].subcomments[parseInt(req.params.numberSubcomment)].voters.indexOf(req.body.user)>=0){
        res.statusMessage = "You have already upvoted it."
        res.status(404).end();
        return;
    }
    if(req.params.action == "downvote"){
        product.comments[parseInt(req.params.numberComment)].subcomments[parseInt(req.params.numberSubcomment)].points--;
    }else{
        product.comments[parseInt(req.params.numberComment)].subcomments[parseInt(req.params.numberSubcomment)].points++;
    }
    product.comments[parseInt(req.params.numberComment)].voters.push(req.body.user);
    await products.updateOne({productKey: req.params.productId}, {"$set": {comments: product.comments}});
	res.status(200).json();
}

async function changeProductParameters(req, res){
    const products =  database.getProductsCollection();
    await products.findOne({productKey: req.params.productId});
    let obj = {};
    obj[req.params.parameter] = req.params.value;
    await products.updateOne({productKey: req.params.productId}, {"$set": obj});
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
    commentProduct,
    voteCommentProduct,
    subcommentComment,
    voteSubcommentProduct,
    changeProductParameters,
}

