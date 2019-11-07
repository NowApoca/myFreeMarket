const mongoDb = require(__dirname + "/./mongoInit");

let db;
let collections;
let client;

async function initialize(database, settings){
    let dataBase;
    switch(database){
        case "mongo":
            dataBase = await mongoDb.initialize(settings);
        case "default":
            dataBase = await mongoDb.initialize(settings);
    }
    db = dataBase.db;
    client = dataBase.client;
    collections = {
        users: db.collection("users"),
        products: db.collection("products"),
        complains: db.collection("complains"),
        balance: db.collection("balances"),
        accounts: db.collection("accounts"),
        txs: db.collection("txs"),
    };
}

function getClient(){
    return client;
}

function getUsersCollection(){
    return collections.users
}

function getProductsCollection(){
    return collections.products
}

function getComplainsCollection (){
    return collections.complains
}

function getBalanceCollection (){
    return collections.balance
}

function getAccountsCollection (){
    return collections.accounts
}

function getTxsCollection (){
    return collections.txs
}


module.exports = {
    initialize,
    getProductsCollection,
    getUsersCollection,
    getClient,
    getComplainsCollection,
    getBalanceCollection,
    getAccountsCollection,
    getTxsCollection,
}