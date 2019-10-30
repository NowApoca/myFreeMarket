const client = require("mongodb").MongoClient;
const assert = require("assert");


async function initialize(){
    const url = "mongodb://localhost:27017";
    const dbName = "myFreeMarket";
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
        await db.createCollection("users")
    }
    if(!doesCollectionExist(collections,"products")){
        await db.createCollection("products")
        
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