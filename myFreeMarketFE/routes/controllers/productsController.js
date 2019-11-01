const apiBackEnd = require("../../src/requestBE")

async function publish(req, res){
    if(res.locals.verified){
        const product = {
          productName: req.body.productName,
          price: req.body.price,
          initialStock: req.body.initialStock,
          description: req.body.description,
          dues: req.body.dues,
          owner: res.locals.user,
        }
        let result = await apiBackEnd.postBackEnd("/publish", product);
        res.render('home',{result: result.data.result});
    }else{
        res.render('index', { result: 'noooo0000000000000000000000000000oooo' });
    }
}

module.exports = {
    publish
}