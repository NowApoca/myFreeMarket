const apiBackEnd = require("../../src/requestBE");

async function rootDomain(req, res){
    if(res.locals.verified){
        const productsRequest = (await apiBackEnd.getBackEnd("/user-products/"+res.locals.user)).data;
        res.render('home', { user: res.locals.user, products: productsRequest.products});
    }else{
        res.render('index', { result: 'noooo0000000000000000000000000000oooo' });
    }
}

module.exports = {
    rootDomain,
}