

function rootDomain(req, res){
    if(res.locals.verified){
        res.render('home', { result: 'noooo0000000000000000000000000000oooo' });
    }else{

        res.render('index', { result: 'noooo0000000000000000000000000000oooo' });
    }
}

module.exports = {
    rootDomain,
}