const mongoDb = require("./mongoInit");

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
        transactions: db.collection("transactions"),
        addresses: db.collection("addresses"),
        generalStatus: db.collection("generalStatus"),
    };
}

function getClient(){
    return client;
}

function getDb(){
    return db;
}

function getTransactionsCollection(){
    return collections.transactions
}

function getAddressesCollection(){
    return collections.addresses
}

function getGeneralStatusCollection(){
    return collections.generalStatus
}

module.exports = {
    initialize,
    getTransactionsCollection,
    getAddressesCollection,
    getGeneralStatusCollection,
    getClient,
    getDb,
}