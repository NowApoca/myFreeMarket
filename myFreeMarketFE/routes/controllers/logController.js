
function rootDomain(req, res){
    if(res.locals.verified){
        res.render('home', { user: res.locals.user });
    }else{
        res.render('index', { result: 'noooo0000000000000000000000000000oooo' });
    }
}

module.exports = {
    rootDomain,
}