const mongoDb = require("./mongoInit");

let db;
let collections;
let client;

async function initialize(database){
    let dataBase;
    switch(database){
        case "mongo":
            dataBase = await mongoDb.initialize();
        case "default":
            dataBase = await mongoDb.initialize();
    }
    db = dataBase.db;
    client = dataBase.client;
    collections = {
        users: db.collection("users"),
        products: db.collection("products"),
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

module.exports = {
    initialize,
    getProductsCollection,
    getUsersCollection,
    getClient,
}