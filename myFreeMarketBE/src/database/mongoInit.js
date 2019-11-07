const client = require("mongodb").MongoClient;
const assert = require("assert");


async function initialize(settings){
    const url = settings.dbUrl;
    const dbName = settings.dbName;
    const db = await new Promise(function(resolve, reject){
        client.connect(url,async function(err, client){
            assert.equal(null, err);
            const db = client.db(dbName);
            resolve(db);
        })
    })
    await createCollections(db);
    return{db:db, client:client};
}

async function createCollections(db){
    const collections = await db.collections()
    if(!doesCollectionExist(collections,"users")){
       await (await db.createCollection("users")).createIndexes([ { key: { 'mail': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"products")){
        await (await db.createCollection("products")).createIndexes([ { key: { 'productKey': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"complains")){
        await (await db.createCollection("complains")).createIndexes([ { key: { 'complainKey': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"balances")){
        await (await db.createCollection("balances")).createIndexes([ { key: { 'mail': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"accounts")){
        await (await db.createCollection("accounts")).createIndexes([ { key: { 'address': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"txs")){
        await (await db.createCollection("txs")).createIndexes([ { key: { 'txID': 1 }, unique: true } ])
    }
}

function doesCollectionExist(collections, collectionName){
    for(const collection of collections){
        if(collection.collectionName == collectionName){
            return true;
        }
    }
    return false;
}

module.exports = {
    initialize
}