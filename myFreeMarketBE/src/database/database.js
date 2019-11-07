const mongoDb = require(__dirname + "/./mongoInit");

let db;
let collections;
let client;

async function initialize(dbType, settings){
    let dataBase;
    switch(dbType){
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

function getDb(){
    return db;
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
    getClient,
    getDb,
    getProductsCollection,
    getUsersCollection,
    getComplainsCollection,
    getBalanceCollection,
    getAccountsCollection,
    getTxsCollection,
}