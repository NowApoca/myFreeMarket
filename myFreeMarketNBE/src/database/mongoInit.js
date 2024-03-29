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
    const collections = await db.collections();
    if(!doesCollectionExist(collections,"transactions")){
       await (await db.createCollection("transactions")).createIndexes([ { key: { 'txHash': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"addresses")){
       await (await db.createCollection("addresses")).createIndexes([ { key: { 'address': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"users")){
       await (await db.createCollection("users")).createIndexes([ { key: { 'mail': 1 }, unique: true } ])
    }
    if(!doesCollectionExist(collections,"generalStatus")){
       await (await db.createCollection("generalStatus")).createIndexes([ { key: { 'name': 1 }, unique: true } ])
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