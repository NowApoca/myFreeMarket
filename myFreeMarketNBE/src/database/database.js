const mongoDb = require("./mongoInit");

let db;
let collections;
let client;
const addressesConfigName = "addresses-status"

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
        users: db.collection("users"),
    };
    const config = await collections.generalStatus.findOne({name: addressesConfigName})
    if(config === null){
        await collections.generalStatus.insertOne({
            name: addressesConfigName,
            next_accountId: Math.floor(Math.random() * (1000000 - 1)) + 1,
        })
    }
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


function getUsersCollection(){
    return collections.users
}

module.exports = {
    initialize,
    getTransactionsCollection,
    getAddressesCollection,
    getGeneralStatusCollection,
    getUsersCollection,
    getClient,
    getDb,
}