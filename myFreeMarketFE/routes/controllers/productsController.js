const apiBackEnd = require("../../src/requestBE")

const state = {
    available: "available",
    paused: "paused",
}

async function publish(req, res){
    if(res.locals.verified){
        const product = {
          productName: req.body.productName,
          price: req.body.price,
          initialStock: req.body.initialStock,
          description: req.body.description,
          dues: req.body.dues,
          owner: res.locals.user,
          state: state.available,
        }
        await apiBackEnd.postBackEnd("/publish", product);
    }
    res.redirect("/")
}

async function pause(req, res){
    if(res.locals.verified){
        const product = {
          productName: req.body.productName,
          price: req.body.price,
          initialStock: req.body.initialStock,
          description: req.body.description,
          dues: req.body.dues,
          owner: res.locals.user,
          state: state.available,
        }
        let result = await apiBackEnd.postBackEnd("/pause", product);
        res.render('home',{result: result.data.result});
    }else{
        res.render('index', { result: 'noooo0000000000000000000000000000oooo' });
    }
}

async function unPause(req, res){
    if(res.locals.verified){
        let result = await apiBackEnd.postBackEnd("/publish", product);
        res.render('home',{result: result.data.result});
    }else{
        res.render('index', { result: 'noooo0000000000000000000000000000oooo' });
    }
}

module.exports = {
    publish
}